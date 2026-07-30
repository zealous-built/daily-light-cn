import assert from "node:assert/strict";
import test from "node:test";
import {
  getDailyExperience,
  getDayPeriod,
  getLocalDayKey,
  quotes,
  themes,
} from "../app/daily.ts";

test("ships a curated, non-repeating run of motivational classics", () => {
  assert.ok(quotes.length >= 60);
  assert.equal(new Set(quotes.map((quote) => quote.id)).size, quotes.length);
  assert.equal(new Set(quotes.map((quote) => quote.text)).size, quotes.length);
  assert.ok(quotes.every((quote) => quote.text.trim().length >= 6));
  assert.ok(quotes.every((quote) => quote.translation.trim().length >= 6));
  assert.ok(
    quotes.every(
      (quote) =>
        quote.dynasty
        && quote.author
        && quote.source
        && quote.category,
    ),
  );
});

test("maps local time to the three selected classical backgrounds", () => {
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 4, 59)), "evening");
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 5, 0)), "morning");
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 11, 59)), "morning");
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 12, 0)), "afternoon");
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 17, 59)), "afternoon");
  assert.equal(getDayPeriod(new Date(2026, 6, 30, 18, 0)), "evening");
});

test("ships 120 complete, uniquely named themes", () => {
  assert.equal(themes.length, 120);
  assert.equal(new Set(themes.map((theme) => theme.id)).size, 120);
  assert.equal(new Set(themes.map((theme) => theme.name)).size, 120);
  for (const theme of themes) {
    for (const field of [
      "background",
      "foreground",
      "accent",
      "surface",
      "muted",
      "glow",
      "fontFamily",
      "layout",
      "decor",
      "motion",
    ]) {
      assert.ok(theme[field], `${theme.id} is missing ${field}`);
    }
  }
});

test("keeps a local day stable and changes both selections tomorrow", () => {
  const morning = new Date(2026, 6, 29, 8, 15);
  const evening = new Date(2026, 6, 29, 23, 59);
  const tomorrow = new Date(2026, 6, 30, 0, 0);
  const first = getDailyExperience(morning);
  const sameDay = getDailyExperience(evening);
  const nextDay = getDailyExperience(tomorrow);

  assert.equal(getLocalDayKey(morning), "2026-07-29");
  assert.equal(first.quote.id, sameDay.quote.id);
  assert.equal(first.theme.id, sameDay.theme.id);
  assert.notEqual(first.quote.id, nextDay.quote.id);
  assert.notEqual(first.theme.id, nextDay.theme.id);
});

test("handles month, year and leap-day boundaries", () => {
  const boundaries = [
    [new Date(2026, 0, 31, 23, 59), new Date(2026, 1, 1, 0, 0)],
    [new Date(2026, 11, 31, 23, 59), new Date(2027, 0, 1, 0, 0)],
    [new Date(2028, 1, 28, 23, 59), new Date(2028, 1, 29, 0, 0)],
    [new Date(2028, 1, 29, 23, 59), new Date(2028, 2, 1, 0, 0)],
  ];

  for (const [before, after] of boundaries) {
    const first = getDailyExperience(before);
    const second = getDailyExperience(after);
    assert.notEqual(first.dayKey, second.dayKey);
    assert.notEqual(first.quote.id, second.quote.id);
    assert.notEqual(first.theme.id, second.theme.id);
  }
});
