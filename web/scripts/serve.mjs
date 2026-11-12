// Minimal static server for ./out that mimics Netlify: clean URLs (/about -> about.html)
// and a real 404 status with 404.html.  Usage: node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = Number(process.argv[2] || process.env.PORT || 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".svg": "image/svg+xml", ".png": "image/png",
  ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon",
};

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const base = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ""));
  const candidates = urlPath === "/" ? [path.join(ROOT, "index.html")] : [base, `${base}.html`, path.join(base, "index.html")];
  let file = null;
  for (const c of candidates) if (await isFile(c)) { file = c; break; }
  const status = file ? 200 : 404;
  file ||= path.join(ROOT, "404.html");
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
