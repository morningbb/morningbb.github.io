self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Let the real static file through
  if (url.pathname === "/robots.txt") {
    event.respondWith(fetch(event.request));
    return;
  }
});

importScripts(
  "https://cdn.jsdelivr.net/npm/@webrecorder/wabac/dist/sw.js",
);
