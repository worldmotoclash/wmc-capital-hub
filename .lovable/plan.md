

# Fetch Video Playlist from API

## Overview
Replace the hardcoded video array in the home page hero section with a dynamic fetch from the Real Intelligence content playlist API. The API returns XML with video entries including YouTube URLs, titles, subtitles, and ordering.

## API Details
- **URL**: `https://api.realintelligence.com/api/wmc-content-playlist.py?orgId=00D5e000000HEcP&playlistId=a2H5e000002JD7g&sandbox=False`
- **Format**: XML with `<content>` elements containing `<contenturl>`, `<fullname>` (title), `<subtitle>`, `<contentname>`, `<playlistorder>`, `<lengthinseconds>`
- Currently returns 5 videos: Laguna Seca Racing, Norman Reedus, Miguel Duhamel, Colin Edwards, Night Street Racing

## Changes

### 1. Update `src/components/HeroSection.tsx`
- Remove the hardcoded `videos` array
- Add a `useEffect` + `useState` to fetch and parse the XML API on mount
- Parse XML using `DOMParser`, extract each `<content>` element, and map to `VideoData[]`:
  - `id` from `<playlistorder>`
  - `videoSrc` from `<contenturl>` (strip CDATA wrappers)
  - `videoTitle` from `<contentname>`
  - `title` from `<fullname>` (strip CDATA)
  - `subtitle` from `<subtitle>` (strip CDATA)
  - `duration` default 8000
- Sort by `playlistorder`
- Show a loading state while fetching; render `VideoCarousel` once data arrives
- Keep a small hardcoded fallback array in case the API fails

### 2. No changes to `VideoCarousel.tsx`
The carousel already accepts `VideoData[]` and handles YouTube embed URLs. The API provides URLs in the same embed format the carousel expects.

## Technical Notes
- The API returns XML, not JSON — will use browser-native `DOMParser` to parse
- CDATA content in the XML appears as HTML comments (`<!--[CDATA[...]]-->`) in the fetched response; the parser should extract text content which strips these
- The `contenturl` already includes autoplay/mute/loop parameters matching what `getEnhancedVideoUrl` in VideoCarousel generates, so videos will play correctly

