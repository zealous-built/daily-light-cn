"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { getDailyExperience, getDayPeriod, themes } from "./daily";

type Feedback = "idle" | "copied" | "shared" | "failed";

const assetBase = import.meta.env.BASE_URL || "/";

const periodDetails = {
  morning: {
    label: "晨 · 水墨远山",
    image: `url("${assetBase}background-morning.jpg")`,
  },
  afternoon: {
    label: "午 · 宣纸竹影",
    image: `url("${assetBase}background-afternoon.jpg")`,
  },
  evening: {
    label: "夜 · 青绿山河",
    image: `url("${assetBase}background-evening.jpg")`,
  },
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("copy failed");
}

export function DailyLight() {
  const [now, setNow] = useState(() => new Date());
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const experience = useMemo(() => getDailyExperience(now), [now]);
  const theme = experience.theme;
  const period = getDayPeriod(now);
  const periodDetail = periodDetails[period];

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.style.setProperty("--page-background", theme.background);
    body.style.backgroundColor = theme.background;

    return () => {
      root.style.removeProperty("--page-background");
      body.style.backgroundColor = "";
    };
  }, [theme.background]);

  const refreshExperience = useCallback(() => {
    setNow((current) => {
      const next = new Date();
      return getDailyExperience(current).experienceKey
        === getDailyExperience(next).experienceKey
        ? current
        : next;
    });
  }, []);

  useEffect(() => {
    const scheduleNextChange = () => {
      const current = new Date();
      const candidates = [5, 12, 18].map((hour) => {
        const candidate = new Date(current);
        candidate.setHours(hour, 0, 0, 80);
        if (candidate <= current) candidate.setDate(candidate.getDate() + 1);
        return candidate;
      });
      const midnight = new Date(current);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 80);
      const next = [...candidates, midnight].sort(
        (a, b) => a.getTime() - b.getTime(),
      )[0];
      return window.setTimeout(() => {
        setNow(new Date());
        timer = scheduleNextChange();
      }, next.getTime() - current.getTime());
    };

    let timer = scheduleNextChange();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshExperience();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refreshExperience);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refreshExperience);
    };
  }, [refreshExperience]);

  useEffect(() => {
    if (feedback === "idle") return;
    const timer = window.setTimeout(() => setFeedback("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const shareText = [
    `古文：${experience.quote.text}`,
    `出处：${experience.quote.dynasty} · ${experience.quote.author} · ${experience.quote.source}`,
    `今译：${experience.quote.translation}`,
    "",
    "—— 日日向光",
  ].join("\n");

  const handleCopy = async () => {
    try {
      await copyText(shareText);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "日日向光｜今日古文",
          text: shareText,
          url: window.location.href,
        });
        setFeedback("shared");
      } else {
        await copyText(`${shareText}\n${window.location.href}`);
        setFeedback("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await copyText(`${shareText}\n${window.location.href}`);
        setFeedback("copied");
      } catch {
        setFeedback("failed");
      }
    }
  };

  const style = {
    "--bg": theme.background,
    "--fg": theme.foreground,
    "--accent": theme.accent,
    "--surface": theme.surface,
    "--muted": theme.muted,
    "--glow": theme.glow,
    "--display-font": theme.fontFamily,
    "--display-weight": theme.displayWeight,
    "--tracking": theme.letterSpacing,
    "--radius": theme.radius,
    "--card-shadow": theme.shadow,
    "--period-image": periodDetail.image,
  } as CSSProperties;

  const themeNumber = Number(theme.id.slice(-3));
  const statusText =
    feedback === "copied"
      ? "今日文案和链接已复制"
      : feedback === "shared"
        ? "已经把今天的光分享出去了"
        : feedback === "failed"
          ? "暂时无法复制，请稍后再试"
          : "";

  return (
    <main
      className={`daily-page layout-${theme.layout} decor-${theme.decor} motion-${theme.motion}`}
      style={style}
      data-day={experience.experienceKey}
      data-period={period}
    >
      <div className="ambient" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <header className="site-header">
        <a className="brand" href="./" aria-label="日日向光首页">
          <span className="brand-sun" aria-hidden="true">日</span>
          <span>
            <strong>日日向光</strong>
            <small>DAILY LIGHT</small>
          </span>
        </a>
        <div className="theme-label" aria-label={`今日主题：${theme.name}`}>
          <span>今日风格</span>
          <strong>{theme.name}</strong>
          <small>{String(themeNumber).padStart(3, "0")} / {themes.length}</small>
        </div>
      </header>

      <section className="quote-stage" aria-labelledby="daily-quote">
        <div className="date-line">
          <span>{formatDate(now)}</span>
          <i aria-hidden="true" />
          <span>{periodDetail.label}</span>
        </div>

        <div className="quote-card">
          <div className="classic-compare" key={experience.experienceKey}>
            <article className="original-pane">
              <div className="pane-label">
                <span>古文</span>
                <small>ORIGINAL</small>
              </div>
              <span className="quote-mark" aria-hidden="true">“</span>
              <h1 id="daily-quote">{experience.quote.text}</h1>
              <p className="source-line">
                {experience.quote.dynasty}
                <i aria-hidden="true">·</i>
                {experience.quote.author}
                <i aria-hidden="true">·</i>
                {experience.quote.source}
              </p>
            </article>

            <div className="compare-divider" aria-hidden="true">
              <span>今</span>
            </div>

            <article className="translation-pane">
              <div className="pane-label">
                <span>今译</span>
                <small>TRANSLATION</small>
              </div>
              <p className="translation-text">{experience.quote.translation}</p>
              <p className="translation-note">古意不远，照见今日。</p>
            </article>
          </div>
        </div>

        <div className="actions" aria-label="今日古文操作">
          <button type="button" onClick={handleCopy}>
            <span aria-hidden="true">⧉</span>
            复制古今
          </button>
          <button type="button" className="primary-action" onClick={handleShare}>
            <span aria-hidden="true">↗</span>
            分享今日
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <p><span aria-hidden="true">✦</span> 每日零点，读一句古文</p>
        <p>左读古意，右见今心</p>
      </footer>

      <div className={`toast ${feedback !== "idle" ? "is-visible" : ""}`} role="status" aria-live="polite">
        {statusText}
      </div>
    </main>
  );
}
