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
