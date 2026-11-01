export interface NavigateToPoemDetail {
  cardId: string;
  cantoId: string;
  chapterId: string;
  nodeId: string;
}

export const NAVIGATE_TO_POEM_EVENT = 'chromatic-pact:navigate-poem';

export function dispatchNavigateToPoem(detail: NavigateToPoemDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<NavigateToPoemDetail>(NAVIGATE_TO_POEM_EVENT, { detail }));
}
