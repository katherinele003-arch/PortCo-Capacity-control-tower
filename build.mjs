import { mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";

const files = {
  "/": { body: readFileSync("index.html", "utf8"), type: "text/html; charset=utf-8" },
  "/index.html": { body: readFileSync("index.html", "utf8"), type: "text/html; charset=utf-8" },
  "/styles.css": { body: readFileSync("styles.css", "utf8"), type: "text/css; charset=utf-8" },
  "/app.js": { body: readFileSync("app.js", "utf8"), type: "application/javascript; charset=utf-8" },
  "/sw.js": { body: readFileSync("sw.js", "utf8"), type: "application/javascript; charset=utf-8" },
  "/manifest.webmanifest": { body: readFileSync("manifest.webmanifest", "utf8"), type: "application/manifest+json; charset=utf-8" }
};

mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");

writeFileSync(
  "dist/server/index.js",
  `const files = ${JSON.stringify(files)};\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    const file = files[url.pathname] || files[\"/\"];\n    return new Response(file.body, {\n      headers: {\n        \"content-type\": file.type,\n        \"cache-control\": \"no-store\"\n      }\n    });\n  }\n};\n`
);
