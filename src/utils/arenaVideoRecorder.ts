import { startAdaptiveMusic } from './musicEngine';
import { getSharedAudioContext } from './soundEngine';

export interface ActiveArenaVideoSession {
  stopAndDownload: () => void;
  cancelWithoutDownload: () => void;
  mimeType: string;
  fileExtension: 'mp4' | 'webm';
}

function slugifyPart(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);
}

function pickBestRecorderMimeType(): { mimeType: string; ext: 'mp4' | 'webm' } {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return { mimeType: 'video/webm', ext: 'webm' };
  }
  const candidates: Array<{ mimeType: string; ext: 'mp4' | 'webm' }> = [
    { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { mimeType: 'video/mp4;codecs=avc1,opus', ext: 'mp4' },
    { mimeType: 'video/mp4', ext: 'mp4' },
    { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mimeType: 'video/webm', ext: 'webm' },
  ];
  for (const item of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(item.mimeType)) {
        return item;
      }
    } catch {
      // try next
    }
  }
  return { mimeType: 'video/webm', ext: 'webm' };
}

export function isArenaVideoCaptureSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getDisplayMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

export async function startArenaVideoCapture(params: {
  stageElement: HTMLElement | null;
  southName: string;
  northName: string;
  onAutoStopped?: () => void;
}): Promise<ActiveArenaVideoSession | null> {
  if (!isArenaVideoCaptureSupported()) return null;

  try {
    getSharedAudioContext();
    startAdaptiveMusic();
  } catch {
    // ignore audio unlock errors
  }

  let displayStream: MediaStream;
  try {
    const constraints: DisplayMediaStreamOptions & Record<string, unknown> = {
      video: {
        frameRate: { ideal: 60, max: 60 },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: true,
      preferCurrentTab: true,
      selfBrowserSurface: 'include',
      surfaceSwitching: 'exclude',
      monitorTypeSurfaces: 'exclude',
      systemAudio: 'exclude',
    };
    displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch {
    return null;
  }

  const videoTrack = displayStream.getVideoTracks()[0];
  if (!videoTrack) {
    displayStream.getTracks().forEach((t) => t.stop());
    return null;
  }

  // Crop strictly to the 3D BattleArena stage if Region Capture API is available (Chromium 104+)
  try {
    const winAny = window as unknown as {
      CropTarget?: { fromElement: (el: Element) => Promise<unknown> };
    };
    const trackAny = videoTrack as MediaStreamTrack & {
      cropTo?: (target: unknown) => Promise<void>;
    };
    if (params.stageElement && winAny.CropTarget && typeof trackAny.cropTo === 'function') {
      const cropTarget = await winAny.CropTarget.fromElement(params.stageElement);
      await trackAny.cropTo(cropTarget);
    }
  } catch {
    // Fallback cleanly to full-tab capture if cropping is unsupported
  }

  const { mimeType, ext } = pickBestRecorderMimeType();
  const chunks: BlobPart[] = [];
  let shouldSave = true;
  let finalized = false;

  const recorder = new MediaRecorder(displayStream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
    audioBitsPerSecond: 192_000,
  });

  recorder.ondataavailable = (ev: BlobEvent) => {
    if (ev.data && ev.data.size > 0) {
      chunks.push(ev.data);
    }
  };

  const finalizeDownload = () => {
    if (finalized) return;
    finalized = true;
    displayStream.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {
        // ignore
      }
    });

    if (shouldSave && chunks.length > 0) {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const dateStamp = new Date().toISOString().slice(0, 10);
      const sSlug = slugifyPart(params.southName || 'soberano-sul');
      const nSlug = slugifyPart(params.northName || 'soberano-norte');
      const fileName = `chromatic-pact-${sSlug}-vs-${nSlug}-${dateStamp}.${ext}`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 4000);
    }

    params.onAutoStopped?.();
  };

  recorder.onstop = finalizeDownload;
  videoTrack.addEventListener('ended', () => {
    if (recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        finalizeDownload();
      }
    } else {
      finalizeDownload();
    }
  });

  recorder.start(500);

  return {
    mimeType,
    fileExtension: ext,
    stopAndDownload: () => {
      shouldSave = true;
      if (recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          finalizeDownload();
        }
      } else {
        finalizeDownload();
      }
    },
    cancelWithoutDownload: () => {
      shouldSave = false;
      if (recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          finalizeDownload();
        }
      } else {
        finalizeDownload();
      }
    },
  };
}
