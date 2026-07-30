import assert from "node:assert/strict";
import test from "node:test";
import {
  getDailyExperience,
  getDayPeriod,
  getLocalDayKey,
  getPeriodIndex,
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
  assert.equal(getPeriodIndex(new Date(2026, 6, 30, 8, 0)), 0);
  assert.equal(getPeriodIndex(new Date(2026, 6, 30, 13, 0)), 1);
  assert.equal(getPeriodIndex(new Date(2026, 6, 30, 20, 0)), 2);
});

test("keeps the displayed translation within the quoted original", () => {
  const quote = quotes.find((item) =>
    item.text === "受任于败军之际，奉命于危难之间"
  );
  assert.equal(
    quote?.translation,
    "在兵败之际接受任命，在危难之中奉行使命。",
  );
  assert.doesNotMatch(quote?.translation ?? "", /二十一年/);
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

test("changes the complete experience exactly three times per day", () => {
  const morning = getDailyExperience(new Date(2026, 6, 29, 5, 0));
  const morningLater = getDailyExperience(new Date(2026, 6, 29, 11, 59));
  const afternoon = getDailyExperience(new Date(2026, 6, 29, 12, 0));
  const evening = getDailyExperience(new Date(2026, 6, 29, 18, 0));
  const afterMidnight = getDailyExperience(new Date(2026, 6, 30, 0, 30));
  const nextMorning = getDailyExperience(new Date(2026, 6, 30, 5, 0));

  assert.equal(getLocalDayKey(new Date(2026, 6, 29)), "2026-07-29");
  assert.equal(morning.experienceKey, morningLater.experienceKey);
  assert.notEqual(morning.quote.id, afternoon.quote.id);
  assert.notEqual(afternoon.quote.id, evening.quote.id);
  assert.notEqual(morning.theme.id, afternoon.theme.id);
  assert.notEqual(afternoon.theme.id, evening.theme.id);
  assert.equal(evening.experienceKey, afterMidnight.experienceKey);
  assert.equal(evening.quote.id, afterMidnight.quote.id);
  assert.equal(evening.theme.id, afterMidnight.theme.id);
  assert.notEqual(evening.experienceKey, nextMorning.experienceKey);
});

test("handles month, year and leap-day morning boundaries", () => {
  const boundaries = [
    [new Date(2026, 1, 1, 4, 59), new Date(2026, 1, 1, 5, 0)],
    [new Date(2027, 0, 1, 4, 59), new Date(2027, 0, 1, 5, 0)],
    [new Date(2028, 1, 29, 4, 59), new Date(2028, 1, 29, 5, 0)],
    [new Date(2028, 2, 1, 4, 59), new Date(2028, 2, 1, 5, 0)],
  ];

  for (const [before, after] of boundaries) {
    const first = getDailyExperience(before);
    const second = getDailyExperience(after);
    assert.notEqual(first.experienceKey, second.experienceKey);
    assert.notEqual(first.quote.id, second.quote.id);
    assert.notEqual(first.theme.id, second.theme.id);
  }
});
