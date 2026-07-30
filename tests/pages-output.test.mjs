import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds a GitHub Pages entry with repository-relative assets", async () => {
  const html = await readFile(
    new URL("../pages-dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>日日向光｜每日古文，古今相照<\/title>/);
  assert.match(html, /\/daily-light-cn\/assets\//);
  assert.match(html, /https:\/\/zealous-built\.github\.io\/daily-light-cn\/og-classics\.png/);
  assert.doesNotMatch(html, /src="\/assets\//);
});

test("covers the viewport edge with a tiny vertical bleed and no horizontal scrollbar", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(css, /html,\s*\nbody\s*\{[^}]*overflow-x:\s*hidden[^}]*overflow-y:\s*auto/s);
  assert.match(css, /#root\s*\{[^}]*min-height:\s*calc\(100% \+ 8px\)/s);
  assert.match(css, /html,\s*\nbody\s*\{[^}]*background:\s*var\(--page-background,\s*#082f3d\)/s);
  assert.match(css, /#root\s*\{[^}]*background:\s*var\(--page-background,\s*#082f3d\)/s);
  assert.match(css, /\.daily-page\s*\{[^}]*position:\s*relative[^}]*min-height:\s*calc\(100dvh \+ 8px\)/s);
  assert.match(css, /body::-webkit-scrollbar\s*\{[^}]*width:\s*0[^}]*height:\s*0/s);
  assert.match(css, /grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto/);
  assert.match(css, /\.classic-compare\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto minmax\(0,\s*1fr\)/s);
});
