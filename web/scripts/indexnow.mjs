// Notify Bing (and other IndexNow engines: Yandex, Naver, Seznam) about every
// URL in the built sitemap. Run after deploying changes:  npm run indexnow
// The key file public/<KEY>.txt must already be live on https://angelcables.com.
import { readFile } from "node:fs/promises";
import path from "node:path";

const KEY = "f4f55588fca7346204cee449fddff915";
const HOST = "angelcables.com";

const sitemap = await readFile(path.join(process.cwd(), "out", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file https://${HOST}/${KEY}.txt is not live yet — deploy first.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} ${res.statusText} for ${urlList.length} URLs`);
const body = await res.text();
if (body) console.log(body);
if (res.status !== 200 && res.status !== 202) process.exit(1);
