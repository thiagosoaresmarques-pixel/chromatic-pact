import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Built-in Real-Time 1v1 Multiplayer & Matchmaking Relay for Test Mode.
 * Allows any two tabs, different browsers (Chrome/Edge/Incognito), or devices on the same LAN/tunnel
 * to discover rooms, pair in 1v1 matchmaking, and exchange match moves in real time!
 */
function chromaticMultiplayerRelayPlugin(): Plugin {
  const sseClients = new Set<ServerResponse>();
  const activeRooms = new Map<string, unknown>();

  const broadcastEvent = (payload: unknown) => {
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of sseClients) {
      try {
        res.write(data);
      } catch {
        sseClients.delete(res);
      }
    }
  };

  return {
    name: 'chromatic-multiplayer-relay',
    configureServer(server) {
      server.middlewares.use('/api/mp', (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url || '/';

        // 1. SSE Stream for Real-Time Events
        if (req.method === 'GET' && url.startsWith('/stream')) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          res.write(
            `data: ${JSON.stringify({
              type: 'ROOMS_SNAPSHOT',
              rooms: Array.from(activeRooms.values()),
            })}\n\n`
          );
          sseClients.add(res);
          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        // 2. Publish Event / Room State Update
        if (req.method === 'POST' && url.startsWith('/publish')) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const msg = JSON.parse(body);
              if (msg.type === 'ROOM_UPSERT' && msg.room?.code) {
                activeRooms.set(msg.room.code, msg.room);
              } else if (msg.type === 'ROOM_REMOVE' && msg.roomCode) {
                activeRooms.delete(msg.roomCode);
              }
              broadcastEvent(msg);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.writeHead(400);
              res.end(JSON.stringify({ ok: false }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), chromaticMultiplayerRelayPlugin()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('node_modules')) {
            return 'vendor-react';
          }
          if (norm.includes('/src/data/cards') || norm.includes('/src/data/decks')) {
            return 'data-cards-decks';
          }
          if (norm.includes('/src/engine/')) {
            return 'engine-core';
          }
          if (
            norm.includes('/src/data/epicPoem') ||
            norm.includes('/src/data/lore') ||
            norm.includes('/src/components/MythologyAtlasView')
          ) {
            return 'mythology-codex';
          }
          if (
            norm.includes('vaeloriaMapData') ||
            norm.includes('vaeloriaMultimapData') ||
            norm.includes('vaeloriaConquestData') ||
            norm.includes('vaeloriaOverworldEvents')
          ) {
            return 'maps-vaeloria';
          }
          return undefined;
        },
      },
    },
  },
});
