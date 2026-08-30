"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Clipboard, ExternalLink, FileJson, Link2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type Metric = { label: string; value: string; note?: string };
type Source = { title: string; url: string };
type Execution = { date?: string; action: string; platform?: string; description?: string };
type PlatformStrategy = { platform: string; role?: string; contentFormat?: string; searchTerm?: string };
type ActivePeriod = { start: string | null; end: string | null; label: string; confidence?: "已确认" | "部分确认" | "待核实"; sourceUrl?: string };
type Campaign = {
  id: string; name: string; start: string | null; end: string | null; type: string; theme: string;
  summary: string; objective: string; audience: string; partners: string[]; actions: string[];
  platforms: string[]; platformTerms: Record<string, string>; metrics: Metric[]; sources: Source[];
  confidence: "已确认" | "部分确认" | "待核实";
  background?: string; keyMessage?: string; creativeIdea?: string; contentPillars?: string[];
  executions?: Execution[]; platformStrategy?: PlatformStrategy[]; evidenceGaps?: string[];
  parentCampaign?: string; dateType?: "exact_range" | "single_day" | "multiple_periods" | "ongoing" | "unknown"; activePeriods?: ActivePeriod[];
};

const sampleCampaigns: Campaign[] = [
  {
    id: "cny-family", name: "春节家庭场景 Campaign", start: "2026-01-17", end: "2026-02-12", type: "节日营销",
    theme: "团聚时刻，分享一瓶可乐",
    summary: "以春节团聚和家庭关系为内容入口，通过明星内容、短视频和线下年节陈列建立节日消费场景。",
    objective: "强化可口可乐与春节家庭聚餐的关联，并承接节日期间的购买转化。",
    audience: "年轻家庭、返乡人群及春节聚餐消费者",
    partners: ["明星父女组合（演示）", "零售终端（演示）"],
    actions: ["发布春节主题短片", "发起家庭互动话题", "上线年节限定包装", "布置线下节日陈列"],
    platforms: ["抖音", "小红书", "微博", "微信", "线下"],
    platformTerms: { 小红书: "可口可乐 春节 团聚", 抖音: "可口可乐 春节 家庭", 微博: "可口可乐春节" },
    metrics: [{ label: "视频播放", value: "3,100万", note: "演示数据" }, { label: "社交话题", value: "266个", note: "演示数据" }, { label: "媒体报道", value: "6篇", note: "演示数据" }],
    sources: [{ title: "品牌官方发布（演示链接）", url: "https://www.coca-cola.com/cn/zh" }, { title: "新闻检索入口", url: "https://www.baidu.com/s?wd=%E5%8F%AF%E5%8F%A3%E5%8F%AF%E4%B9%90+2026+%E6%98%A5%E8%8A%82" }],
    confidence: "部分确认",
  },
  {
    id: "food-scene", name: "夏日餐饮场景 Campaign", start: "2026-03-09", end: "2026-04-26", type: "场景营销",
    theme: "好吃的，就要配可口可乐",
    summary: "围绕烧烤、汉堡和朋友聚餐，把综艺内容、达人探店、餐饮门店与促销包装串成一条传播链路。",
    objective: "建立可口可乐与高频餐饮场景的绑定，并推动门店渠道转化。",
    audience: "18—35岁的朋友聚餐、烧烤及汉堡消费者",
    partners: ["头部综艺（演示）", "餐饮品牌（演示）", "生活方式达人（演示）"],
    actions: ["综艺内容植入", "达人探店与种草", "餐饮套餐联动", "活动包装扫码互动"],
    platforms: ["综艺", "抖音", "小红书", "线下门店"],
    platformTerms: { 小红书: "可口可乐 烧烤 搭子", 抖音: "可口可乐 烧烤季", 微博: "可口可乐餐饮搭子" },
    metrics: [{ label: "激活门店", value: "3,814家", note: "演示数据" }, { label: "活动包装", value: "254万+", note: "演示数据" }, { label: "互动率", value: "76.2%", note: "演示数据" }],
    sources: [{ title: "品牌新闻检索入口", url: "https://www.baidu.com/s?wd=%E5%8F%AF%E5%8F%A3%E5%8F%AF%E4%B9%90+%E7%83%A7%E7%83%A4+campaign" }], confidence: "待核实",
  },
  {
    id: "ai-experience", name: "AI互动体验 Campaign", start: "2026-05-04", end: "2026-06-21", type: "数字互动",
    theme: "生成你的专属畅爽时刻",
    summary: "通过AI内容生成体验与明星传播，鼓励用户生成、保存和分享自己的品牌化内容。",
    objective: "以低门槛数字互动提升年轻用户主动参与和UGC扩散。",
    audience: "熟悉短视频、AI工具和社交分享的年轻消费者",
    partners: ["品牌代言人（演示）", "AI互动技术方（演示）"],
    actions: ["上线AI内容生成器", "明星示范内容", "用户生成与分享", "短视频二次传播"],
    platforms: ["抖音", "快手", "微信"],
    platformTerms: { 小红书: "可口可乐 AI 生成", 抖音: "可口可乐 AI 互动", 微博: "可口可乐AI体验" },
    metrics: [{ label: "AI参与", value: "68.2万", note: "演示数据" }, { label: "内容生成", value: "17.3万", note: "演示数据" }, { label: "内容分享", value: "3.7万", note: "演示数据" }],
    sources: [{ title: "活动案例检索入口", url: "https://www.baidu.com/s?wd=%E5%8F%AF%E5%8F%A3%E5%8F%AF%E4%B9%90+AI+campaign" }], confidence: "待核实",
  },
];

type Period = "H1" | "H2" | "YTD";
const allMonths = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);
function periodRange(year: number, period: Period) {
  if (period === "H1") return { start: `${year}-01-01`, end: `${year}-06-30`, months: allMonths.slice(0, 6), label: "H1" };
  if (period === "H2") return { start: `${year}-07-01`, end: `${year}-12-31`, months: allMonths.slice(6), label: "H2" };
  const now = new Date();
  const currentYear = now.getFullYear();
  const end = year < currentYear ? `${year}-12-31` : now.toISOString().slice(0, 10);
  const monthCount = year < currentYear ? 12 : now.getMonth() + 1;
  return { start: `${year}-01-01`, end, months: allMonths.slice(0, monthCount), label: `全年截至${end}` };
}
function buildResearchPromptLegacy(brand: string, year: number, period: Period) {
  const range = periodRange(year, period);
  return `请深度研究“${brand}｜${range.label}｜大型Campaign”，检索日期范围为 ${range.start} 至 ${range.end}。\n\n研究要求：\n1. 先广泛检索再去重，至少覆盖品牌官方、新闻/行业媒体、社交平台、营销案例或公开数据四类来源。Campaign数量不设上限，收录日期范围内所有具有明确传播动作、跨平台传播、IP/明星合作、产品发布、节日营销、线下事件或较大行业影响力的项目。\n2. 不要为凑数量把普通单篇新闻、单次促销或无传播链路的零散动作硬算成Campaign；同一主题下的多个动作应合并为一个Campaign。\n3. 每个Campaign必须尽可能讲完整：为什么做、核心传播信息、创意概念、目标对象、合作方、具体内容、分阶段时间节点、每个平台承担什么角色、内容形式、站内实际搜索词、公开传播数据和来源。actions不能写“线上传播”这种空话，要写清谁在什么平台以什么形式做了什么。\n4. 每个Campaign尽量提供2条以上可访问来源；只有1条来源时标记“部分确认”。所有数字必须能追溯到来源；没有公开数据就写“待核实”，禁止估算或编造。\n5. 若某个字段无法确认，不要省略字段，填“待核实”并在evidenceGaps中说明缺什么证据。\n6. 严格输出JSON，不要输出JSON以外的任何文字。\n\n输出结构：\n{\n  "campaigns": [{\n    "id": "英文短标识",\n    "name": "Campaign正式名称或通用名称",\n    "start": "YYYY-MM-DD",\n    "end": "YYYY-MM-DD",\n    "type": "类型",\n    "theme": "核心主题",\n    "background": "市场背景、品牌语境及为什么此时做，100-200字",\n    "keyMessage": "面向消费者的核心传播信息",\n    "creativeIdea": "创意概念及其如何被转化为内容和体验，100-200字",\n    "summary": "完整内容概述，150-300字",\n    "objective": "营销目的",\n    "audience": "目标受众",\n    "partners": ["合作品牌/IP/明星/机构及其角色"],\n    "contentPillars": ["主要内容支柱"],\n    "actions": ["具体传播动作，包含主体+平台+形式+内容"],\n    "executions": [{"date":"YYYY-MM-DD或待核实","action":"节点名称","platform":"执行平台/场景","description":"具体执行内容"}],\n    "platforms": ["传播平台"],\n    "platformStrategy": [{"platform":"平台名","role":"平台在传播链路中的角色","contentFormat":"内容形式","searchTerm":"实际搜索词"}],\n    "platformTerms": {"小红书":"实际搜索词","抖音":"实际搜索词","微博":"实际搜索词"},\n    "metrics": [{"label":"指标名","value":"指标值或待核实","note":"数据口径、日期与来源说明"}],\n    "sources": [{"title":"来源名","url":"https://..."}],\n    "evidenceGaps": ["仍缺少或无法确认的信息"],\n    "confidence": "已确认/部分确认/待核实"\n  }]\n}`;
}
function buildResearchPrompt(brand: string, year: number, period: Period) {
  const range = periodRange(year, period);
  return `请深度研究“${brand}｜${range.label}｜大型Campaign”，检索日期范围为 ${range.start} 至 ${range.end}。

研究要求：
1. 先广泛检索再去重，至少覆盖品牌官方、新闻/行业媒体、社交平台、营销案例或公开数据四类来源。Campaign数量不设上限，不得预设只输出3个、4个或任何固定数量。
2. 【拆分优先】主题相同不代表同一个Campaign。合作IP/明星、活动正式名称、城市/场地、商业合作或主要传播链路不同，必须分别建档。相隔超过14天的独立线下活动默认拆分；只有权威来源明确证明属于同一总Campaign时才可用parentCampaign归组。不得把第一场开始日和最后一场结束日拼成连续活动期。
3. 总Campaign与独立Activation分层：每个可独立命名、传播或举办的活动必须单列。一个Campaign有多个不连续节点时，用activePeriods记录多个离散区间，中间空档不得算活动期。
4. 【日期证据】start/end只能使用来源明确记载的实际上线、举办或传播日期，绝不能用新闻发布日期或搜索到的最早/最晚文章日期代替。单日活动start=end；结束日无法确认则end=null；均不明则start/end均为null且dateType=unknown。每个activePeriod尽量附支持日期的sourceUrl。
5. 每条讲清为什么做、核心信息、创意、对象、合作方、动作、平台角色、内容形式、实际搜索词、公开数据和来源。actions必须写主体+平台+形式+内容。
6. 每条尽量提供2个以上可访问来源；只有1条来源标记“部分确认”。数字必须可追溯；无公开数据写“待核实”，禁止估算。
7. 输出前逐条检查：是否错误合并、是否用文章日期冒充活动日期、是否把离散节点画成连续区间。严格输出JSON，不要输出JSON以外文字。

输出结构：
{"campaigns":[{
"id":"英文短标识","name":"Campaign正式名称或通用名称","parentCampaign":"所属总Campaign；无则填待核实",
"dateType":"exact_range/single_day/multiple_periods/ongoing/unknown","start":"YYYY-MM-DD或null","end":"YYYY-MM-DD或null",
"activePeriods":[{"start":"YYYY-MM-DD或null","end":"YYYY-MM-DD或null","label":"具体节点","confidence":"已确认/部分确认/待核实","sourceUrl":"日期证据URL或空字符串"}],
"type":"类型","theme":"核心主题","background":"市场背景及为什么做，100-200字","keyMessage":"核心传播信息","creativeIdea":"创意概念，100-200字","summary":"完整概述，150-300字","objective":"营销目的","audience":"目标受众","partners":["合作对象及角色"],"contentPillars":["内容支柱"],"actions":["主体+平台+形式+内容"],"executions":[{"date":"YYYY-MM-DD或待核实","action":"节点","platform":"平台/场景","description":"具体内容"}],"platforms":["传播平台"],"platformStrategy":[{"platform":"平台名","role":"传播角色","contentFormat":"内容形式","searchTerm":"实际搜索词"}],"platformTerms":{"小红书":"实际搜索词","抖音":"实际搜索词","微博":"实际搜索词"},"metrics":[{"label":"指标名","value":"指标值或待核实","note":"口径、日期与来源"}],"sources":[{"title":"来源名","url":"https://..."}],"evidenceGaps":["证据缺口"],"confidence":"已确认/部分确认/待核实"}]}`;
}
function parseImportedJson(raw: string) {
  let cleaned = raw.trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x20;/gi, " ")
    .replace(/https\\:\/\//g, "https://");
  const firstObject = cleaned.indexOf("{");
  const lastObject = cleaned.lastIndexOf("}");
  if (firstObject >= 0 && lastObject > firstObject) cleaned = cleaned.slice(firstObject, lastObject + 1);
  return JSON.parse(cleaned);
}
function daysBetween(date: string, rangeStart: string) {
  const start = new Date(`${rangeStart}T00:00:00Z`).getTime();
  const current = new Date(`${date}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((current - start) / 86400000));
}
function formatDate(date: string | null) {
  if (!date) return "日期待核实";
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}
function validDate(value: unknown): value is string { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value); }
function periodsFor(item: Campaign): ActivePeriod[] {
  if (Array.isArray(item.activePeriods) && item.activePeriods.length) return item.activePeriods;
  if (validDate(item.start)) return [{ start: item.start, end: validDate(item.end) ? item.end : item.start, label: item.name, confidence: item.confidence }];
  return [];
}
function normalizeCampaign(item: Campaign): Campaign {
  const periods = Array.isArray(item.activePeriods) ? item.activePeriods.map((p) => ({
    ...p, start: validDate(p.start) ? p.start : null, end: validDate(p.end) ? p.end : validDate(p.start) ? p.start : null
  })) : [];
  return { ...item, start: validDate(item.start) ? item.start : periods[0]?.start || null, end: validDate(item.end) ? item.end : periods.at(-1)?.end || null, activePeriods: periods };
}
function executionDates(value?: string) {
  const matches = (value || "").match(/\d{4}-\d{2}-\d{2}/g) || [];
  return { start: matches[0] || null, end: matches[1] || matches[0] || null };
}
function expandImportedCampaigns(items: Campaign[]) {
  let expandedFrom = 0;
  const campaigns = items.flatMap((raw) => {
    const item = normalizeCampaign(raw);
    const executions = Array.isArray(item.executions) ? item.executions.filter((e) => e?.action?.trim()) : [];
    const isLegacyUmbrella = executions.length >= 2 && !item.parentCampaign && !item.dateType;
    if (!isLegacyUmbrella) return [item];
    expandedFrom += 1;
    return executions.map((execution, index) => {
      const dates = executionDates(execution.date);
      return normalizeCampaign({
        ...item,
        id: `${item.id}-activation-${index + 1}`,
        name: execution.action.trim(),
        parentCampaign: item.name,
        type: `${item.type} · 独立执行`,
        start: dates.start,
        end: dates.end,
        dateType: dates.start ? (dates.start === dates.end ? "single_day" : "exact_range") : "unknown",
        activePeriods: dates.start ? [{ start: dates.start, end: dates.end, label: execution.action, confidence: item.confidence }] : [],
        summary: execution.description || `${item.name}下的独立传播或活动节点；现有JSON未提供更完整的单项说明。`,
        actions: [execution.description || execution.action],
        platforms: execution.platform ? [execution.platform] : item.platforms,
        executions: [execution],
        evidenceGaps: dates.start ? item.evidenceGaps : [...(item.evidenceGaps || []), "该独立节点的准确活动日期待核实"]
      });
    });
  });
  return { campaigns, expandedFrom };
}
type AuditReport = { topLevel: number; nestedExecutions: number; independent: number; calendarReady: number; dateUnknown: number; warnings: string[] };
function calendarPeriodsFor(item: Campaign) {
  return periodsFor(item).filter((p) => {
    if (!validDate(p.start) || !validDate(p.end) || p.end < p.start || p.confidence === "待核实") return false;
    const span = daysBetween(p.end, p.start) + 1;
    const hasDateEvidence = Boolean(p.sourceUrl) || (item.sources || []).some((source) => /^https?:\/\//.test(source.url));
    const spanIsPlausible = span <= 62 || item.dateType === "ongoing";
    return hasDateEvidence && spanIsPlausible;
  });
}
function auditImport(raw: Campaign[], independent: Campaign[]): AuditReport {
  const nestedExecutions = raw.reduce((sum, item) => sum + (Array.isArray(item.executions) ? item.executions.filter((e) => e?.action?.trim()).length : 0), 0);
  const actionCount = raw.reduce((sum, item) => sum + (Array.isArray(item.actions) ? item.actions.length : 0), 0);
  const calendarReady = independent.filter((item) => calendarPeriodsFor(item).length > 0).length;
  const dateUnknown = independent.length - calendarReady;
  const warnings: string[] = [];
  if (raw.length <= 3 && nestedExecutions >= 4) warnings.push(`检测到“${raw.length}条母Campaign + ${nestedExecutions}个独立执行”，已自动拆分，未按${raw.length}条直接生成。`);
  if (raw.length <= 3 && nestedExecutions === 0 && actionCount >= 8) warnings.push("顶层条目过少，但存在大量actions且缺少独立execution结构；本次导入应被阻止，需重新生成规范JSON。");
  if (dateUnknown > 0) warnings.push(`${dateUnknown}个项目缺少可靠日期证据或日期跨度异常，保留在资料库，但不进入可截图Calendar。`);
  return { topLevel: raw.length, nestedExecutions, independent: independent.length, calendarReady, dateUnknown, warnings };
}
function searchUrl(platform: string, term: string) {
  const q = encodeURIComponent(term);
  if (platform === "小红书") return `https://www.xiaohongshu.com/search_result?keyword=${q}&source=web_search_result_notes`;
  if (platform === "抖音") return `https://www.douyin.com/search/${q}`;
  return `https://s.weibo.com/weibo?q=${q}`;
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  const [brand, setBrand] = useState("可口可乐中国");
  const [year, setYear] = useState(2026);
  const [period, setPeriod] = useState<Period>("H1");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [query, setQuery] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState("");
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [calendarPrimary, setCalendarPrimary] = useState("#e41e2b");
  const [calendarSecondary, setCalendarSecondary] = useState("#181716");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("campaign-demo-data");
    if (saved) try {
      const rawSaved = JSON.parse(saved);
      const migrated = expandImportedCampaigns(rawSaved);
      setCampaigns(migrated.campaigns);
      setAuditReport(auditImport(rawSaved, migrated.campaigns));
      if (migrated.expandedFrom > 0) {
        window.localStorage.setItem("campaign-demo-data", JSON.stringify(migrated.campaigns));
        setImportSuccess(`已修复旧版结构：原JSON的 ${migrated.expandedFrom} 个大伞Campaign已展开为 ${migrated.campaigns.length} 个独立项目，Calendar不再只显示3条。`);
      }
    } catch { /* retain demo */ }
    const savedProject = window.localStorage.getItem("campaign-demo-project");
    if (savedProject) try {
      const project = JSON.parse(savedProject);
      if (project.brand) setBrand(project.brand);
      if (project.year) setYear(Number(project.year));
      if (["H1", "H2", "YTD"].includes(project.period)) setPeriod(project.period);
    } catch { /* retain defaults */ }
    const savedColors = window.localStorage.getItem("campaign-demo-colors");
    if (savedColors) try {
      const colors = JSON.parse(savedColors);
      if (/^#[0-9a-f]{6}$/i.test(colors.primary)) setCalendarPrimary(colors.primary);
      if (/^#[0-9a-f]{6}$/i.test(colors.secondary)) setCalendarSecondary(colors.secondary);
    } catch { /* retain defaults */ }
  }, []);

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase();
    const selectedRange = periodRange(year, period);
    return campaigns.filter((item) => {
      const datedPeriods = periodsFor(item);
      const overlapsPeriod = datedPeriods.length === 0 || datedPeriods.some((p) => validDate(p.start) && (p.end || p.start) >= selectedRange.start && p.start <= selectedRange.end);
      const matchesKeyword = !key || [item.name, item.type, item.theme, ...item.platforms, ...item.partners].join(" ").toLowerCase().includes(key);
      return overlapsPeriod && matchesKeyword;
    });
  }, [campaigns, query, year, period]);

  const range = periodRange(year, period);
  const totalDays = daysBetween(range.end, range.start) + 1;
  const updateProject = (next: { brand?: string; year?: number; period?: Period }) => {
    const project = { brand: next.brand ?? brand, year: next.year ?? year, period: next.period ?? period };
    setBrand(project.brand); setYear(project.year); setPeriod(project.period);
    window.localStorage.setItem("campaign-demo-project", JSON.stringify(project));
  };
  const updateCalendarColors = (primary: string, secondary: string) => {
    setCalendarPrimary(primary); setCalendarSecondary(secondary);
    window.localStorage.setItem("campaign-demo-colors", JSON.stringify({ primary, secondary }));
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(buildResearchPrompt(brand, year, period)); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };
  const importCampaigns = async () => {
    setImportError(""); setImportSuccess("");
    if (!importText.trim()) { setImportError("请先粘贴ChatGPT返回的JSON"); return; }
    setIsImporting(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      const parsed = parseImportedJson(importText); const rawNext = Array.isArray(parsed) ? parsed : parsed.campaigns;
      const expanded = Array.isArray(rawNext) ? expandImportedCampaigns(rawNext) : null;
      const next = expanded?.campaigns;
      if (!Array.isArray(next) || next.length === 0) throw new Error("未找到campaigns数组");
      const audit = auditImport(rawNext, next);
      if (audit.topLevel <= 3 && audit.nestedExecutions === 0 && rawNext.reduce((sum, item) => sum + (item.actions?.length || 0), 0) >= 8) {
        throw new Error("质量审计未通过：只识别到少量母Campaign，但其中包含大量未结构化动作，网页无法可靠判断哪些是独立项目。请用新版研究指令重新生成，当前数据不会覆盖。");
      }
      if (audit.nestedExecutions >= 4 && audit.independent < audit.nestedExecutions) {
        throw new Error("数量审计未通过：独立执行数大于最终项目数，存在丢项风险，当前数据不会覆盖。");
      }
      const uniqueIds = new Set(next.map((item) => item.id));
      if (uniqueIds.size !== next.length) throw new Error(`JSON中有 ${next.length} 条，但存在重复id；请修正后再导入，系统不会擅自去重。`);
      setCampaigns(next); setAuditReport(audit); window.localStorage.setItem("campaign-demo-data", JSON.stringify(next)); setShowImport(false); setImportText("");
      setImportSuccess(expanded && expanded.expandedFrom > 0
        ? `JSON顶层读取 ${rawNext.length} 条，其中 ${expanded.expandedFrom} 条是错误合并的大伞结构；已自动展开并保留为 ${next.length} 个独立项目。`
        : `JSON读取 ${next.length} 条，页面保留 ${next.length} 条，数量一致。结果已保存在当前浏览器。`);
      window.setTimeout(() => document.getElementById("campaign-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (error) {
      const message = error instanceof SyntaxError ? "JSON格式无法识别，请确认内容完整，并包含最外层的大括号。" : error instanceof Error ? error.message : "JSON格式无法识别";
      setImportError(message);
    } finally { setIsImporting(false); }
  };
  const resetDemo = () => { setCampaigns(sampleCampaigns); setAuditReport(null); updateProject({ brand: "可口可乐中国", year: 2026, period: "H1" }); window.localStorage.removeItem("campaign-demo-data"); };

  if (selected) return <CampaignDetail campaign={selected} onBack={() => setSelected(null)} />;

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#181716]">
      <header className="border-b border-black/10 px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3"><div className="grid size-8 place-items-center bg-[#e41e2b] font-black text-white">C</div><span className="font-bold tracking-tight">Campaign Intelligence</span><Badge variant="outline" className="hidden rounded-none border-black/15 text-[10px] sm:inline-flex">DEMO</Badge></div>
          <button onClick={resetDemo} className="text-xs text-black/45 underline-offset-4 hover:text-black hover:underline">恢复演示数据</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <section className="grid gap-8 border-b border-black/10 pb-10 lg:grid-cols-[1fr_430px] lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e41e2b]">Research workspace · {year} {period}</p><h1 className="mt-4 max-w-4xl text-4xl font-black leading-[.98] tracking-[-0.045em] md:text-7xl">把ChatGPT调研<br />变成Campaign数据库</h1><p className="mt-5 max-w-2xl text-base leading-7 text-black/58">网页不伪装成联网爬虫：ChatGPT负责搜索与核查，网站负责品牌项目、时间轴、结构化详情和平台入口。</p></div>
          <div className="border border-black/10 bg-white p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">研究条件</p>
            <div className="grid grid-cols-[1fr_90px_120px] gap-2">
              <label className="text-[11px] text-black/45">品牌<input value={brand} onChange={(event) => updateProject({ brand: event.target.value })} className="mt-1 h-10 w-full border border-black/15 px-3 text-sm text-black outline-none focus:border-black" /></label>
              <label className="text-[11px] text-black/45">年份<input type="number" max={new Date().getFullYear()} value={year} onChange={(event) => updateProject({ year: Number(event.target.value) })} className="mt-1 h-10 w-full border border-black/15 px-2 text-sm text-black outline-none focus:border-black" /></label>
              <label className="text-[11px] text-black/45">时间范围<select value={period} onChange={(event) => updateProject({ period: event.target.value as Period })} className="mt-1 h-10 w-full border border-black/15 bg-white px-2 text-sm text-black outline-none focus:border-black"><option value="H1">H1</option><option value="H2">H2</option><option value="YTD">全年截至目前</option></select></label>
            </div>
            <div className="mt-3 grid gap-2">
            <Button onClick={copyPrompt} className="h-12 justify-between rounded-none bg-[#181716] px-5 hover:bg-[#e41e2b]"><span className="flex items-center gap-2">{copied ? <Check className="size-4" /> : <Sparkles className="size-4" />}{copied ? "研究指令已复制" : "第1步：复制ChatGPT指令"}</span><Clipboard className="size-4" /></Button>
            <Button onClick={() => setShowImport(!showImport)} variant="outline" className="h-12 justify-between rounded-none border-black/20 bg-transparent px-5 hover:bg-white"><span className="flex items-center gap-2"><FileJson className="size-4" />第2步：粘贴JSON结果</span><ChevronRight className={`size-4 transition ${showImport ? "rotate-90" : ""}`} /></Button>
            </div>
          </div>
        </section>

        {showImport && <section className="mt-6 border border-black/10 bg-white p-5 md:p-7">
          <div className="mb-4 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold">导入ChatGPT研究结果</h2><p className="mt-1 text-sm text-black/50">粘贴符合研究指令格式的JSON；数据只保存在你的浏览器。</p></div><Badge className="rounded-none bg-[#fff0f0] text-[#e41e2b] hover:bg-[#fff0f0]">无需API</Badge></div>
          <div className="mb-4 grid grid-cols-3 border border-black/10 bg-[#faf9f6] text-center text-[11px] text-black/50"><span className="border-r border-black/10 px-2 py-2"><b className="mr-1 text-black">1</b>粘贴JSON</span><span className="border-r border-black/10 px-2 py-2"><b className="mr-1 text-black">2</b>点击解析导入</span><span className="px-2 py-2"><b className="mr-1 text-black">3</b>看到绿色完成提示</span></div>
          <Textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={'{"campaigns": [{"id": "...", "name": "..."}] }'} className="min-h-48 rounded-none border-black/15 bg-[#faf9f6] font-mono text-xs" />
          <div className="mt-2 flex items-center justify-between text-xs text-black/40"><span>{importText.trim() ? `已粘贴 ${importText.length.toLocaleString()} 个字符，可以开始解析` : "等待粘贴JSON"}</span><span>通常不到1秒</span></div>
          {isImporting && <div className="mt-4 border border-black/10 bg-[#faf9f6] p-3"><div className="flex items-center justify-between text-xs font-semibold"><span>正在解析并检查Campaign数据…</span><span>处理中</span></div><div className="mt-2 h-1.5 overflow-hidden bg-black/10"><div className="h-full w-2/3 animate-pulse bg-[#e41e2b]" /></div></div>}
          {importError && <div className="mt-4 border border-[#e41e2b]/25 bg-[#fff0f0] p-3 text-sm text-[#b3131d]"><b>导入失败：</b>{importError}<p className="mt-1 text-xs text-black/45">当前内容没有被覆盖，你可以修改后再次点击导入。</p></div>}
          <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" disabled={isImporting} onClick={() => setShowImport(false)}>取消</Button><Button disabled={isImporting || !importText.trim()} onClick={importCampaigns} className="min-w-40 rounded-none bg-[#e41e2b] px-6 hover:bg-[#c81420] disabled:opacity-40">{isImporting ? "正在解析…" : "解析并导入Campaign"}</Button></div>
        </section>}

        {importSuccess && <div role="status" className="mt-6 flex items-start justify-between gap-4 border border-[#208044]/25 bg-[#eaf7ee] p-4 text-[#155d32]"><div className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#208044] text-white"><Check className="size-4" /></span><div><p className="font-bold">Campaign项目已生成完成</p><p className="mt-1 text-sm">{importSuccess}</p></div></div><button onClick={() => setImportSuccess("")} className="text-xs underline">关闭</button></div>}
        {auditReport && <section className="mt-6 border border-black/10 bg-[#181716] p-5 text-white">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Import quality audit</p><h2 className="mt-1 text-xl font-bold">导入数量与日期审计</h2></div><Badge className="w-fit rounded-none bg-[#208044] text-white hover:bg-[#208044]">已自动检查</Badge></div>
          <div className="mt-5 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-5">
            {[["JSON顶层", auditReport.topLevel], ["嵌套执行", auditReport.nestedExecutions], ["独立项目", auditReport.independent], ["可截图Calendar", auditReport.calendarReady], ["日期待核实", auditReport.dateUnknown]].map(([label, value]) => <div key={String(label)} className="bg-[#181716] p-4"><p className="text-[10px] uppercase tracking-wider text-white/45">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}
          </div>
          {auditReport.warnings.length > 0 && <ul className="mt-4 space-y-2 text-sm text-[#ffd2d5]">{auditReport.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul>}
        </section>}

        <section id="campaign-results" className="mt-10 scroll-mt-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Annual media calendar</p><h2 className="mt-2 text-3xl font-black tracking-tight">{brand} · {year} {period} Campaign总览</h2><p className="mt-2 text-xs" style={{ color: calendarPrimary }}>仅通过日期审计的节点进入截图时间轴；每段均显示准确起止日期。</p></div><div className="flex flex-wrap items-end gap-3"><div className="flex h-11 items-center gap-3 border border-black/15 bg-white px-3"><span className="text-[10px] font-bold uppercase tracking-wider text-black/35">Calendar配色</span><label className="flex items-center gap-1 text-[10px] text-black/45">主色<input aria-label="Calendar主色" type="color" value={calendarPrimary} onChange={(event) => updateCalendarColors(event.target.value, calendarSecondary)} className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0" /></label><label className="flex items-center gap-1 text-[10px] text-black/45">辅色<input aria-label="Calendar辅色" type="color" value={calendarSecondary} onChange={(event) => updateCalendarColors(calendarPrimary, event.target.value)} className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0" /></label></div><div><label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/35">筛选当前结果</label><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选名称、平台或合作方" className="h-11 w-full border border-black/15 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-black" /></div></div></div></div>
          <div className="mt-6 overflow-x-auto border border-black/10 bg-white"><div style={{ minWidth: Math.max(820, 220 + range.months.length * 100) }}><div className="grid border-b border-black/10 bg-[#181716] text-white" style={{ gridTemplateColumns: `220px repeat(${range.months.length}, minmax(90px, 1fr))` }}><div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Campaign</div>{range.months.map((month) => <div key={month} className="border-l border-white/10 px-3 py-3 text-center text-xs font-semibold">{month}</div>)}</div><div className="divide-y divide-black/10">{filtered.map((item, index) => {
            const visiblePeriods = calendarPeriodsFor(item).filter((p) => validDate(p.start) && (p.end || p.start) >= range.start && p.start <= range.end);
            return <button key={item.id} onClick={() => setSelected(item)} className="grid w-full grid-cols-[220px_1fr] text-left transition hover:bg-[#fff7f7]"><div className="px-4 py-5"><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-black/45">{item.type} · {visiblePeriods.length ? `${visiblePeriods.length}个已核验日期节点` : "未通过日期审计"}</p></div><div className="relative min-h-20 border-l border-black/10 py-4">{range.months.slice(1).map((month, guideIndex) => <div key={month} className="absolute inset-y-0 border-l border-black/8" style={{ left: `${((guideIndex + 1) / range.months.length) * 100}%` }} />)}{visiblePeriods.map((p, periodIndex) => { const start = p.start as string; const end = validDate(p.end) ? p.end : start; const left = (daysBetween(start, range.start) / totalDays) * 100; const width = Math.max(0.8, ((daysBetween(end, range.start) - daysBetween(start, range.start) + 1) / totalDays) * 100); const color = index % 2 ? calendarSecondary : calendarPrimary; const short = width < 12; const label = start === end ? formatDate(start) : `${formatDate(start)}—${formatDate(end)}`; return <div key={`${start}-${periodIndex}`} style={{ marginLeft: `${left}%`, width: `${width}%`, backgroundColor: color }} className={`relative z-10 mb-2 overflow-visible ${short ? "h-7 min-w-1" : "h-8 min-w-3"}`} title={`${p.label}：${label}`}>{short ? <span className="absolute left-[calc(100%+6px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap border bg-white px-2 py-1 text-[11px] font-bold shadow-sm" style={{ color, borderColor: `${color}55` }}>{label}</span> : <span className="absolute left-2 top-1/2 z-20 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold text-white">{label}</span>}</div>; })}{visiblePeriods.length === 0 && <div className="relative z-10 mx-3 mt-2 border border-dashed bg-[#fff0f0] px-3 py-2 text-xs text-[#b3131d]" style={{ borderColor: `${calendarPrimary}55` }}>已保留项目，但日期证据不足，不进入截图时间轴</div>}</div></button>;
          })}</div></div></div>
        </section>

        <section className="mt-12"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Campaign Library</p><h2 className="mt-2 text-3xl font-black">重点Campaign</h2></div><span className="font-mono text-sm text-black/40">{filtered.length.toString().padStart(2, "0")} ITEMS</span></div><div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">{filtered.map((item, index) => <article key={item.id} className="group flex min-h-80 flex-col bg-[#f4f2ed] p-6 transition hover:bg-white"><div className="flex items-start justify-between"><span className="font-mono text-xs text-black/35">0{index + 1}</span><Badge variant="outline" className="rounded-none border-black/15 bg-transparent">{item.type}</Badge></div><h3 className="mt-8 text-2xl font-black leading-tight tracking-tight">{item.name}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-black/55">{item.summary}</p><div className="mt-5 flex flex-wrap gap-1.5">{item.platforms.slice(0, 4).map((platform) => <span key={platform} className="bg-black/5 px-2 py-1 text-[11px]">{platform}</span>)}</div><button onClick={() => setSelected(item)} className="mt-auto flex items-center justify-between border-t border-black/10 pt-5 text-sm font-semibold transition group-hover:text-[#e41e2b]">查看Campaign详情 <ArrowUpRight className="size-4" /></button></article>)}</div></section>
        <footer className="mt-14 flex flex-col gap-2 border-t border-black/10 py-7 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between"><span>Campaign Intelligence Demo · Browser-only prototype</span><span>不联网 · 不消耗Token · 数据保存在本机浏览器</span></footer>
      </div>
    </main>
  );
}

function CampaignDetail({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  return <main className="min-h-screen bg-[#f4f2ed] text-[#181716]">
    <header className="border-b border-black/10 bg-[#f4f2ed]/95 px-5 py-4 backdrop-blur md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><Button variant="ghost" className="-ml-3 gap-2" onClick={onBack}><ArrowLeft className="size-4" /> 返回Campaign列表</Button><span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Campaign Detail</span></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12"><div className="grid gap-8 lg:grid-cols-[1fr_360px]"><section>
      <div className="mb-7 flex flex-wrap items-center gap-2"><Badge className="rounded-none bg-[#e41e2b] text-white">{campaign.type}</Badge><Badge variant="outline" className="rounded-none border-black/15 bg-white/60">{campaign.confidence}</Badge><span className="ml-1 text-sm text-black/50">{periodsFor(campaign).length ? `${periodsFor(campaign).length}个已标日期节点` : "日期待核实"}</span></div>
      <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">{campaign.name}</h1><p className="mt-5 max-w-3xl text-xl leading-8 text-black/62">{campaign.theme}</p>
      {campaign.parentCampaign && campaign.parentCampaign !== "待核实" && <p className="mt-4 text-sm text-black/50">所属总Campaign：<b className="text-black">{campaign.parentCampaign}</b></p>}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">{periodsFor(campaign).map((p, index) => <div key={index} className="border border-black/10 bg-white px-4 py-3"><p className="text-xs font-bold">{p.label}</p><p className="mt-1 font-mono text-xs text-[#e41e2b]">{formatDate(p.start)}—{formatDate(p.end || p.start)} · {p.confidence || campaign.confidence}</p></div>)}</div>
      <div className="mt-10 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3"><InfoCell label="营销目的" value={campaign.objective} /><InfoCell label="目标受众" value={campaign.audience} /><InfoCell label="合作对象" value={(campaign.partners || []).join("、") || "待核实"} /></div>
      <div className="mt-10 grid gap-8 md:grid-cols-2"><div><SectionTitle number="01" title="背景与为什么做" /><p className="mt-4 text-base leading-7 text-black/66">{campaign.background || "现有导入数据未包含背景分析；使用新版研究指令后会补充。"}</p></div><div><SectionTitle number="02" title="核心传播信息" /><p className="mt-4 text-xl font-bold leading-8">{campaign.keyMessage || campaign.theme}</p><div className="mt-4 flex flex-wrap gap-2">{(campaign.contentPillars || []).map((pillar) => <span key={pillar} className="bg-white px-3 py-1.5 text-xs">{pillar}</span>)}</div></div></div>
      <div className="mt-12 grid gap-8 md:grid-cols-2"><div><SectionTitle number="03" title="Campaign内容与创意" /><p className="mt-4 text-base leading-7 text-black/66">{campaign.summary}</p>{campaign.creativeIdea && <div className="mt-5 border-l-2 border-[#e41e2b] pl-4"><p className="text-xs font-bold uppercase tracking-wider text-black/40">Creative idea</p><p className="mt-2 text-sm leading-6 text-black/65">{campaign.creativeIdea}</p></div>}</div><div><SectionTitle number="04" title="核心传播动作" /><ul className="mt-4 space-y-3">{(campaign.actions || []).map((action, index) => <li key={`${action}-${index}`} className="flex gap-3 border-b border-black/10 pb-3 text-sm"><span className="font-mono text-[#e41e2b]">{String(index + 1).padStart(2, "0")}</span><span>{action}</span></li>)}</ul></div></div>
      {campaign.executions && campaign.executions.length > 0 && <div className="mt-12"><SectionTitle number="05" title="执行时间线" /><div className="mt-4 divide-y divide-black/10 border-y border-black/10">{campaign.executions.map((execution, index) => <div key={`${execution.action}-${index}`} className="grid gap-2 py-4 md:grid-cols-[110px_160px_1fr]"><span className="font-mono text-xs text-[#e41e2b]">{execution.date || "待核实"}</span><div><p className="text-sm font-bold">{execution.action}</p><p className="mt-1 text-xs text-black/40">{execution.platform || "平台待核实"}</p></div><p className="text-sm leading-6 text-black/62">{execution.description || "具体内容待核实"}</p></div>)}</div></div>}
      {campaign.platformStrategy && campaign.platformStrategy.length > 0 && <div className="mt-12"><SectionTitle number="06" title="平台传播分工" /><div className="mt-4 grid gap-3 md:grid-cols-2">{campaign.platformStrategy.map((item, index) => <div key={`${item.platform}-${index}`} className="border border-black/10 bg-white p-5"><div className="flex items-center justify-between"><p className="font-bold">{item.platform}</p><span className="text-[10px] font-bold uppercase tracking-wider text-[#e41e2b]">{item.contentFormat || "形式待核实"}</span></div><p className="mt-3 text-sm leading-6 text-black/60">{item.role || "平台角色待核实"}</p>{item.searchTerm && <p className="mt-3 bg-[#f4f2ed] px-3 py-2 font-mono text-xs text-black/55">搜索词：{item.searchTerm}</p>}</div>)}</div></div>}
      <div className="mt-12"><SectionTitle number="07" title="公开传播数据" /><div className="mt-4 grid gap-3 sm:grid-cols-3">{(campaign.metrics || []).map((metric, index) => <div key={`${metric.label}-${index}`} className="border border-black/10 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-black/45">{metric.label}</p><p className="mt-3 text-3xl font-black tracking-tight">{metric.value}</p>{metric.note && <p className="mt-2 text-xs leading-5 text-[#e41e2b]">{metric.note}</p>}</div>)}</div></div>
      <div className="mt-12"><SectionTitle number="08" title="来源证据" /><div className="mt-4 divide-y divide-black/10 border-y border-black/10">{(campaign.sources || []).map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between py-4 text-sm transition hover:text-[#e41e2b]"><span>{source.title}</span><ExternalLink className="size-4" /></a>)}</div></div>
      {campaign.evidenceGaps && campaign.evidenceGaps.length > 0 && <div className="mt-12 border border-[#e41e2b]/25 bg-[#fff0f0] p-5"><SectionTitle number="09" title="待核实与证据缺口" /><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-black/65">{campaign.evidenceGaps.map((gap, index) => <li key={`${gap}-${index}`}>{gap}</li>)}</ul></div>}
    </section><aside className="h-fit border border-black/10 bg-[#171716] p-5 text-white lg:sticky lg:top-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Platform Links</p><h2 className="mt-2 text-2xl font-bold">去平台继续查</h2><p className="mt-2 text-sm leading-6 text-white/55">Demo会用每个平台的实际搜索词生成入口，不在网站内抓取数据。</p><div className="mt-6 space-y-2">{Object.entries(campaign.platformTerms || {}).map(([platform, term]) => <a key={platform} href={searchUrl(platform, term)} target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-white/12 px-4 py-3 transition hover:border-[#e41e2b] hover:bg-[#e41e2b]"><div><p className="font-semibold">查看{platform}内容</p><p className="mt-1 max-w-[220px] truncate text-xs text-white/45 group-hover:text-white/75">{term}</p></div><ArrowUpRight className="size-4" /></a>)}</div><div className="mt-7 border-t border-white/12 pt-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Data Tools</p><div className="mt-3 grid grid-cols-2 gap-2"><ToolLink label="抖音指数" url="https://trendinsight.oceanengine.com/arithmetic-index?source=nav_portal" /><ToolLink label="千瓜数据" url="https://www.qian-gua.com/" /><ToolLink label="蝉妈妈" url="https://www.chanmama.com/douyin/" /><ToolLink label="飞瓜数据" url="https://www.feigua.cn/" /></div></div><p className="mt-5 bg-white/6 p-3 text-xs leading-5 text-white/45">提示：部分平台或数据工具会要求你在其网站登录。登录信息不会经过本Demo。</p></aside></div></div>
  </main>;
}

function InfoCell({ label, value }: { label: string; value: string }) { return <div className="bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-black/40">{label}</p><p className="mt-3 text-sm leading-6 text-black/70">{value}</p></div>; }
function SectionTitle({ number, title }: { number: string; title: string }) { return <div className="flex items-center gap-3"><span className="font-mono text-xs text-[#e41e2b]">{number}</span><h2 className="text-lg font-bold">{title}</h2></div>; }
function ToolLink({ label, url }: { label: string; url: string }) { return <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-white/12 px-3 py-2.5 text-xs transition hover:border-white/40"><span>{label}</span><Link2 className="size-3.5 text-white/45" /></a>; }
