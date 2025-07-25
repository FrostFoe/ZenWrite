if (!self.define) {
  let e,
    s = {};
  const n = (n, t) => (
    (n = new URL(n + ".js", t).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (t, a) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let c = {};
    const r = (e) => n(e, i),
      u = { module: { uri: i }, exports: c, require: r };
    s[i] = Promise.all(t.map((e) => u[e] || r(e))).then((e) => (a(...e), c));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "c31db5255975992cd81179fca47109be",
        },
        {
          url: "/_next/static/6J_pP-JBFWusjsgp4L9f1/_buildManifest.js",
          revision: "91547144f5ad1e5a462af9cbe45a049e",
        },
        {
          url: "/_next/static/6J_pP-JBFWusjsgp4L9f1/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/243dde97.c71d21dcd68baf0b.js",
          revision: "c71d21dcd68baf0b",
        },
        {
          url: "/_next/static/chunks/252-b553185c190582ca.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/302-4f7e7db13859d20b.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/450.ae2c37066584b4e4.js",
          revision: "ae2c37066584b4e4",
        },
        {
          url: "/_next/static/chunks/469.8eebbada9c4fb9e0.js",
          revision: "8eebbada9c4fb9e0",
        },
        {
          url: "/_next/static/chunks/4bd1b696-23d99a3fd7c510c1.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/684-091371fde303baca.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/733-46c3f45ebb623327.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/814-fef384fd51096c50.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/94-e786abbca2fc5903.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/972-03cbd4d20702220f.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/976-9a3cbd04d6757da4.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/978-34e08d6b6f4cec9f.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/(app)/editor/%5BnoteId%5D/page-74bcb095f7ffda59.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/(app)/layout-4259011005cfd6d5.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/(app)/notes/page-a6baefa3c85fb61f.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/(app)/settings/page-907ca29ce85f54f1.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-4a9f6c3a7110353c.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/layout-02733579731a8ace.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/loading-198da46143f9f761.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/app/page-687dfdffc8d1b6e5.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/framework-6d868e9bc95e10d8.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/main-4396f03206d7ec6f.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/main-app-9f4f66c0efa5e0b9.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/pages/_app-da15c11dea942c36.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-af863134af75321d.js",
          revision: "6J_pP-JBFWusjsgp4L9f1",
        },
        {
          url: "/_next/static/css/58b712ed44011f9e.css",
          revision: "58b712ed44011f9e",
        },
        {
          url: "/_next/static/media/3ea367e332ac03fa-s.woff2",
          revision: "9de3fe8c7e242b9cdb6b51eb6fef3e04",
        },
        {
          url: "/_next/static/media/dcb7291b194d3592-s.p.woff2",
          revision: "f4163defd48bca692bb1469bf87fce38",
        },
        {
          url: "/_next/static/media/fc858f5903b47ada-s.woff2",
          revision: "98a62251731d79ddab60f3f982e5f481",
        },
        { url: "/manifest.json", revision: "cb3d830675d2e8747db21f53e33be510" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: t,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
