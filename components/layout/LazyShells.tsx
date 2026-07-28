'use client';

import dynamic from 'next/dynamic';

// These are heavy client-only interactive overlays.
// Lazy-load them so they NEVER block the initial page paint.
// ssr:false is valid here because this is a 'use client' component.

const CommandPalette = dynamic(
  () => import('./CommandPalette').then(m => ({ default: m.CommandPalette })),
  { ssr: false }
);

const AIAssistant = dynamic(
  () => import('../ai/AIAssistant').then(m => ({ default: m.AIAssistant })),
  { ssr: false }
);

export function LazyShells() {
  return (
    <>
      <CommandPalette />
      <AIAssistant />
    </>
  );
}
