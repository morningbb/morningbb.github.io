const LIVE_PREFIXES = [
  "https://skatingvideo.s3.amazonaws.com/",
];

// Try to recover a live target URL from whatever wabac-style request comes in.
function extractLiveTarget(requestUrl) {
  const candidates = [requestUrl];

  try {
    candidates.push(decodeURIComponent(requestUrl));
  } catch (e) {}

  for (const text of candidates) {
    for (const prefix of LIVE_PREFIXES) {
      const idx = text.indexOf(prefix);
      if (idx !== -1) {
        return text.slice(idx);
      }
    }
  }

  return null;
}


self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Let the real static file through
  if (url.pathname === "/robots.txt") {
    event.respondWith(fetch(event.request));
    return;
  }

  const target = extractLiveTarget(event.request.url);

  if (!target) {
    return;
  }

  console.log(event.request.destination);
  // Pass through to the real network, preserving Range for video.
  const headers = new Headers(event.request.headers);

  event.respondWith(
    fetch(target, {
      method: event.request.method,
      headers,
      mode: "no-cors",
      referrer: "",
      referrerPolicy: "no-referrer",
      credentials: "omit",
      redirect: "follow",
    })
  );
});

importScripts(
  "https://cdn.jsdelivr.net/npm/@webrecorder/wabac/dist/sw.js",
);
