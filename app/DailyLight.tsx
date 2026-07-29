"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { getDailyExperience, themes } from "./daily";

type Feedback = "idle" | "copied" | "shared" | "failed";

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

  const refreshDate = useCallback(() => {
    setNow((current) => {
      const next = new Date();
      return getDailyExperience(current).dayKey === getDailyExperience(next).dayKey
        ? current
        : next;
    });
  }, []);

  useEffect(() => {
    const scheduleNextMidnight = () => {
      const current = new Date();
      const next = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
        0,
        0,
        0,
        80,
      );
      return window.setTimeout(() => {
        setNow(new Date());
        timer = scheduleNextMidnight();
      }, next.getTime() - current.getTime());
    };

    let timer = scheduleNextMidnight();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshDate();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refreshDate);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refreshDate);
    };
  }, [refreshDate]);

  useEffect(() => {
    if (feedback === "idle") return;
    const timer = window.setTimeout(() => setFeedback("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const shareText = `今日有光：${experience.quote.text}\n\n—— 日日向光`;

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
          title: "日日向光｜今日有光",
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

  const theme = experience.theme;
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
      data-day={experience.dayKey}
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
          <span>今日有光</span>
        </div>

        <div className="quote-card">
          <span className="quote-mark" aria-hidden="true">“</span>
          <h1 id="daily-quote" key={experience.dayKey}>
            {experience.quote.text}
          </h1>
          <div className="signature">
            <span />
            <p>愿今天的你，心里有方向，脚下有力量。</p>
          </div>
        </div>

        <div className="actions" aria-label="今日文案操作">
          <button type="button" onClick={handleCopy}>
            <span aria-hidden="true">⧉</span>
            复制文案
          </button>
          <button type="button" className="primary-action" onClick={handleShare}>
            <span aria-hidden="true">↗</span>
            分享今日
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <p><span aria-hidden="true">✦</span> 每日零点，换一种心情</p>
        <p>同一天，同一句光</p>
      </footer>

      <div className={`toast ${feedback !== "idle" ? "is-visible" : ""}`} role="status" aria-live="polite">
        {statusText}
      </div>
    </main>
  );
}
