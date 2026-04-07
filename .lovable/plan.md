
Plan to make preview tracking 100% reliable while keeping production unchanged

1) Harden preview detection (in src/services/loginService.ts)
- Add a utility inside trackDocumentClick to treat BOTH scenarios as “preview”:
  - embedded in an iframe (window.self !== window.top or cross-origin access throws)
  - running on a lovableproject.com host (window.location.hostname endsWith('lovableproject.com'))

Code change:
- In trackDocumentClick:
  - Add:
    const isEmbeddedPreview = (() => { try { return window.self !== window.top; } catch { return true; } })();
    const isLovablePreviewDomain = /\.lovableproject\.com$/.test(window.location.hostname);
    const useEdgeFunction = isEmbeddedPreview || isLovablePreviewDomain;
  - If useEdgeFunction is true, call supabase.functions.invoke('track-document-action', ...) and:
    - Log both success and any error explicitly.
    - Return early.

2) Switch Documents page to the “open first, track in background” pattern (src/pages/Documents.tsx)
- Current handler awaits trackDocumentClick and only then opens the URL. That risks popup blocking in preview.
- Replace with fire-and-forget:
  - e.preventDefault()
  - window.open(url, '_blank', 'noopener,noreferrer') immediately
  - trackDocumentClick(...) .catch(console.error) afterward
- Also switch action strings to TRACKING_ACTIONS constants for consistency:
  - const action = type === 'Video' ? TRACKING_ACTIONS.VIDEO_CLICKED : TRACKING_ACTIONS.DOCUMENT_CLICKED

Example:
const handleTrackedClick = (url: string, type: string, title: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  e.stopPropagation();
  window.open(url, '_blank', 'noopener,noreferrer');
  if (user?.id) {
    const action = type === 'Video' ? TRACKING_ACTIONS.VIDEO_CLICKED : TRACKING_ACTIONS.DOCUMENT_CLICKED;
    trackDocumentClick(user.id, url, action, title).catch(err => console.error('[Documents] Background tracking failed:', err));
  }
};

3) Confirm KeyDocuments and RecentUpdates already use the safe pattern
- They now open immediately and track in the background. No change needed.

4) Improve logs so you can verify in preview, fast
- In trackDocumentClick when we use the edge function, log:
  - “[trackDocumentClick] Edge function invoked”
  - “Edge function result: success” or error details
- This gives you immediate console confirmation in preview while CRM may lag.

5) Quick sanity tests to close the loop
- In preview (inside the editor OR opened in a new tab with a lovableproject.com domain):
  - Dashboard > Key Documents
    - Click “WMC Motorsports Reimagined!”
    - Click “Investor Executive Summary Deck”
  - Documents page
    - Click both items
- Expected console:
  - [trackDocumentClick] START
  - [trackDocumentClick] Embedded preview detected — using Edge Function fallback OR lovableproject.com detected — using Edge Function fallback
  - [trackDocumentClick] ===== EDGE FUNCTION INVOKED =====
  - And in Edge Function logs: “Successfully tracked document action”

Notes
- Production keeps using the iframe method (which you confirmed works).
- Preview always uses the edge function after this change (embedded or not), eliminating the last preview-specific inconsistencies.
