import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a GitHub Pages entry with repository-relative assets", async () => {
  const html = await readFile(
    new URL("../pages-dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>日日向光｜每天一句，向光而行<\/title>/);
  assert.match(html, /\/daily-light-cn\/assets\//);
  assert.match(html, /https:\/\/zealous-built\.github\.io\/daily-light-cn\/og\.png/);
  assert.doesNotMatch(html, /src="\/assets\//);
});

test("locks the experience to one viewport without page scrolling", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(css, /html,\s*\nbody\s*\{[^}]*height:\s*100%[^}]*overflow:\s*hidden/s);
  assert.match(css, /#root\s*\{[^}]*height:\s*100%[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.daily-page\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0/s);
  assert.match(css, /grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto/);
});
