"use client";

import { useMemo, useState } from "react";
import rawData from "./report-data.json";

type Summary = {
  businessSku: number;
  redundantSku: number;
  redundantSkuRate: number;
  zeroForecastHighRisk: number;
  zeroForecastExempt: number;
  stage1Forecast: number;
  stage1Extra: number;
  stage1Target: number;
  stage1Multiple: number;
  stage2Forecast: number;
  stage2Extra: number;
  stage2Target: number;
  stage2Multiple: number;
  totalExtra: number;
  storageNoAction: number;
  storageOctHealthy: number;
  storageDecClear: number;
  storageSavingOct: number;
  storageSavingDec: number;
};

type GroupRisk = {
  priority: number;
  risk: string;
  group: string;
  owner: string;
  topLink: string;
  feature: string;
  reason: string;
  skuCount: number;
  redundantSkuCount: number;
  redundantSkuRate: number;
  zeroForecastHighRisk: number;
  headRedundancy: number;
  octExtra: number;
  decExtra: number;
  totalExtra: number;
  share: number;
  nonCoreShare: number;
  forecastAugOct: number;
  octMultiple: number;
  forecastNovDec: number;
  decMultiple: number;
  storageNoAction: number;
  storageOctHealthy: number;
  storageDecClear: number;
  action: string;
};

type CategoryRisk = {
  priority: number;
  risk: string;
  category: string;
  owner: string;
  topLink: string;
  feature: string;
  skuCount: number;
  redundantSkuCount: number;
  redundantSkuRate: number;
  zeroForecastHighRisk: number;
  octExtra: number;
  decExtra: number;
  totalExtra: number;
  share: number;
  octMultiple: number;
  decMultiple: number;
  storageNoAction: number;
  storageOctHealthy: number;
  storageDecClear: number;
  action: string;
};

type SkuRow = {
  priority: number;
  severity: string;
  difficulty: string;
  salesTier: string;
  msku: string;
  link: string;
  owner: string;
  category: string;
  group: string;
  productType: string;
  linkTier: string;
  size: string;
  sizeGroup: string;
  fba: number;
  local: number;
  forecast: number;
  octExtra: number;
  octMultiple: number;
  decExtra: number;
  decMultiple: number;
  totalExtra: number;
  zeroForecastHighRisk: string;
  reason: string;
  storageNoAction: number;
  storageOctHealthy: number;
  storageDecClear: number;
};

type LinkRow = {
  priority: number;
  risk: string;
  link: string;
  owner: string;
  category: string;
  group: string;
  team: string;
  productType: string;
  skuCount: number;
  redundantSkuCount: number;
  redundantSkuRate: number;
  forecast: number;
  local: number;
  octExtra: number;
  decExtra: number;
  totalExtra: number;
  share: number;
  coreExtra: number;
  nonCoreExtra: number;
};

type ReportData = {
  meta: {
    title: string;
    snapshotDate: string;
    salesForecastLocalCutoff: string;
    fbaSnapshotDate: string;
    sourceWorkbook: string;
    sourceWorkbookModifiedAt: string;
    sourceWorkbookSize: number;
    vineExcludedLinks: number;
    fbaMatchRate: number;
    snapshotNotice: string;
    sourceCorrections: Array<{
      sheet: string;
      field: string;
      original: string;
      corrected: string;
      basis: string;
    }>;
  };
  summary: Summary;
  groups: GroupRisk[];
  categories: CategoryRisk[];
  nodes: {
    overall: {
      stage1: {
        period: string;
        forecast: number;
        extra: number;
        target: number;
        multiple: number;
        goal: string;
      };
      stage2: {
        period: string;
        forecast: number;
        extra: number;
        target: number;
        multiple: number;
        goal: string;
      };
    };
    groups: Array<{
      group: string;
      skuCount: number;
      redundantSkuCount: number;
      zeroForecastHighRisk: number;
      zeroForecastExempt: number;
      stage1Forecast: number;
      stage1Extra: number;
      stage1Target: number;
      stage1Multiple: number;
      stage2Forecast: number;
      stage2Extra: number;
      stage2Target: number;
      stage2Multiple: number;
      totalExtra: number;
    }>;
    owners: Array<{
      owner: string;
      skuCount: number;
      redundantSkuCount: number;
      zeroForecastHighRisk: number;
      stage1Extra: number;
      stage1Multiple: number;
      stage2Extra: number;
      stage2Multiple: number;
      totalExtra: number;
    }>;
  };
  monthlyInventory: Array<{
    month: string;
    fba: number;
    local: number;
    total: number;
    allFba: number;
    allLocal: number;
    allTotal: number;
  }>;
  storage: {
    overall: Array<{
      scenario: string;
      total: number;
      saving: number;
      savingRate: number;
      octMultiplier: number;
    }>;
    groups: Array<{
      group: string;
      scenario: string;
      total: number;
      saving: number;
      savingRate: number;
    }>;
  };
  sizes: Array<{
    sizeGroup: string;
    skuCount: number;
    redundantSkuCount: number;
    redundantSkuRate: number;
    octExtra: number;
    decExtra: number;
    totalExtra: number;
    share: number;
    riskWeight: number;
    zeroForecastHighRisk: number;
    zeroForecastExempt: number;
    headRedundancy: number;
    octMultiple: number;
    decMultiple: number;
  }>;
  skuDifficulty: {
    counts: Record<string, number>;
    salesTierCounts: Record<string, number>;
    bySalesTier: Record<string, Record<string, number>>;
    rows: SkuRow[];
  };
  links: LinkRow[];
  categoryTop10: Array<{
    category: string;
    rank: number;
    risk: string;
    link: string;
    owner: string;
    team: string;
    skuCount: number;
    redundantSkuCount: number;
    redundantSkuRate: number;
    octExtra: number;
    decExtra: number;
    totalExtra: number;
    share: number;
    zeroForecastHighRisk: number;
    headRedundancy: number;
    octMultiple: number;
    decMultiple: number;
    difficulty: string;
    difficultyMultiple: number;
    storageNoAction: number;
    storageOctHealthy: number;
    storageDecClear: number;
  }>;
  zeroForecastHighRiskRows: Array<{
    status: string;
    msku: string;
    link: string;
    owner: string;
    category: string;
    group: string;
    productType: string;
    size: string;
    fba: number;
    local: number;
    octExtra: number;
    difficulty: string;
    alert: string;
  }>;
  recoverableRevenue: {
    parameters: {
      stage1PriceRetention: number;
      stage2PriceRetention: number;
      currency: string;
      pricePriority: string[];
    };
    overall: {
      totalExtraUnits: number;
      stage1Units: number;
      stage2Units: number;
      referenceRevenueUpper: number;
      recommendedRevenue: number;
      priceConcession: number;
      recovery25: number;
      recovery50: number;
      recovery75: number;
      recovery100: number;
    };
    quality: {
      redundantSkuCount: number;
      pricedSkuCount: number;
      pricedExtraUnits: number;
      unpricedExtraUnits: number;
      priceCoverage: number;
      unpricedLink: string;
    };
    groups: Array<{
      group: string;
      skuCount: number;
      pricedSkuCount: number;
      totalExtraUnits: number;
      stage1Units: number;
      stage2Units: number;
      stage1RecoverableRevenue: number;
      stage2RecoverableRevenue: number;
      recommendedRevenue: number;
      recoveryShare: number;
      priceCoverage: number;
      recovery25: number;
      recovery50: number;
      recovery75: number;
      recovery100: number;
    }>;
  };
};

const report = rawData as unknown as ReportData;

const integer = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const oneDecimal = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatInt(value: number | null | undefined) {
  return integer.format(value ?? 0);
}

function formatMoney(value: number | null | undefined) {
  return money.format(value ?? 0);
}

function formatPct(value: number | null | undefined) {
  return `${oneDecimal.format((value ?? 0) * 100)}%`;
}

function formatMultiple(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "无法表达";
  return `${value.toFixed(2)}×`;
}

function riskClass(risk: string) {
  if (risk.includes("P0")) return "risk risk-p0";
  if (risk.includes("P1")) return "risk risk-p1";
  if (risk.includes("P2")) return "risk risk-p2";
  if (risk.includes("P3")) return "risk risk-p3";
  return "risk risk-normal";
}

function difficultyClass(difficulty: string) {
  if (difficulty === "极高") return "difficulty difficulty-critical";
  if (difficulty === "高") return "difficulty difficulty-high";
  if (difficulty === "中") return "difficulty difficulty-medium";
  return "difficulty difficulty-low";
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "critical" | "accent" | "positive";
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}

function StorageBars() {
  const maxValue = Math.max(...report.storage.overall.map((item) => item.total));
  return (
    <div className="bar-chart" role="img" aria-label="三种仓储费方案对比">
      {report.storage.overall.map((item, index) => (
        <div className="bar-row" key={item.scenario}>
          <div className="bar-label">
            <span>{item.scenario}</span>
            <strong>{formatMoney(item.total)}</strong>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill storage-${index}`}
              style={{ width: `${Math.max((item.total / maxValue) * 100, 2)}%` }}
            />
          </div>
          <p>
            {item.saving > 0
              ? `较无动作节约 ${formatMoney(item.saving)}（${formatPct(item.savingRate)}）`
              : "基准方案"}
          </p>
        </div>
      ))}
    </div>
  );
}

function InventoryBars() {
  const maxValue = Math.max(...report.monthlyInventory.map((item) => item.total));
  return (
    <div className="inventory-chart" role="img" aria-label="7月至12月业务口径月末库存">
      <div className="legend-row">
        <span><i className="legend-swatch swatch-fba" />FBA</span>
        <span><i className="legend-swatch swatch-local" />本地</span>
      </div>
      {report.monthlyInventory.map((item) => (
        <div className="inventory-row" key={item.month}>
          <strong>{item.month}</strong>
          <div className="inventory-track">
            <div
              className="inventory-segment segment-fba"
              style={{ width: `${(item.fba / maxValue) * 100}%` }}
              title={`FBA ${formatInt(item.fba)}件`}
            />
            <div
              className="inventory-segment segment-local"
              style={{ width: `${(item.local / maxValue) * 100}%` }}
              title={`本地 ${formatInt(item.local)}件`}
            />
          </div>
          <span>{formatInt(item.total)}件</span>
        </div>
      ))}
    </div>
  );
}

function GroupConcentration() {
  const maxValue = Math.max(...report.groups.map((item) => item.totalExtra));
  return (
    <div className="group-chart" role="img" aria-label="各组别两节点待处理量">
      <div className="legend-row">
        <span><i className="legend-swatch swatch-stage1" />10月底FBA健康</span>
        <span><i className="legend-swatch swatch-stage2" />12月底全部清零</span>
      </div>
      {report.groups.map((item) => (
        <div className="group-bar-row" key={`${item.priority}-${item.group}`}>
          <div className="group-bar-name">
            <span className={riskClass(item.risk)}>{item.risk}</span>
            <strong>{item.group}</strong>
          </div>
          <div className="group-bar-track">
            <div
              className="group-bar-stage group-bar-stage1"
              style={{ width: `${(item.octExtra / maxValue) * 100}%` }}
              title={`10月底新增 ${formatInt(item.octExtra)}件`}
            />
            <div
              className="group-bar-stage group-bar-stage2"
              style={{ width: `${(item.decExtra / maxValue) * 100}%` }}
              title={`12月底新增 ${formatInt(item.decExtra)}件`}
            />
          </div>
          <span>{formatInt(item.totalExtra)}件</span>
        </div>
      ))}
    </div>
  );
}

function RevenueGroupBars() {
  const maxValue = Math.max(
    ...report.recoverableRevenue.groups.map((item) => item.recommendedRevenue),
  );
  return (
    <div className="bar-chart" role="img" aria-label="各组别加速出清可新增回收销售额">
      {report.recoverableRevenue.groups.map((item) => (
        <div className="bar-row" key={`revenue-${item.group}`}>
          <div className="bar-label">
            <span>{item.group}</span>
            <strong>{formatMoney(item.recommendedRevenue)}</strong>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill storage-1"
              style={{
                width: `${Math.max((item.recommendedRevenue / maxValue) * 100, 2)}%`,
              }}
            />
          </div>
          <p>
            占全部回收额{formatPct(item.recoveryShare)} · 节点新增销量
            {formatInt(item.totalExtraUnits)}件
          </p>
        </div>
      ))}
    </div>
  );
}

function DifficultyBars() {
  const entries = ["极高", "高", "中", "低"]
    .map((key) => [key, report.skuDifficulty.counts[key] ?? 0] as const)
    .filter(([, value]) => value > 0);
  const maxValue = Math.max(...entries.map(([, value]) => value), 1);
  return (
    <div className="difficulty-chart" role="img" aria-label="冗余SKU清货难度分布">
      {entries.map(([key, value]) => (
        <div className="difficulty-row" key={key}>
          <span className={difficultyClass(key)}>{key}</span>
          <div className="difficulty-track">
            <div
              className={`difficulty-fill difficulty-fill-${key}`}
              style={{ width: `${Math.max((value / maxValue) * 100, 2)}%` }}
            />
          </div>
          <strong>{formatInt(value)}个</strong>
        </div>
      ))}
    </div>
  );
}

function DetailTable() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("全部组别");
  const [category, setCategory] = useState("全部品类");
  const [owner, setOwner] = useState("全部负责人");
  const [difficulty, setDifficulty] = useState("全部难度");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const groups = useMemo(
    () => [...new Set(report.skuDifficulty.rows.map((row) => row.group))].filter(Boolean).sort(),
    [],
  );
  const categories = useMemo(
    () => [...new Set(report.skuDifficulty.rows.map((row) => row.category))].filter(Boolean).sort(),
    [],
  );
  const owners = useMemo(
    () => [...new Set(report.skuDifficulty.rows.map((row) => row.owner))].filter(Boolean).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return report.skuDifficulty.rows.filter((row) => {
      if (group !== "全部组别" && row.group !== group) return false;
      if (category !== "全部品类" && row.category !== category) return false;
      if (owner !== "全部负责人" && row.owner !== owner) return false;
      if (difficulty !== "全部难度" && row.difficulty !== difficulty) return false;
      if (!needle) return true;
      return [row.msku, row.link, row.owner, row.category, row.group, row.size]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [query, group, category, owner, difficulty]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);

  return (
    <div className="detail-panel">
      <div className="filters" aria-label="SKU明细筛选">
        <label className="search-field">
          <span>搜索SKU、链接或负责人</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetPage();
            }}
            placeholder="输入MSKU、链接名、负责人…"
          />
        </label>
        <label>
          <span>组别</span>
          <select value={group} onChange={(event) => { setGroup(event.target.value); resetPage(); }}>
            <option>全部组别</option>
            {groups.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>品类</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); resetPage(); }}>
            <option>全部品类</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>负责人</span>
          <select value={owner} onChange={(event) => { setOwner(event.target.value); resetPage(); }}>
            <option>全部负责人</option>
            {owners.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>清货难度</span>
          <select value={difficulty} onChange={(event) => { setDifficulty(event.target.value); resetPage(); }}>
            <option>全部难度</option>
            {["极高", "高", "中", "低"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="table-toolbar">
        <p>
          已筛选 <strong>{formatInt(filtered.length)}</strong> 个SKU，共{" "}
          <strong>{formatInt(filtered.reduce((sum, row) => sum + row.totalExtra, 0))}</strong> 件待处理量
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setQuery("");
            setGroup("全部组别");
            setCategory("全部品类");
            setOwner("全部负责人");
            setDifficulty("全部难度");
            setPage(1);
          }}
        >
          清除筛选
        </button>
      </div>

      <div className="table-scroll">
        <table className="data-table sku-table">
          <thead>
            <tr>
              <th>优先级</th>
              <th>风险/难度</th>
              <th>MSKU</th>
              <th>链接</th>
              <th>负责人</th>
              <th>组别/品类</th>
              <th>尺码</th>
              <th className="numeric">FBA</th>
              <th className="numeric">本地</th>
              <th className="numeric">正常预估</th>
              <th className="numeric">10月新增</th>
              <th className="numeric">10月倍数</th>
              <th className="numeric">12月新增</th>
              <th className="numeric">12月倍数</th>
              <th className="numeric">待处理合计</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={`${row.priority}-${row.msku}`}>
                <td><strong>#{row.priority}</strong></td>
                <td>
                  <span className={riskClass(row.severity)}>{row.severity}</span>
                  <span className={difficultyClass(row.difficulty)}>{row.difficulty}</span>
                </td>
                <td className="mono">{row.msku}</td>
                <td className="link-cell" title={row.link}>{row.link}</td>
                <td>{row.owner}</td>
                <td>{row.group}<small>{row.category}</small></td>
                <td>{row.size}<small>{row.sizeGroup}</small></td>
                <td className="numeric">{formatInt(row.fba)}</td>
                <td className="numeric">{formatInt(row.local)}</td>
                <td className="numeric">{formatInt(row.forecast)}</td>
                <td className="numeric">{formatInt(row.octExtra)}</td>
                <td className="numeric">{formatMultiple(row.octMultiple)}</td>
                <td className="numeric">{formatInt(row.decExtra)}</td>
                <td className="numeric">{formatMultiple(row.decMultiple)}</td>
                <td className="numeric total-cell">{formatInt(row.totalExtra)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination" aria-label="SKU明细分页">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => setPage((value) => Math.max(value - 1, 1))}
        >
          上一页
        </button>
        <span>第 {safePage} / {totalPages} 页</span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
        >
          下一页
        </button>
      </div>
    </div>
  );
}

function LinkTable() {
  const categories = ["全部品类", ...new Set(report.categoryTop10.map((row) => row.category))];
  const [category, setCategory] = useState("全部品类");
  const rows = report.categoryTop10.filter(
    (row) => category === "全部品类" || row.category === category,
  );
  return (
    <div className="detail-panel compact-panel">
      <div className="table-toolbar">
        <p>按品类查看优先处理链接，每个品类最多10条。</p>
        <label className="inline-select">
          <span>选择品类</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>品类内排序</th>
              <th>风险</th>
              <th>链接</th>
              <th>负责人</th>
              <th>梯队</th>
              <th className="numeric">冗余SKU</th>
              <th className="numeric">SKU冗余率</th>
              <th className="numeric">10月新增</th>
              <th className="numeric">12月新增</th>
              <th className="numeric">待处理合计</th>
              <th className="numeric">最高节点倍数</th>
              <th className="numeric">12月清零仓储费</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.category}-${row.rank}`}>
                <td>{row.category} #{row.rank}</td>
                <td><span className={riskClass(row.risk)}>{row.risk}</span></td>
                <td className="link-cell" title={row.link}>{row.link}</td>
                <td>{row.owner}</td>
                <td>{row.team}</td>
                <td className="numeric">{formatInt(row.redundantSkuCount)}</td>
                <td className="numeric">{formatPct(row.redundantSkuRate)}</td>
                <td className="numeric">{formatInt(row.octExtra)}</td>
                <td className="numeric">{formatInt(row.decExtra)}</td>
                <td className="numeric total-cell">{formatInt(row.totalExtra)}</td>
                <td className="numeric">{formatMultiple(row.difficultyMultiple)}</td>
                <td className="numeric">{formatMoney(row.storageDecClear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const { summary } = report;
  const recovery = report.recoverableRevenue;
  const topGroups = report.groups.slice(0, 3);
  const topTwoShare = report.groups
    .slice(0, 2)
    .reduce((sum, group) => sum + group.share, 0);
  const headCount = report.skuDifficulty.salesTierCounts["头部"] ?? 0;
  const highDifficulty = report.skuDifficulty.counts["极高"] ?? 0;
  const generatedAt = new Date(report.meta.sourceWorkbookModifiedAt).toLocaleString("zh-CN", {
    hour12: false,
  });

  return (
    <main>
      <nav className="top-nav" aria-label="报告导航">
        <a className="brand" href="#top">
          <span className="brand-mark">IR</span>
          <span>
            <strong>库存风险报告</strong>
            <small>2026·07 快照</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#overview">总览</a>
          <a href="#groups">组别</a>
          <a href="#sales">增销</a>
          <a href="#revenue">销售额</a>
          <a href="#storage">仓储费</a>
          <a href="#sku">SKU明细</a>
        </div>
        <button className="print-button" type="button" onClick={() => window.print()}>
          打印报告
        </button>
      </nav>

      <header className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">FBA与本地库存 · 内部行动快照</p>
            <h1>库存冗余与清货行动报告</h1>
            <p className="hero-summary">
              当前不是所有大库存SKU都难清，而是风险集中在少数高冗余率组别、长尾与零预估无去化路径SKU。
              两阶段同步执行，可在10月底把FBA拉回77天健康线，并在12月底清理剩余库存。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#groups">查看优先组别</a>
              <a className="secondary-button" href="#sku">筛选SKU明细</a>
            </div>
          </div>
          <aside className="hero-status">
            <p>报告快照</p>
            <strong>{report.meta.snapshotDate}</strong>
            <dl>
              <div><dt>销量/本地截止</dt><dd>{report.meta.salesForecastLocalCutoff}</dd></div>
              <div><dt>FBA库存日</dt><dd>{report.meta.fbaSnapshotDate}</dd></div>
              <div><dt>FBA匹配率</dt><dd>{formatPct(report.meta.fbaMatchRate)}</dd></div>
              <div><dt>排除VINE链接</dt><dd>{report.meta.vineExcludedLinks}个</dd></div>
            </dl>
            <span className="snapshot-pill">已验证Excel快照</span>
          </aside>
        </div>
      </header>

      <section className="report-section first-section" id="overview">
        <SectionTitle
          eyebrow="Executive Summary"
          title="冗余规模可控，但执行必须按两节点分工"
          description="10月底优先处理FBA仓储风险，11–12月再清理FBA与本地剩余库存；零预估无去化路径SKU单独管理。"
        />
        <div className="executive-grid">
          <article>
            <strong>{formatPct(summary.redundantSkuRate)}的业务SKU需要动作。</strong>
            <p>{formatInt(summary.redundantSku)}个SKU、合计{formatInt(summary.totalExtra)}件待处理；并非所有库存都应“一刀切”清仓。</p>
          </article>
          <article>
            <strong>销量增量集中在两个明确节点。</strong>
            <p>8–10月统一按{formatMultiple(summary.stage1Multiple)}，11–12月统一按{formatMultiple(summary.stage2Multiple)}。</p>
          </article>
          <article>
            <strong>组别集中度决定管理优先级。</strong>
            <p>{report.groups[0].group}与{report.groups[1].group}合计承担{formatPct(topTwoShare)}的待处理量，应先锁定周度责任。</p>
          </article>
          <article>
            <strong>12月底清零方案节约最多。</strong>
            <p>预计仓储费降至{formatMoney(summary.storageDecClear)}，较无动作节约{formatMoney(summary.storageSavingDec)}。</p>
          </article>
          <article>
            <strong>加快出清可新增回收毛销售额。</strong>
            <p>推荐价保情景100%完成可新增回收{formatMoney(recovery.overall.recommendedRevenue)}，其中{report.recoverableRevenue.groups[0].group}占{formatPct(report.recoverableRevenue.groups[0].recoveryShare)}。</p>
          </article>
        </div>

        <div className="metric-grid overview-metrics" aria-label="关键指标">
          <MetricCard
            label="业务口径SKU"
            value={formatInt(summary.businessSku)}
            note={`其中${formatInt(summary.redundantSku)}个需处理`}
          />
          <MetricCard
            label="冗余SKU率"
            value={formatPct(summary.redundantSkuRate)}
            note="排除VINE与既定停售/清仓豁免"
            tone="critical"
          />
          <MetricCard
            label="两节点新增销量"
            value={formatInt(summary.totalExtra)}
            note={`${formatInt(summary.stage1Extra)} + ${formatInt(summary.stage2Extra)}件`}
            tone="accent"
          />
          <MetricCard
            label="零预估高风险"
            value={formatInt(summary.zeroForecastHighRisk)}
            note="非停售/清仓且有库存"
            tone="critical"
          />
          <MetricCard
            label="最高仓储费节约"
            value={formatMoney(summary.storageSavingDec)}
            note="12月底全部库存健康"
            tone="positive"
          />
          <MetricCard
            label="推荐可回收销售额"
            value={formatMoney(recovery.overall.recommendedRevenue)}
            note={`完成50%可回收${formatMoney(recovery.overall.recovery50)}`}
            tone="positive"
          />
        </div>

        <div className="definition-callout">
          <div>
            <span>77天</span>
            <p><strong>FBA健康线</strong>：10月底FBA不超过未来77天需求。</p>
          </div>
          <div>
            <span>10/15</span>
            <p><strong>费用节点</strong>：之后库存按3倍仓储费测算。</p>
          </div>
          <div>
            <span>12/15</span>
            <p><strong>本地冗余线</strong>：生产周期加30天后仍剩余的库存。</p>
          </div>
        </div>
      </section>

      <section className="report-section tinted-section" id="groups">
        <SectionTitle
          eyebrow="01 · Risk concentration"
          title={`${topGroups[0].group}与${topGroups[1].group}承担${formatPct(topTwoShare)}待处理量`}
          description="规模、冗余SKU率、销量承接能力和零预估风险共同决定优先级；大库存头部SKU因销量高，不自动判定为难清。"
        />
        <div className="split-layout">
          <div className="chart-card">
            <header>
              <h3>组别两节点待处理量</h3>
              <p>单位：件；按总待处理量降序</p>
            </header>
            <GroupConcentration />
          </div>
          <aside className="insight-card">
            <span className="insight-number">{formatPct(topTwoShare)}</span>
            <h3>前两组别需先建立周度清货节奏</h3>
            <p>{topGroups[0].group}量最大；{topGroups[1].group}规模次之，12月所需倍数为{formatMultiple(topGroups[1].decMultiple)}，需要更密集地复盘实际增销。</p>
            <ul>
              {topGroups.map((group) => (
                <li key={`top-${group.group}`}>
                  {group.group}：{formatInt(group.totalExtra)}件，12月{formatMultiple(group.decMultiple)}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="risk-cards">
          {report.groups.map((group) => (
            <article className="risk-card" key={`${group.priority}-${group.group}`}>
              <header>
                <span className={riskClass(group.risk)}>{group.risk}</span>
                <span>优先级 #{group.priority}</span>
              </header>
              <h3>{group.group}</h3>
              <p className="owner-line">主要责任人：<strong>{group.owner}</strong></p>
              <div className="risk-card-metrics">
                <div><span>待处理量</span><strong>{formatInt(group.totalExtra)}</strong></div>
                <div><span>冗余SKU率</span><strong>{formatPct(group.redundantSkuRate)}</strong></div>
                <div><span>10月倍数</span><strong>{formatMultiple(group.octMultiple)}</strong></div>
                <div><span>12月倍数</span><strong>{formatMultiple(group.decMultiple)}</strong></div>
              </div>
              <p className="feature-text">{group.feature}</p>
              <p className="action-line">{group.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section" id="sales">
        <SectionTitle
          eyebrow="02 · Sales uplift"
          title="增销量不按月反复改倍数，而是围绕两个节点统一执行"
          description="8、9、10月使用同一倍数，11、12月使用同一倍数，方便负责人拆解周目标并持续复盘。"
        />
        <div className="node-grid">
          <article className="node-card node-one">
            <div className="node-index">01</div>
            <p>{report.nodes.overall.stage1.period}</p>
            <h3>{report.nodes.overall.stage1.goal}</h3>
            <strong>{formatMultiple(report.nodes.overall.stage1.multiple)}</strong>
            <dl>
              <div><dt>正常预估</dt><dd>{formatInt(report.nodes.overall.stage1.forecast)}</dd></div>
              <div><dt>新增销量</dt><dd>+{formatInt(report.nodes.overall.stage1.extra)}</dd></div>
              <div><dt>目标销量</dt><dd>{formatInt(report.nodes.overall.stage1.target)}</dd></div>
            </dl>
          </article>
          <article className="node-card node-two">
            <div className="node-index">02</div>
            <p>{report.nodes.overall.stage2.period}</p>
            <h3>{report.nodes.overall.stage2.goal}</h3>
            <strong>{formatMultiple(report.nodes.overall.stage2.multiple)}</strong>
            <dl>
              <div><dt>正常预估</dt><dd>{formatInt(report.nodes.overall.stage2.forecast)}</dd></div>
              <div><dt>新增销量</dt><dd>+{formatInt(report.nodes.overall.stage2.extra)}</dd></div>
              <div><dt>目标销量</dt><dd>{formatInt(report.nodes.overall.stage2.target)}</dd></div>
            </dl>
          </article>
          <aside className="node-note">
            <span>特别提醒</span>
            <h3>{formatInt(summary.zeroForecastHighRisk)}个零预估SKU不能用倍数表达</h3>
            <p>这些SKU不是停售或清仓，却没有正常销量路径，应单独建立“定价、广告、调拨、移除”责任清单。</p>
          </aside>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>组别</th>
                <th className="numeric">8–10月正常预估</th>
                <th className="numeric">10月新增</th>
                <th className="numeric">10月倍数</th>
                <th className="numeric">11–12月正常预估</th>
                <th className="numeric">12月新增</th>
                <th className="numeric">12月倍数</th>
                <th className="numeric">新增合计</th>
              </tr>
            </thead>
            <tbody>
              {report.nodes.groups.map((row) => (
                <tr key={row.group}>
                  <td><strong>{row.group}</strong></td>
                  <td className="numeric">{formatInt(row.stage1Forecast)}</td>
                  <td className="numeric">+{formatInt(row.stage1Extra)}</td>
                  <td className="numeric">{formatMultiple(row.stage1Multiple)}</td>
                  <td className="numeric">{formatInt(row.stage2Forecast)}</td>
                  <td className="numeric">+{formatInt(row.stage2Extra)}</td>
                  <td className="numeric">{formatMultiple(row.stage2Multiple)}</td>
                  <td className="numeric total-cell">{formatInt(row.totalExtra)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-section" id="revenue">
        <SectionTitle
          eyebrow="03 · Recoverable revenue"
          title={`加速出清100%完成可新增回收${formatMoney(recovery.overall.recommendedRevenue)}`}
          description={`按10月底FBA新增销量${formatPct(recovery.parameters.stage1PriceRetention)}价保、12月底全部出清新增销量${formatPct(recovery.parameters.stage2PriceRetention)}价保估算。该口径是相对正常销量额外回收的毛销售额，不是利润。`}
        />

        <div className="metric-grid revenue-metrics" aria-label="可回收销售额情景">
          <MetricCard
            label="参考价销售额上限"
            value={formatMoney(recovery.overall.referenceRevenueUpper)}
            note="按参考均价、不让利的理论上限"
          />
          <MetricCard
            label="25%完成"
            value={formatMoney(recovery.overall.recovery25)}
            note="节点新增销量完成四分之一"
          />
          <MetricCard
            label="50%完成"
            value={formatMoney(recovery.overall.recovery50)}
            note="节点新增销量完成一半"
            tone="accent"
          />
          <MetricCard
            label="75%完成"
            value={formatMoney(recovery.overall.recovery75)}
            note="节点新增销量完成四分之三"
            tone="positive"
          />
          <MetricCard
            label="100%完成"
            value={formatMoney(recovery.overall.recovery100)}
            note={`${formatInt(recovery.overall.totalExtraUnits)}件新增销量全部完成`}
            tone="positive"
          />
        </div>

        <div className="split-layout">
          <div className="chart-card">
            <header>
              <h3>组别可回收销售额排名</h3>
              <p>美元；推荐价保情景100%完成</p>
            </header>
            <RevenueGroupBars />
          </div>
          <aside className="insight-card">
            <span className="insight-number">
              {formatPct(recovery.quality.priceCoverage)}
            </span>
            <h3>新增销量已有参考价格覆盖</h3>
            <p>
              {formatInt(recovery.quality.pricedExtraUnits)}件有价，
              {formatInt(recovery.quality.unpricedExtraUnits)}件未覆盖；未覆盖部分未按0元计入。
            </p>
            <ul>
              <li>未覆盖链接：{recovery.quality.unpricedLink}</li>
              <li>价格优先：{recovery.parameters.pricePriority.join(" → ")}</li>
              <li>价保让利空间：{formatMoney(recovery.overall.priceConcession)}</li>
            </ul>
          </aside>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>组别</th>
                <th className="numeric">节点新增销量</th>
                <th className="numeric">价格覆盖率</th>
                <th className="numeric">10月底可回收</th>
                <th className="numeric">12月底可回收</th>
                <th className="numeric">推荐可回收合计</th>
                <th className="numeric">回收额占比</th>
                <th className="numeric">50%完成</th>
                <th className="numeric">100%完成</th>
              </tr>
            </thead>
            <tbody>
              {recovery.groups.map((row) => (
                <tr key={`recovery-row-${row.group}`}>
                  <td><strong>{row.group}</strong></td>
                  <td className="numeric">{formatInt(row.totalExtraUnits)}</td>
                  <td className="numeric">{formatPct(row.priceCoverage)}</td>
                  <td className="numeric">{formatMoney(row.stage1RecoverableRevenue)}</td>
                  <td className="numeric">{formatMoney(row.stage2RecoverableRevenue)}</td>
                  <td className="numeric total-cell">{formatMoney(row.recommendedRevenue)}</td>
                  <td className="numeric">{formatPct(row.recoveryShare)}</td>
                  <td className="numeric">{formatMoney(row.recovery50)}</td>
                  <td className="numeric">{formatMoney(row.recovery100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="quality-note">
          <strong>销售额口径</strong>
          <p>
            仅计算相对正常销量额外完成两节点新增销量后可能回收的毛销售额；
            未扣Amazon平台费、广告费、折扣券、退货、税费和产品成本，也不等同于利润或现金净流入。
          </p>
        </div>
      </section>

      <section className="report-section tinted-section" id="inventory">
        <SectionTitle
          eyebrow="04 · Inventory runway"
          title="正常销量下，业务库存到12月底仍有20.4万件"
          description="月末库存从7月的69.3万件降至12月的20.4万件，但正常去化不足以完全消除冗余，因此仍需要两节点增销。"
        />
        <div className="split-layout inventory-layout">
          <div className="chart-card">
            <header>
              <h3>7–12月业务月末库存</h3>
              <p>正常销量预估口径；FBA与本地堆叠</p>
            </header>
            <InventoryBars />
          </div>
          <aside className="inventory-stat">
            <p>7月 → 12月</p>
            <strong>-70.6%</strong>
            <span>{formatInt(report.monthlyInventory[0].total)}件降至{formatInt(report.monthlyInventory.at(-1)?.total)}件</span>
            <hr />
            <p>12月底库存结构</p>
            <dl>
              <div><dt>FBA</dt><dd>{formatInt(report.monthlyInventory.at(-1)?.fba)}件</dd></div>
              <div><dt>本地</dt><dd>{formatInt(report.monthlyInventory.at(-1)?.local)}件</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="report-section" id="storage">
        <SectionTitle
          eyebrow="05 · Storage economics"
          title="仓储费节约主要来自10月前把FBA拉回健康线"
          description="10月起按3倍费率测算；10月底FBA健康已经实现大部分节约，12月底清零进一步减少11–12月费用。"
        />
        <div className="split-layout">
          <div className="chart-card">
            <header>
              <h3>8–12月仓储费三方案</h3>
              <p>美元；基于SKU预计30天仓储费折算</p>
            </header>
            <StorageBars />
          </div>
          <aside className="savings-card">
            <span>最大可节约</span>
            <strong>{formatMoney(summary.storageSavingDec)}</strong>
            <p>相当于无动作方案费用的{formatPct(summary.storageSavingDec / summary.storageNoAction)}。</p>
            <dl>
              <div><dt>10月底健康</dt><dd>{formatMoney(summary.storageOctHealthy)}</dd></div>
              <div><dt>12月底清零</dt><dd>{formatMoney(summary.storageDecClear)}</dd></div>
            </dl>
          </aside>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>组别</th>
                <th className="numeric">无动作仓储费</th>
                <th className="numeric">10月底FBA健康</th>
                <th className="numeric">节约</th>
                <th className="numeric">12月底全部清零</th>
                <th className="numeric">节约</th>
              </tr>
            </thead>
            <tbody>
              {report.groups.map((group) => (
                <tr key={group.group}>
                  <td><strong>{group.group}</strong></td>
                  <td className="numeric">{formatMoney(group.storageNoAction)}</td>
                  <td className="numeric">{formatMoney(group.storageOctHealthy)}</td>
                  <td className="numeric positive-text">{formatMoney(group.storageNoAction - group.storageOctHealthy)}</td>
                  <td className="numeric">{formatMoney(group.storageDecClear)}</td>
                  <td className="numeric positive-text">{formatMoney(group.storageNoAction - group.storageDecClear)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-section tinted-section" id="difficulty">
        <SectionTitle
          eyebrow="06 · Clearance difficulty"
          title="冗余数量大不等于难清，销量承接能力才是关键"
          description="清货难度以两个节点的最大所需倍数为主；头部SKU下调一级、长尾SKU上调一级，避免把高销量头部SKU误判为高难度。"
        />
        <div className="split-layout">
          <div className="chart-card">
            <header>
              <h3>清货难度分布</h3>
              <p>共{formatInt(summary.redundantSku)}个待处理SKU</p>
            </header>
            <DifficultyBars />
          </div>
          <aside className="insight-card difficulty-insight">
            <span className="insight-number">{formatInt(headCount)}</span>
            <h3>头部SKU具备更强承接能力</h3>
            <p>即使待处理量较大，只要正常销量高、节点倍数可达，难度会下调；真正需要专项方案的是{formatInt(highDifficulty)}个极高难度SKU。</p>
          </aside>
        </div>

        <div className="size-grid">
          {report.sizes.map((size) => (
            <article className="size-card" key={size.sizeGroup}>
              <header>
                <h3>{size.sizeGroup}</h3>
                <span>{formatPct(size.share)}待处理量</span>
              </header>
              <strong>{formatInt(size.totalExtra)}件</strong>
              <p>{formatInt(size.redundantSkuCount)}个冗余SKU · 12月{formatMultiple(size.decMultiple)}</p>
              <div className="mini-track">
                <div style={{ width: `${Math.min(size.share * 100, 100)}%` }} />
              </div>
            </article>
          ))}
        </div>

        <div className="child-size-note">
          <span>童沙尺码口径已纠正</span>
          <p>童沙及其他童装使用数字/年龄尺，不套用成人XS–XXL风险系数；主要关注10–12 Years、8 Years、14–16 Years、5–6 Years和3T。</p>
        </div>
      </section>

      <section className="report-section" id="categories">
        <SectionTitle
          eyebrow="07 · Category & link actions"
          title="品类决定资源投向，链接清单决定谁来执行"
          description="品类用于横向比较风险规模；各品类Top 10链接用于落实负责人、两节点增销量和仓储费结果。"
        />
        <div className="category-cards">
          {report.categories.slice(0, 6).map((category) => (
            <article key={category.category}>
              <header>
                <span className={riskClass(category.risk)}>{category.risk}</span>
                <span>#{category.priority}</span>
              </header>
              <h3>{category.category}</h3>
              <p>主要责任人：{category.owner}</p>
              <dl>
                <div><dt>待处理量</dt><dd>{formatInt(category.totalExtra)}</dd></div>
                <div><dt>冗余SKU率</dt><dd>{formatPct(category.redundantSkuRate)}</dd></div>
                <div><dt>12月倍数</dt><dd>{formatMultiple(category.decMultiple)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <LinkTable />
      </section>

      <section className="report-section tinted-section" id="owners">
        <SectionTitle
          eyebrow="08 · Ownership"
          title="负责人目标应同时看新增销量与零预估高风险"
          description="只看总量会忽略无法用倍数表达的SKU；负责人需要把常规增销目标和零预估专项动作拆开管理。"
        />
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>负责人</th>
                <th className="numeric">SKU数</th>
                <th className="numeric">冗余SKU数</th>
                <th className="numeric">零预估高风险</th>
                <th className="numeric">10月新增</th>
                <th className="numeric">10月倍数</th>
                <th className="numeric">12月新增</th>
                <th className="numeric">12月倍数</th>
                <th className="numeric">新增合计</th>
              </tr>
            </thead>
            <tbody>
              {report.nodes.owners.slice(0, 20).map((owner) => (
                <tr key={owner.owner}>
                  <td><strong>{owner.owner}</strong></td>
                  <td className="numeric">{formatInt(owner.skuCount)}</td>
                  <td className="numeric">{formatInt(owner.redundantSkuCount)}</td>
                  <td className={`numeric ${owner.zeroForecastHighRisk > 0 ? "warning-text" : ""}`}>{formatInt(owner.zeroForecastHighRisk)}</td>
                  <td className="numeric">+{formatInt(owner.stage1Extra)}</td>
                  <td className="numeric">{formatMultiple(owner.stage1Multiple)}</td>
                  <td className="numeric">+{formatInt(owner.stage2Extra)}</td>
                  <td className="numeric">{formatMultiple(owner.stage2Multiple)}</td>
                  <td className="numeric total-cell">{formatInt(owner.totalExtra)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-section" id="sku">
        <SectionTitle
          eyebrow="09 · SKU workbench"
          title={`${formatInt(summary.redundantSku)}个待处理SKU可按组别、品类、负责人和难度筛选`}
          description="明细按风险暴露优先级排序。倍数为空代表零预估无正常去化路径，需要单独制定清货动作。"
        />
        <DetailTable />
      </section>

      <section className="report-section action-section" id="actions">
        <SectionTitle
          eyebrow="Recommended next steps"
          title="把报告转化为周度行动，而不是一次性清仓名单"
          description="优先级决定响应时限，销量承接层决定手段，两个节点决定复盘口径。"
        />
        <div className="action-grid">
          <article>
            <span className="action-step">P0</span>
            <h3>立即冻结补货并分配责任</h3>
            <p>{topGroups.slice(0, 2).map((group) => group.group).join("、")}及零预估高风险SKU先锁定负责人；10月15日前按周推进促销、调拨或移除。</p>
          </article>
          <article>
            <span className="action-step">P1</span>
            <h3>7天内确认增销渠道</h3>
            <p>把组别倍数拆到负责人和链接，区分头部承接、腰部专项和长尾退出策略。</p>
          </article>
          <article>
            <span className="action-step">P2</span>
            <h3>两周内校准补货计划</h3>
            <p>对高倍数但体量较小的组别，先下调补货，再验证销量增量是否现实。</p>
          </article>
          <article>
            <span className="action-step">复盘</span>
            <h3>节点前只看三个结果</h3>
            <p>实际增销量、FBA健康库存差额、预计仓储费；12月再加入本地剩余库存。</p>
          </article>
        </div>
      </section>

      <section className="report-section caveat-section" id="caveats">
        <SectionTitle
          eyebrow="Further questions & caveats"
          title="这是一份发布快照，业务变化需要重新刷新"
          description="以下事项可能改变结论，应在周度复盘时同步补充。"
        />
        <div className="caveat-grid">
          <article>
            <h3>仍需业务确认</h3>
            <ul>
              <li>促销、广告、价格和调拨动作能否支撑目标倍数。</li>
              <li>零预估非停售SKU是否存在漏填预估或计划外停售。</li>
              <li>本地库存的到货时间与生产批次是否改变12月可用量。</li>
            </ul>
          </article>
          <article>
            <h3>口径与限制</h3>
            <ul>
              <li>仓储费按FBA明细预计30天费用折算，10月起使用3倍费率。</li>
              <li>可回收销售额是新增毛销售额，未扣平台费、广告、折扣、退货、税费和产品成本。</li>
              <li>VINE后缀链接完全排除业务冗余、占比、费用和优先级。</li>
              <li>组别及负责人以最新SKU汇总表“0-产品信息”页为准；未分组或未分配链接需要补充主数据。</li>
            </ul>
          </article>
        </div>
      </section>

      <footer>
        <div>
          <strong>{report.meta.title}</strong>
          <p>{report.meta.snapshotNotice}</p>
        </div>
        <div className="footer-meta">
          <span>源文件更新：{generatedAt}</span>
          <span>FBA匹配率：{formatPct(report.meta.fbaMatchRate)}</span>
          <span>内部使用</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
