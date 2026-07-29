export type DailyQuote = {
  id: string;
  text: string;
};

export type ThemeDefinition = {
  id: string;
  name: string;
  family: string;
  variant: string;
  background: string;
  foreground: string;
  accent: string;
  surface: string;
  muted: string;
  glow: string;
  fontFamily: string;
  displayWeight: number;
  letterSpacing: string;
  radius: string;
  shadow: string;
  layout: string;
  decor: string;
  motion: string;
};

const DAY_MS = 86_400_000;

const quoteLeads = [
  "把今天过好，比反复担心明天更有力量",
  "真正的进步，不一定总是声势浩大",
  "你愿意重新开始的那一刻，路就已经出现",
  "慢一点没有关系，只要方向仍在心里",
  "每一次认真，都在为未来悄悄铺路",
  "不必成为别人，只需比昨天更靠近自己",
  "那些看似平常的坚持，终会长成你的底气",
  "先完成眼前的一小步，再去拥抱更远的风景",
  "生活不会辜负每一个清醒又努力的清晨",
  "允许自己偶尔疲惫，但别忘了再次出发",
  "你现在积蓄的力量，会在未来某天闪光",
  "困难不是终点，而是能力正在生长的证据",
  "把注意力放在能改变的事情上",
  "今天的你，已经比想象中更勇敢",
  "别让暂时的阴影，遮住长久的光",
  "每个看似微小的选择，都在塑造新的自己",
  "努力不是为了追赶谁，而是为了看见更多可能",
  "当你专注脚下，远方也会向你靠近",
  "不完美的行动，胜过迟迟不来的完美计划",
  "你不需要一下子抵达，只需要一直向前",
  "愿意面对真实，就是改变发生的起点",
  "把心放宽一点，世界会还你更多出口",
  "没有白走的路，每一步都在丰富生命",
  "别急着证明自己，时间会替坚持发言",
  "今天种下的耐心，会成为明天的从容",
  "越是安静扎根，越能在未来向上生长",
  "你可以休息，可以调整，但不必放弃",
  "所谓好运，常常藏在多坚持一次之后",
  "给自己一点信任，也给时间一点时间",
  "当你开始珍惜当下，生活就开始回应",
  "把复杂的愿望，拆成今天能做的小事",
  "你认真走过的日子，自有它的意义",
  "勇气不是毫无畏惧，而是依然选择行动",
  "每一次克服犹豫，都是一次新的抵达",
  "向内安顿好自己，向外才能走得更远",
  "别被一时的速度，定义一生的方向",
  "能让你变好的路，通常需要一点耐心",
  "把遗憾变成提醒，而不是停下的理由",
  "只要心里还有期待，今天就值得认真",
  "你拥有重新整理生活的能力",
  "所有稳定的光亮，都来自长久的点燃",
  "与其等待状态，不如先做一个小小的开始",
  "人生没有标准进度，你有自己的时区",
  "接受当下的自己，也别停止成为更好的自己",
  "真正可靠的安全感，是一次次兑现对自己的承诺",
  "把掌声留给别人，也把肯定留给自己",
  "哪怕无人看见，成长依然真实发生",
  "别小看今天完成的一件小事",
  "你走得再慢，也比停在原地更接近答案",
  "有些花开得晚，只是因为根扎得深",
  "清醒地选择，热烈地生活，安静地努力",
  "面对不确定，最好的办法是让自己更确定",
  "把昨天留给回忆，把今天交给行动",
  "一次失利，只是故事里的一个逗号",
  "世界很大，你的可能也远不止一种",
  "先照顾好自己的节奏，再回应世界的期待",
  "你所羡慕的从容，背后都有日复一日的练习",
  "值得抵达的地方，从来不怕路远",
  "当下付出的诚意，会成为未来的礼物",
  "不要因为还没看见结果，就怀疑正在发生的成长",
  "今天依然拥有把生活向前推动一点的机会",
] as const;

const quoteEndings = [
  "继续走，答案会在路上慢慢清晰。",
  "哪怕只前进一点，也是在靠近想要的生活。",
  "请相信，认真生活的人终会收到时间的回信。",
  "别急着否定自己，成长本来就需要过程。",
  "把脚步放稳，远方会一点点来到眼前。",
  "愿你带着勇气出发，也带着从容归来。",
] as const;

export const quotes: DailyQuote[] = quoteEndings.flatMap((ending, endingIndex) =>
  quoteLeads.map((lead, leadIndex) => ({
    id: `quote-${String(endingIndex * quoteLeads.length + leadIndex + 1).padStart(3, "0")}`,
    text: `${lead}，${ending}`,
  })),
);

const families = [
  { name: "留白编辑", layout: "editorial", decor: "lines", motion: "reveal", font: '"Noto Serif SC","Songti SC","STSong",serif', weight: 600, spacing: ".05em", radius: "2px" },
  { name: "复古晨报", layout: "newspaper", decor: "grain", motion: "rise", font: '"Times New Roman","Songti SC",serif', weight: 700, spacing: ".02em", radius: "0px" },
  { name: "纯粹极简", layout: "minimal", decor: "halo", motion: "focus", font: '"PingFang SC","Microsoft YaHei",sans-serif', weight: 500, spacing: ".08em", radius: "28px" },
  { name: "霓虹未来", layout: "cyber", decor: "grid", motion: "glitch", font: '"Arial Narrow","Microsoft YaHei",sans-serif', weight: 800, spacing: ".07em", radius: "16px" },
  { name: "自然呼吸", layout: "organic", decor: "waves", motion: "bloom", font: '"Kaiti SC","STKaiti","KaiTi",serif', weight: 500, spacing: ".06em", radius: "48px" },
  { name: "纸张拼贴", layout: "collage", decor: "paper", motion: "fold", font: '"Trebuchet MS","Microsoft YaHei",sans-serif', weight: 700, spacing: ".03em", radius: "6px" },
  { name: "东方水墨", layout: "ink", decor: "ink", motion: "drift", font: '"FZKai-Z03","Kaiti SC","KaiTi",serif', weight: 500, spacing: ".12em", radius: "1px" },
  { name: "几何包豪斯", layout: "bauhaus", decor: "blocks", motion: "swing", font: '"Arial Black","Microsoft YaHei",sans-serif', weight: 900, spacing: "-.01em", radius: "0px" },
  { name: "像素漫游", layout: "pixel", decor: "pixel", motion: "type", font: '"Courier New","Microsoft YaHei",monospace', weight: 700, spacing: ".04em", radius: "0px" },
  { name: "浩瀚星图", layout: "cosmic", decor: "stars", motion: "float", font: 'Georgia,"Songti SC",serif', weight: 500, spacing: ".09em", radius: "999px" },
  { name: "光感杂志", layout: "magazine", decor: "rays", motion: "zoom", font: '"Arial","PingFang SC",sans-serif', weight: 800, spacing: "-.02em", radius: "22px" },
  { name: "静谧建筑", layout: "architect", decor: "orbit", motion: "pulse", font: '"Helvetica Neue","PingFang SC",sans-serif', weight: 400, spacing: ".14em", radius: "10px" },
] as const;

const variants = [
  { name: "破晓", bg: "#f2eadf", fg: "#26221d", accent: "#e85d3f", surface: "rgba(255,250,242,.72)", muted: "#766d63", glow: "#ffb172" },
  { name: "潮汐", bg: "#082f3d", fg: "#edf8f5", accent: "#55d6be", surface: "rgba(10,61,75,.68)", muted: "#9ebfc1", glow: "#3fe0d0" },
  { name: "银杏", bg: "#f4c95d", fg: "#252219", accent: "#9a3412", surface: "rgba(255,247,213,.58)", muted: "#695d35", glow: "#fff0a6" },
  { name: "莓果", bg: "#3b1537", fg: "#fff0f6", accent: "#ff8fbd", surface: "rgba(92,30,78,.62)", muted: "#d7aec9", glow: "#ff69b4" },
  { name: "青山", bg: "#dbe5d2", fg: "#18332a", accent: "#2f6f53", surface: "rgba(247,251,242,.62)", muted: "#5f7368", glow: "#8fd0a7" },
  { name: "蓝焰", bg: "#101828", fg: "#f4f7ff", accent: "#5c8dff", surface: "rgba(28,42,69,.64)", muted: "#a9b8d4", glow: "#407bff" },
  { name: "陶土", bg: "#b95f42", fg: "#fff7ec", accent: "#40251c", surface: "rgba(255,220,194,.22)", muted: "#f1c7b5", glow: "#ffb686" },
  { name: "雾紫", bg: "#e9e0f4", fg: "#30253f", accent: "#7555a3", surface: "rgba(255,255,255,.55)", muted: "#756982", glow: "#c89cff" },
  { name: "夜金", bg: "#17150f", fg: "#fff8dc", accent: "#e5ba55", surface: "rgba(59,51,30,.54)", muted: "#b8ab83", glow: "#ffd76d" },
  { name: "雪松", bg: "#edf1ed", fg: "#1e2a25", accent: "#43665a", surface: "rgba(255,255,255,.74)", muted: "#6e7c76", glow: "#a8cdbf" },
] as const;

export const themes: ThemeDefinition[] = Array.from({ length: 120 }, (_, index) => {
  const family = families[index % families.length];
  const variant = variants[Math.floor(index / families.length)];
  return {
    id: `theme-${String(index + 1).padStart(3, "0")}`,
    name: `${variant.name} · ${family.name}`,
    family: family.name,
    variant: variant.name,
    background: variant.bg,
    foreground: variant.fg,
    accent: variant.accent,
    surface: variant.surface,
    muted: variant.muted,
    glow: variant.glow,
    fontFamily: family.font,
    displayWeight: family.weight,
    letterSpacing: family.spacing,
    radius: family.radius,
    shadow: index % 3 === 0 ? "0 30px 90px rgba(0,0,0,.18)" : index % 3 === 1 ? "0 18px 50px rgba(0,0,0,.12)" : "none",
    layout: family.layout,
    decor: family.decor,
    motion: family.motion,
  };
});

function modulo(value: number, length: number) {
  return ((value % length) + length) % length;
}

export function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalDayNumber(date = new Date()) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );
}

export function getDailyExperience(date = new Date()) {
  const dayNumber = getLocalDayNumber(date);
  return {
    dayKey: getLocalDayKey(date),
    dayNumber,
    quote: quotes[modulo(dayNumber, quotes.length)],
    theme: themes[modulo(dayNumber, themes.length)],
  };
}
