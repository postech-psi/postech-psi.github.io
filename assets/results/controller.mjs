// Generated from pinned upstream site.js. Edit tools/test-results-adapter.mjs.
export async function createController(host, PAGE, catalogInput) {
  "use strict";

  const realDocument = globalThis.document;
  const shadow = host.shadowRoot || host.attachShadow({mode: 'open'});
  shadow.innerHTML = '<link rel="stylesheet" href="' + new URL('results.css', PAGE.rootPath).href + '"><div class="results-body"></div>';
  const body = shadow.querySelector('.results-body');
  const events = new AbortController();
  const document = {
    baseURI: realDocument.baseURI, body,
    getElementById: id => shadow.getElementById(id),
    querySelector: selector => shadow.querySelector(selector),
    querySelectorAll: selector => shadow.querySelectorAll(selector),
    createElement: tag => realDocument.createElement(tag),
    addEventListener: (type, fn) => shadow.addEventListener(type, fn, {signal: events.signal}),
    removeEventListener: (type, fn) => shadow.removeEventListener(type, fn)
  };
  const echarts = globalThis.echarts, PSICharts = globalThis.PSICharts;
  let disposed = false;
  function applyOption(entry) {
    const prior = entry.instance.getOption() || {};
    const option = entry.build(entry.legendSelected);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) option.animation = false;
    if (prior.dataZoom && option.dataZoom) option.dataZoom = option.dataZoom.map((z,i) => ({...z, start:prior.dataZoom[i]?.start, end:prior.dataZoom[i]?.end}));
    if (entry.legendSelected && option.legend) option.legend.selected = entry.legendSelected;
    entry.instance.setOption(option, true);
  }
  const STORAGE_KEYS = {
    lang: "psi-site-language-mc",
    theme: "psi-site-theme-scientific"
  };

  /* ======================================================================
     i18n
     ====================================================================== */
  const UI = {
    ko: {
      nav: { overview: "요약", comparison: "비교", findings: "해석", archive: "아카이브", methods: "방법", access: "자료" },
      common: {
        latestRun: "최신 시험", publishedRuns: "공개 시험", comparisonScope: "비교 범위", allRuns: "전체 공개 시험",
        verdict: "연소 시험", directView: "절대 시간", alignedView: "점화 정렬",
        published: "공개 완료",
        pipelineDerived: "Pipeline data 기준", filteredSource: "filtered force / filtered gauge pressure",
        backToSite: "전체 결과로 돌아가기", methodology: "처리 방법", calibration: "보정",
        media: "시험 영상", files: "자료 파일", exportedFigures: "참고 그림",
        chartMethodNote: "차트는 PNG가 아니라 pipeline data 수치열에서 직접 그립니다.",
        alignmentNote: "점화 정렬은 ignition 시점을 0 s로 맞춰 시험 간 응답을 비교합니다.",
        absoluteNote: "절대 시간은 기록된 시험 시간축을 그대로 보여줍니다.",
        sourceArtifactsNote: "PNG 그림은 참고용이며, 비교 판단은 재구성 차트와 원자료를 기준으로 합니다.",
        chartHint: "드래그 줌 · 휠 확대 · 범례 클릭",
        metricsScaleNote: "항목별 최고값을 100%로 둔 정규화 비교입니다.",
        metricsRealNote: "지표별 실제 값과 단위로, 각 차트는 자체 스케일을 사용합니다.",
        metrics: "핵심 지표", thrust: "추력", pressure: "압력",
        viewOverview: "전체 조감", viewFocus: "선택 비교", viewSingle: "단일 집중",
        addRun: "+ 추가", latestN: "최신 5개", clearAll: "전체 해제", removeRun: "제거",
        allSelected: "모두 선택됨", maxReached: "최대 7개",
        latestReport: "최신 보고서", markdownRecord: "Markdown 기록", pipelineData: "Pipeline data",
        executiveReport: "Executive report", detailPage: "상세 보기",
        sortingNewest: "최신순", sortingThrust: "최대 추력순", sortingImpulse: "총 임펄스순", sortingPressure: "최대 압력순",
        loading: "자료를 불러오는 중입니다.", loadError: "자료를 불러오지 못했습니다. 파일 경로와 JSON 형식을 확인해 주세요.",
        noData: "표시할 자료가 없습니다.", date: "날짜", test: "시험",
        peakThrust: "최대 추력", totalImpulse: "총 임펄스", burnDuration: "연소 시간", peakPressure: "최대 압력",
        averageThrust: "평균 추력", actions: "링크", sourceInput: "입력 파일",
        ignitionDelay: "점화 지연", peakTime: "피크 시점", highlightRun: "강조할 시험", allRunsBackground: "전체"
      },
      home: {
        eyebrow: "Postech Aerospace Initiative", title: "연소 시험 결과 공개 기록",
        titleAccent: "공개 기록",
        lead: "",
        executiveTitle: "최신 결과", executiveLead: "",
        comparisonTitle: "시험 간 비교", comparisonLead: "",
        findingsTitle: "공개 해석", findingsLead: "",
        methodsTitle: "측정과 처리", archiveTitle: "시험 아카이브",
        archiveSubtitle: "", accessTitle: "자료 접근",
        sparkTitle: "최신 추력 곡선"
      },
      detail: {
        chartsTitle: "재구성 신호", chartsLead: "",
        methodsTitle: "시험 조건과 처리", methodsLead: "",
        artifactsLead: "",
        filesTitle: "자료 파일", filesLead: "",
        issuesTitle: "확인사항"
      },
      labels: {
        ignition: "점화", burnEnd: "연소 종료", peak: "피크",
        rawForce: "원시 추력", correctedForce: "보정 추력", filteredForce: "필터 추력",
        rawPressure: "원시 압력", filteredPressure: "필터 압력",
        timeSeconds: "시간 (s)", alignedTimeSeconds: "점화 정렬 시간 (s)", thrustUnit: "추력 (N)", pressureUnit: "압력 (bar)"
      }
    },
    en: {
      nav: { overview: "Summary", comparison: "Comparison", findings: "Findings", archive: "Archive", methods: "Methods", access: "Data" },
      common: {
        latestRun: "Latest test", publishedRuns: "Published tests", comparisonScope: "Comparison", allRuns: "All runs",
        verdict: "Static fire test", directView: "Recorded time", alignedView: "Ignition aligned",
        published: "Published",
        pipelineDerived: "Pipeline data", filteredSource: "filtered force / filtered gauge pressure",
        backToSite: "Back to results", methodology: "Processing method", calibration: "Calibration",
        media: "Test video", files: "Data files", exportedFigures: "Reference Figures",
        chartMethodNote: "Source: pipeline data. Lines are replotted from numeric series, not exported PNGs.",
        alignmentNote: "Ignition aligned mode shifts each run so ignition is 0 s.",
        absoluteNote: "Absolute time preserves the original test timeline.",
        sourceArtifactsNote: "PNG figures are secondary references; comparison uses replotted signals and source data.",
        chartHint: "Drag to zoom · scroll · click legend",
        metricsScaleNote: "Normalized comparison: best run per metric = 100%.",
        metricsRealNote: "Real values per metric — each chart uses its own scale and unit.",
        metrics: "Key metrics", thrust: "Thrust", pressure: "Pressure",
        viewOverview: "Overview", viewFocus: "Focus", viewSingle: "Single",
        addRun: "+ Add", latestN: "Latest 5", clearAll: "Clear all", removeRun: "Remove",
        allSelected: "All selected", maxReached: "Max 7",
        latestReport: "Latest report", markdownRecord: "Markdown record", pipelineData: "Pipeline data",
        executiveReport: "Executive report", detailPage: "View test",
        sortingNewest: "Newest first", sortingThrust: "Peak thrust", sortingImpulse: "Total impulse", sortingPressure: "Peak pressure",
        loading: "Loading data.", loadError: "Unable to load data. Check file paths and JSON format.",
        noData: "No data available.", date: "Date", test: "Test",
        peakThrust: "Peak Thrust", totalImpulse: "Total Impulse", burnDuration: "Burn Duration", peakPressure: "Peak Pressure",
        averageThrust: "Average Thrust", actions: "Links", sourceInput: "Input File",
        ignitionDelay: "Ignition Delay", peakTime: "Peak Time", highlightRun: "Highlight test", allRunsBackground: "All"
      },
      home: {
        eyebrow: "Postech Aerospace Initiative", title: "Static Fire Test Results", titleAccent: "Results",
        lead: "",
        executiveTitle: "Latest test", executiveLead: "",
        comparisonTitle: "Run comparison", comparisonLead: "",
        findingsTitle: "Findings", findingsLead: "",
        methodsTitle: "Methods", archiveTitle: "Archive", archiveSubtitle: "",
        accessTitle: "Data files", sparkTitle: "Latest thrust curve"
      },
      detail: {
        chartsTitle: "Signals", chartsLead: "",
        methodsTitle: "Methods", methodsLead: "",
        artifactsLead: "",
        filesTitle: "Result files", filesLead: "",
        issuesTitle: "Issues"
      },
      labels: {
        ignition: "Ignition", burnEnd: "Burn End", peak: "Peak",
        rawForce: "Raw Force", correctedForce: "Corrected Force", filteredForce: "Filtered Force",
        rawPressure: "Raw Pressure", filteredPressure: "Filtered Pressure",
        timeSeconds: "Time (s)", alignedTimeSeconds: "Ignition Aligned Time (s)", thrustUnit: "Thrust (N)", pressureUnit: "Pressure (bar)"
      }
    }
  };

  const state = {
    lang: "en",
    theme: "light",
    comparisonTab: "thrust",
    comparisonMode: "absolute",
    comparisonViewMode: "overview",
    selectedTestIds: [],
    selectedTestId: "all",
    archiveSort: "date"
  };
  const MAX_FOCUS_RUNS = 7;

  let catalog = catalogInput;
  const dataCache = new Map();
  const dataArrCache = new Map();
  const chartRegistry = new Map();

  /* ======================================================================
     Utilities
     ====================================================================== */
  function getRootBase() {
    return new URL(`${PAGE.rootPath || "."}/`, document.baseURI);
  }

  function resolvePath(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const local = path === 'tests/index.json' || path.endsWith('pipeline_data.txt');
    return new URL(path, local ? new URL('upstream/', PAGE.rootPath) : 'https://postech-psi.github.io/test-results/').href;
  }

  function copy(path) {
    return path.split(".").reduce((value, key) => value && value[key], UI[state.lang]) || "";
  }

  function optionalParagraph(text, className = "") {
    const value = String(text || "").trim();
    return value ? `<p${className ? ` class="${className}"` : ""}>${value}</p>` : "";
  }

  function localize(field) {
    if (field == null) return "";
    if (typeof field === "string" || typeof field === "number") return String(field);
    if (Array.isArray(field)) return field;
    return field[state.lang] || field.ko || field.en || "";
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function setDocumentMeta() {}

  function formatNumber(value, digits) {
    if (value == null || Number.isNaN(value)) return copy("common.noData");
    return new Intl.NumberFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function formatDelta(value, unit, digits) {
    if (value == null || Number.isNaN(value)) return copy("common.noData");
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${formatNumber(value, digits)} ${unit}`;
  }

  function setTheme(theme) {
    state.theme = theme;
    document.body.dataset.theme = theme;
    try { localStorage.setItem(STORAGE_KEYS.theme, theme); } catch (_) { /* noop */ }
  }

  function themeToggleLabel() {
    if (state.lang === "ko") return state.theme === "dark" ? "라이트" : "다크";
    return state.theme === "dark" ? "Light" : "Dark";
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.json();
  }

  async function fetchText(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.text();
  }

  function parseTSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split("\t");
    return lines.slice(1).map((line) => {
      const cells = line.split("\t");
      return headers.reduce((entry, header, index) => {
        const n = cells[index] == null || cells[index].trim() === "" ? NaN : Number(cells[index]);
        entry[header] = Number.isFinite(n) ? n : null;
        return entry;
      }, {});
    }).filter((row) => Number.isFinite(row.time_s));
  }

  function downsample(rows, maxPoints) {
    if (rows.length <= maxPoints) return rows;
    const stride = Math.ceil(rows.length / maxPoints);
    const sampled = [];
    for (let i = 0; i < rows.length; i += stride) sampled.push(rows[i]);
    if (sampled[sampled.length - 1] !== rows[rows.length - 1]) sampled.push(rows[rows.length - 1]);
    return sampled;
  }

  function getPeakForField(rows, field) {
    return rows.reduce((peak, row) => ((row[field] != null && row[field] > (peak[field] == null ? -Infinity : peak[field])) ? row : peak), rows[0]);
  }

  async function ensureSeries(test) {
    if (dataCache.has(test.id)) return dataCache.get(test.id);
    const rows = parseTSV(await fetchText(resolvePath(test.links.pipelineData)));
    const derived = {
      rows,
      peakThrust: getPeakForField(rows, "filtered_force_N"),
      peakPressure: getPeakForField(rows, "filtered_gauge_pressure")
    };
    dataCache.set(test.id, derived);
    return derived;
  }

  function metricDelta(current, previous, key) {
    if (!previous) return null;
    return current.metrics[key].value - previous.metrics[key].value;
  }

  /* ======================================================================
     Chart data builders
     ====================================================================== */
  function runData(test, field, mode) {
    const key = `${test.id}|${field}|${mode}`;
    if (dataArrCache.has(key)) return dataArrCache.get(key);
    const derived = dataCache.get(test.id);
    const ig = test.events.ignitionTimeS;
    const arr = derived.rows.map((r) => [mode === "aligned" ? r.time_s - ig : r.time_s, r[field]]);
    dataArrCache.set(key, arr);
    return arr;
  }

  function hslRunColor(index, total, theme) {
    const l = theme === "dark" ? 58 : 40;
    const s = theme === "dark" ? 68 : 62;
    const hue = Math.round((index / Math.max(total, 1)) * 330 + 15) % 360;
    return `hsl(${hue}, ${s}%, ${l}%)`;
  }

  function comparisonParams(tests, tab, mode) {
    const field = tab === "pressure" ? "filtered_gauge_pressure" : "filtered_force_N";
    const labels = copy("labels");
    const pal = PSICharts.palette(state.theme);
    const vm = state.comparisonViewMode;
    const selIds = state.selectedTestIds;
    const n = tests.length;
    const runs = tests.map((test, index) => {
      const derived = dataCache.get(test.id);
      const peakRow = tab === "pressure" ? derived.peakPressure : derived.peakThrust;
      const ig = test.events.ignitionTimeS;
      let color;
      if (vm === "overview") {
        color = n > pal.length ? hslRunColor(index, n, state.theme) : pal[index % pal.length];
      } else if (vm === "focus") {
        const idx = selIds.indexOf(test.id);
        color = idx >= 0 ? pal[idx % pal.length] : pal[index % pal.length];
      } else {
        color = pal[index % pal.length];
      }
      return {
        id: test.id,
        name: test.date,
        color,
        data: runData(test, field, mode),
        ignitionX: mode === "aligned" ? 0 : ig,
        burnEndX: mode === "aligned" ? test.events.burnEndTimeS - ig : test.events.burnEndTimeS,
        peak: { x: mode === "aligned" ? peakRow.time_s - ig : peakRow.time_s, y: peakRow[field] }
      };
    });
    return {
      theme: state.theme,
      xLabel: mode === "aligned" ? labels.alignedTimeSeconds : labels.timeSeconds,
      yLabel: tab === "pressure" ? labels.pressureUnit : labels.thrustUnit,
      xUnit: "s",
      yUnit: tab === "pressure" ? "bar" : "N",
      yDigits: tab === "pressure" ? 2 : 1,
      labels: { ignition: labels.ignition, burnEnd: labels.burnEnd, peak: labels.peak },
      runs,
      viewMode: vm,
      selectedIds: selIds,
      highlightId: state.selectedTestId || "all",
    };
  }

  function detailParams(test, tab) {
    const derived = dataCache.get(test.id);
    const labels = copy("labels");
    const pal = PSICharts.palette(state.theme);
    const mk = (field) => derived.rows.map((r) => [r.time_s, r[field]]);
    let series, yLabel, yUnit, yDigits, peak;
    if (tab === "pressure") {
      series = [
        { name: labels.rawPressure, color: pal[1], dashed: true, data: mk("raw_gauge_pressure") },
        { name: labels.filteredPressure, color: pal[0], primary: true, data: mk("filtered_gauge_pressure") }
      ];
      yLabel = labels.pressureUnit; yUnit = "bar"; yDigits = 2;
      peak = { x: derived.peakPressure.time_s, y: derived.peakPressure.filtered_gauge_pressure };
    } else {
      series = [
        { name: labels.rawForce, color: pal[1], dashed: true, data: mk("raw_force_N") },
        { name: labels.correctedForce, color: pal[2], dashed: true, data: mk("corrected_force_N") },
        { name: labels.filteredForce, color: pal[0], primary: true, data: mk("filtered_force_N") }
      ];
      yLabel = labels.thrustUnit; yUnit = "N"; yDigits = 1;
      peak = { x: derived.peakThrust.time_s, y: derived.peakThrust.filtered_force_N };
    }
    return {
      theme: state.theme, xLabel: labels.timeSeconds, yLabel, xUnit: "s", yUnit, yDigits,
      labels: { ignition: labels.ignition, burnEnd: labels.burnEnd, peak: labels.peak },
      series, ignitionX: test.events.ignitionTimeS, burnEndX: test.events.burnEndTimeS, peak
    };
  }

  const METRIC_DEFS = [
    { id: "thrust", key: "maxThrustN", unit: "N", digits: 2 },
    { id: "impulse", key: "totalImpulseNs", unit: "N·s", digits: 2 },
    { id: "burn", key: "burnTimeMs", unit: "ms", digits: 1 },
    { id: "pressure", key: "maxPressureBar", unit: "bar", digits: 3 }
  ];

  function metricLabel(id) {
    return {
      thrust: copy("common.peakThrust"),
      impulse: copy("common.totalImpulse"),
      burn: copy("common.burnDuration"),
      pressure: copy("common.peakPressure")
    }[id];
  }

  /* Per-metric chart data, mode-aware. Returns one params object per metric.
     overview: all runs · focus: selected subset · single: only the one run */
  function metricChartsParams(allTests) {
    const pal = PSICharts.palette(state.theme);
    const vm = state.comparisonViewMode;
    const selIds = state.selectedTestIds;
    const singleId = state.selectedTestId;
    let tests;
    if (vm === "focus") {
      tests = allTests.filter((t) => selIds.indexOf(t.id) !== -1);
    } else if (vm === "single") {
      const one = allTests.find((t) => t.id === singleId);
      tests = one ? [one] : allTests.slice(0, 1);
    } else {
      tests = allTests;
    }
    const n = tests.length;
    const allN = allTests.length;
    // overview color of a run = its color when all runs are shown (by full-list index)
    const overviewColor = (test) => {
      const idxAll = allTests.indexOf(test);
      return allN > pal.length ? hslRunColor(idxAll, allN, state.theme) : pal[idxAll % pal.length];
    };
    const colorOf = (test, index) => {
      if (vm === "overview") return n > pal.length ? hslRunColor(index, n, state.theme) : pal[index % pal.length];
      if (vm === "focus") { const i = selIds.indexOf(test.id); return i >= 0 ? pal[i % pal.length] : pal[index % pal.length]; }
      return overviewColor(test); // single: keep the run's overview color
    };
    return METRIC_DEFS.map((m) => ({
      theme: state.theme,
      title: metricLabel(m.id),
      unit: m.unit,
      yDigits: m.digits,
      names: tests.map((t) => t.date),
      colors: tests.map((t, i) => colorOf(t, i)),
      values: tests.map((t) => t.metrics[m.key].value),
      displays: tests.map((t) => t.metrics[m.key].display),
      dim: tests.map(() => false)
    }));
  }

  /* Single test (detail page): one bar per metric, real values. */
  function detailMetricChartsParams(test) {
    const pal = PSICharts.palette(state.theme);
    return METRIC_DEFS.map((m) => ({
      theme: state.theme,
      title: metricLabel(m.id),
      unit: m.unit,
      yDigits: m.digits,
      names: [test.date],
      colors: [pal[0]],
      values: [test.metrics[m.key].value],
      displays: [test.metrics[m.key].display],
      dim: [false]
    }));
  }

  /* ======================================================================
     Chart instance registry
     ====================================================================== */
  function ensureChart(id, builder) {
    const el = document.getElementById(id);
    if (!el || typeof echarts === "undefined") return null;
    let entry = chartRegistry.get(id);
    if (!entry) {
      entry = { instance: echarts.init(el, null, { renderer: "canvas" }), build: builder, legendSelected: null };
      entry.instance.on("legendselectchanged", (event) => {
        entry.legendSelected = event.selected || null;
        applyOption(entry);
        if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
      });
      chartRegistry.set(id, entry);
    } else {
      entry.build = builder;
    }
    entry.instance.resize();
    applyOption(entry);
    if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
    return entry;
  }

  function refreshAllCharts() {
    chartRegistry.forEach((entry) => {
      entry.instance.resize();
      applyOption(entry);
      if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
    });
  }

  function disposeAllCharts() {
    chartRegistry.forEach((entry) => entry.instance.dispose());
    chartRegistry.clear();
  }

  /* Which runs' event/peak tags to render.
     - detail: the single signal's events (static)
     - single: the selected run (static)
     - overview / focus: only the hovered run (hover-driven; none at rest) */
  function overlayRunsFor(params, hoverRunName, isDetail) {
    if (isDetail) {
      return [{
        ignitionX: params.ignitionX, burnEndX: params.burnEndX, peak: params.peak,
        color: PSICharts.tokens(state.theme).lineStrong
      }];
    }
    const viewMode = params.viewMode || "single";
    if (viewMode === "single") {
      if (!params.highlightId || params.highlightId === "all") return params.runs.slice(0, 1);
      return params.runs.filter((run) => run.id === params.highlightId);
    }
    if (!hoverRunName) return [];
    let pool = params.runs;
    if (viewMode === "focus") pool = params.runs.filter((run) => params.selectedIds.indexOf(run.id) !== -1);
    return pool.filter((run) => run.name === hoverRunName);
  }

  function clearEventAxisOverlay(id) {
    const el = document.getElementById(id);
    const shell = el && el.closest(".chart-shell");
    if (!shell) return;
    const overlay = shell.querySelector(".chart-event-overlay");
    if (overlay) overlay.remove();
  }

  function renderEventAxisOverlay(id, entry, params, options) {
    const opts = options || {};
    const chart = entry && entry.instance;
    const el = chart && chart.getDom ? chart.getDom() : document.getElementById(id);
    const shell = el && el.closest(".chart-shell");
    if (!shell || !chart) return;

    const draw = () => {
      clearEventAxisOverlay(id);
      const runs = overlayRunsFor(params, entry.hoverRunName, opts.isDetail);
      if (!runs.length) return;

      const overlay = document.createElement("div");
      overlay.className = "chart-event-overlay";
      shell.appendChild(overlay);

      const width = chart.getWidth();
      const height = chart.getHeight();
      const nodes = [];

      const addAxisTag = (x, text, color, rowIndex) => {
        let px;
        try { px = chart.convertToPixel({ xAxisIndex: 0 }, x); } catch (_) { px = null; }
        if (!Number.isFinite(px)) return;
        const node = document.createElement("span");
        node.className = "chart-event-tag";
        node.textContent = text;
        node.style.setProperty("--event-color", color);
        node.style.top = `${Math.max(42, height - 70 - rowIndex * 20)}px`;
        node.style.left = `${Math.min(Math.max(px, 8), width - 8)}px`;
        overlay.appendChild(node);
        nodes.push({ node, x: px });
      };

      const addPeakTag = (peak, color) => {
        if (!peak || peak.x == null || peak.y == null) return;
        let pt;
        try { pt = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [peak.x, peak.y]); } catch (_) { pt = null; }
        if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return;
        const node = document.createElement("span");
        node.className = "chart-event-tag chart-peak-tag";
        node.textContent = `${params.labels.peak} ${PSICharts.fmt(peak.y, params.yDigits)} ${params.yUnit} @ ${PSICharts.fmt(peak.x, 2)} ${params.xUnit}`;
        node.style.setProperty("--event-color", color);
        node.style.top = `${Math.max(18, pt[1] - 8)}px`;
        node.style.left = `${Math.min(Math.max(pt[0], 8), width - 8)}px`;
        overlay.appendChild(node);
        nodes.push({ node, x: pt[0] });
      };

      runs.forEach((run, rowIndex) => {
        if (run.ignitionX != null) addAxisTag(run.ignitionX, `${params.labels.ignition} ${PSICharts.fmt(run.ignitionX, 2)} ${params.xUnit}`, run.color, rowIndex);
        if (run.burnEndX != null) addAxisTag(run.burnEndX, `${params.labels.burnEnd} ${PSICharts.fmt(run.burnEndX, 2)} ${params.xUnit}`, run.color, rowIndex);
        addPeakTag(run.peak, run.color);
      });

      window.requestAnimationFrame(() => {
        nodes.forEach(({ node, x }) => {
          const half = node.offsetWidth / 2;
          const clamped = Math.min(Math.max(x, half + 6), width - half - 6);
          node.style.left = `${clamped}px`;
        });
      });
    };

    entry.hoverRunName = null;
    entry.syncEventAxisOverlay = draw;
    if (!entry.eventAxisOverlayBound) {
      const syncLatestOverlay = () => {
        if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
      };
      entry.instance.on("datazoom", syncLatestOverlay);
      entry.instance.on("finished", syncLatestOverlay);
      entry.instance.on("mouseover", (p) => {
        if (p && p.seriesName && entry.hoverRunName !== p.seriesName) {
          entry.hoverRunName = p.seriesName;
          if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
        }
      });
      entry.instance.on("globalout", () => {
        if (entry.hoverRunName != null) {
          entry.hoverRunName = null;
          if (entry.syncEventAxisOverlay) entry.syncEventAxisOverlay();
        }
      });
      entry.eventAxisOverlayBound = true;
    }
    draw();
  }

  function updateComparison() {
    const tab = state.comparisonTab;
    if (tab === "metrics") {
      clearEventAxisOverlay("cmp-canvas-thrust");
      clearEventAxisOverlay("cmp-canvas-pressure");
      const charts = metricChartsParams(catalog.tests);
      METRIC_DEFS.forEach((m, i) => {
        ensureChart(`cmp-canvas-metric-${m.id}`, () => PSICharts.metricBarOption(charts[i]));
      });
    } else {
      let currentParams = null;
      const entry = ensureChart(`cmp-canvas-${tab}`, (legendSelected) => {
        const params = comparisonParams(catalog.tests, tab, state.comparisonMode);
        params.legendSelected = legendSelected;
        currentParams = params;
        return PSICharts.comparisonOption(params);
      });
      if (entry && currentParams) renderEventAxisOverlay(`cmp-canvas-${tab}`, entry, currentParams);
    }
  }

  function updateDetailChart(test) {
    const tab = state.comparisonTab;
    if (tab === "metrics") {
      clearEventAxisOverlay("dt-canvas-thrust");
      clearEventAxisOverlay("dt-canvas-pressure");
      const charts = detailMetricChartsParams(test);
      METRIC_DEFS.forEach((m, i) => {
        ensureChart(`dt-canvas-metric-${m.id}`, () => PSICharts.metricBarOption(charts[i]));
      });
    } else {
      const params = detailParams(test, tab);
      const entry = ensureChart(`dt-canvas-${tab}`, () => PSICharts.detailOption(params));
      if (entry) {
        renderEventAxisOverlay(`dt-canvas-${tab}`, entry, params, { isDetail: true });
      }
    }
  }

  /* ======================================================================
     Components
     ====================================================================== */
  function logoImage(path, imageClassName, alt, surfaceClassName) {
    return `<span class="logo-surface ${surfaceClassName}"><img class="${imageClassName}" src="${resolvePath(path)}" alt="${escapeHtml(alt)}"></span>`;
  }

  function buildOverviewCards(tests) {
    const latest = tests[0];
    const previous = tests[1];
    const cards = [
      { label: copy("common.peakThrust"), key: "maxThrustN", digits: 2, unit: "N" },
      { label: copy("common.totalImpulse"), key: "totalImpulseNs", digits: 2, unit: "N s" },
      { label: copy("common.burnDuration"), key: "burnTimeMs", digits: 1, unit: "ms" },
      { label: copy("common.peakPressure"), key: "maxPressureBar", digits: 3, unit: "bar" }
    ];
    return cards.map((card) => {
      const metric = latest.metrics[card.key];
      const delta = metricDelta(latest, previous, card.key);
      const trendClass = delta == null ? "" : delta >= 0 ? "positive" : "negative";
      const deltaText = delta == null ? "" : `${delta >= 0 ? "▲" : "▼"} ${formatDelta(delta, card.unit, card.digits)} vs ${previous.date}`;
      return `
        <article class="metric-card">
          <div class="metric-card__label">${card.label}</div>
          <div class="metric-card__value">${metric.display}</div>
          ${deltaText ? `<div class="metric-card__delta ${trendClass}">${deltaText}</div>` : ""}
        </article>`;
    }).join("");
  }

  function chartPanelTabs(prefix, tabs) {
    return `
      <div class="tablist" role="tablist" aria-label="${state.lang === "ko" ? "차트 선택" : "Chart selection"}">
        ${tabs.map((tab) => `<button type="button" id="${prefix}-tab-${tab}" role="tab" data-chart-tab="${tab}" aria-selected="${state.comparisonTab === tab}" aria-controls="${prefix}-panel-${tab}" tabindex="${state.comparisonTab === tab ? "0" : "-1"}">${copy(`common.${tab}`)}</button>`).join("")}
      </div>`;
  }

  function srTable(tests, tab) {
    const field = tab === "pressure" ? "maxPressureBar" : "maxThrustN";
    return `<table class="sr-table"><caption>${copy(`common.${tab}`)} ${copy("common.peakThrust")}</caption>
      <thead><tr><th>${copy("common.date")}</th><th>${copy("common.peakThrust")}/${copy("common.peakPressure")}</th></tr></thead>
      <tbody>${tests.map((t) => `<tr><td>${t.date}</td><td>${t.metrics[field].display}</td></tr>`).join("")}</tbody></table>`;
  }

  function buildRunPickerHTML(tests) {
    const pal = PSICharts.palette(state.theme);
    const sel = state.selectedTestIds;
    const reachedMax = sel.length >= MAX_FOCUS_RUNS;
    const chips = sel.map((id, idx) => {
      const test = tests.find((t) => t.id === id);
      if (!test) return "";
      const color = pal[idx % pal.length];
      return `<div class="run-chip">
        <span class="run-chip__dot" style="background:${color}"></span>
        <span class="run-chip__label">${test.date}</span>
        <button class="run-chip__remove" data-remove-run="${escapeHtml(id)}" type="button" aria-label="${copy("common.removeRun")}" title="${copy("common.removeRun")}">×</button>
      </div>`;
    }).join("");
    const unselected = tests.filter((t) => sel.indexOf(t.id) === -1);
    const items = unselected.map((test) => `<button class="run-picker__item" data-add-run="${escapeHtml(test.id)}" type="button">${escapeHtml(test.date)} · ${escapeHtml(localize(test.title))}</button>`).join("");
    return `<div class="run-picker" id="run-picker">
      <div class="run-picker__chips" id="run-picker-chips">${chips || `<span class="run-picker__empty-hint">${copy("common.clearAll") ? "" : ""}</span>`}</div>
      <div class="run-picker__footer">
        <button class="run-picker__add-btn" id="run-picker-add-btn" type="button" ${reachedMax ? `disabled aria-disabled="true" title="${copy("common.maxReached")}"` : ""}>${copy("common.addRun")} ▾</button>
        <button class="run-picker__reset-btn" data-reset-runs type="button">${copy("common.latestN")}</button>
        <button class="run-picker__clear-btn" data-clear-runs type="button">${copy("common.clearAll")}</button>
        ${reachedMax ? `<span class="run-picker__max-note">${copy("common.maxReached")}</span>` : ""}
      </div>
      <div class="run-picker__dropdown" id="run-picker-dropdown" hidden>
        ${items || `<div class="run-picker__empty">${copy("common.allSelected")}</div>`}
      </div>
    </div>`;
  }

  function buildSingleSelectHTML(tests) {
    const selId = (state.selectedTestId && state.selectedTestId !== "all") ? state.selectedTestId : (tests[0] && tests[0].id);
    return `<div class="single-run-row">
      <label class="visually-hidden" for="single-run-select">${state.lang === "ko" ? "시험 선택" : "Select test"}</label>
      <select class="select-input" id="single-run-select">
        ${tests.map((t) => `<option value="${escapeHtml(t.id)}" ${selId === t.id ? "selected" : ""}>${escapeHtml(t.date)} · ${escapeHtml(localize(t.title))}</option>`).join("")}
      </select>
    </div>`;
  }

  function metricsGridHTML(prefix) {
    return `<div class="metrics-grid">
      ${METRIC_DEFS.map((m) => `
        <div class="metric-chart-card">
          <div class="metric-chart-card__title">${metricLabel(m.id)} <span class="metric-chart-card__unit">${m.unit}</span></div>
          <div class="chart-canvas metric-chart-canvas" id="${prefix}-canvas-metric-${m.id}"></div>
        </div>`).join("")}
    </div>`;
  }

  function buildComparisonPanel(tests) {
    const tabs = ["thrust", "pressure", "metrics"];
    const vm = state.comparisonViewMode;
    return `
      <section class="section" id="comparison">
        <div class="section-heading">
          <h2>${copy("home.comparisonTitle")}</h2>
          ${optionalParagraph(copy("home.comparisonLead"))}
        </div>
        <div class="panel comparison-layout">
          <div class="toolbar">
            ${chartPanelTabs("cmp", tabs)}
            <div class="toolbar__group">
              <div class="mode-toggle" aria-label="${state.lang === "ko" ? "시간축 선택" : "Time mode"}">
                <button type="button" data-comparison-mode="absolute" aria-pressed="${state.comparisonMode === "absolute"}">${copy("common.directView")}</button>
                <button type="button" data-comparison-mode="aligned" aria-pressed="${state.comparisonMode === "aligned"}">${copy("common.alignedView")}</button>
              </div>
              <div class="view-mode-toggle" aria-label="${state.lang === "ko" ? "보기 모드" : "View mode"}">
                <button type="button" data-view-mode="overview" aria-pressed="${vm === "overview"}">${copy("common.viewOverview")}</button>
                <button type="button" data-view-mode="focus" aria-pressed="${vm === "focus"}">${copy("common.viewFocus")}</button>
                <button type="button" data-view-mode="single" aria-pressed="${vm === "single"}">${copy("common.viewSingle")}</button>
              </div>
            </div>
          </div>
          <div id="cmp-run-picker-row" ${vm !== "focus" ? "hidden" : ""}>${buildRunPickerHTML(tests)}</div>
          <div id="cmp-single-row" ${vm !== "single" ? "hidden" : ""}>${buildSingleSelectHTML(tests)}</div>
          ${tabs.map((tab) => {
            if (tab === "metrics") {
              return `
            <div class="tabpanel" id="cmp-panel-metrics" role="tabpanel" aria-labelledby="cmp-tab-metrics" ${state.comparisonTab === "metrics" ? "" : "hidden"}>
              <div class="chart-header">
                <div class="chart-header__title">${copy("common.metrics")}</div>
                <div class="chart-header__note">${copy("common.metricsRealNote")}</div>
              </div>
              ${metricsGridHTML("cmp")}
              <div class="chart-source">${copy("common.chartMethodNote")}</div>
            </div>`;
            }
            return `
            <div class="tabpanel" id="cmp-panel-${tab}" role="tabpanel" aria-labelledby="cmp-tab-${tab}" ${state.comparisonTab === tab ? "" : "hidden"}>
              <div class="chart-header">
                <div class="chart-header__title">${copy(`common.${tab}`)}</div>
                <div class="chart-header__note">${state.comparisonMode === "aligned" ? copy("common.alignmentNote") : copy("common.absoluteNote")}</div>
              </div>
              <div class="chart-shell">
                <div class="hint-chip">${copy("common.chartHint")}</div>
                <div class="chart-canvas" id="cmp-canvas-${tab}"></div>
              </div>
              ${srTable(tests, tab)}
              <div class="chart-source">${copy("common.chartMethodNote")}</div>
            </div>`;
          }).join("")}
        </div>
      </section>`;
  }

  function buildFindings(tests) {
    const latest = tests[0];
    const previous = tests[1];
    return `
      <section class="section" id="findings">
        <div class="section-heading">
          <h2>${copy("home.findingsTitle")}</h2>
          ${optionalParagraph(copy("home.findingsLead"))}
        </div>
        <div class="publication-layout">
          <article class="mini-panel">
            <h3>${localize(latest.title)}</h3>
            <ul>
              ${localize(latest.highlights).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
          <article class="mini-panel">
            <h3>${previous ? (state.lang === "ko" ? "직전 시험 대비" : "Compared with Previous Run") : copy("common.metrics")}</h3>
            <ul>
              <li>${copy("common.peakThrust")}: ${previous ? formatDelta(metricDelta(latest, previous, "maxThrustN"), "N", 2) : copy("common.noData")}</li>
              <li>${copy("common.totalImpulse")}: ${previous ? formatDelta(metricDelta(latest, previous, "totalImpulseNs"), "N s", 2) : copy("common.noData")}</li>
              <li>${copy("common.burnDuration")}: ${previous ? formatDelta(metricDelta(latest, previous, "burnTimeMs"), "ms", 1) : copy("common.noData")}</li>
              <li>${copy("common.sourceArtifactsNote")}</li>
            </ul>
          </article>
        </div>
      </section>`;
  }

  function sortedTests(tests) {
    return [...tests].sort((a, b) => {
      if (state.archiveSort === "thrust") return b.metrics.maxThrustN.value - a.metrics.maxThrustN.value;
      if (state.archiveSort === "impulse") return b.metrics.totalImpulseNs.value - a.metrics.totalImpulseNs.value;
      if (state.archiveSort === "pressure") return b.metrics.maxPressureBar.value - a.metrics.maxPressureBar.value;
      return b.date.localeCompare(a.date);
    });
  }

  function buildArchive(tests) {
    return `
      <section class="section" id="archive">
        <div class="section-heading">
          <h2>${copy("home.archiveTitle")}</h2>
          ${optionalParagraph(copy("home.archiveSubtitle"))}
        </div>
        <div class="archive-tools">
          <div class="muted">${tests.length} ${copy("common.publishedRuns")}</div>
          <label class="visually-hidden" for="archive-sort">${state.lang === "ko" ? "정렬" : "Sort"}</label>
          <select class="select-input" id="archive-sort">
            <option value="date" ${state.archiveSort === "date" ? "selected" : ""}>${copy("common.sortingNewest")}</option>
            <option value="thrust" ${state.archiveSort === "thrust" ? "selected" : ""}>${copy("common.sortingThrust")}</option>
            <option value="impulse" ${state.archiveSort === "impulse" ? "selected" : ""}>${copy("common.sortingImpulse")}</option>
            <option value="pressure" ${state.archiveSort === "pressure" ? "selected" : ""}>${copy("common.sortingPressure")}</option>
          </select>
        </div>
        <div class="archive-table">
          <table>
            <thead>
              <tr>
                <th>${copy("common.date")}</th><th>${copy("common.test")}</th>
                <th>${copy("common.peakThrust")}</th><th>${copy("common.totalImpulse")}</th>
                <th>${copy("common.peakPressure")}</th><th>${copy("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${sortedTests(tests).map((test) => `
                <tr>
                  <td>${test.date}</td>
                  <td><strong>${localize(test.title)}</strong><div class="muted">${localize(test.summary)}</div></td>
                  <td>${test.metrics.maxThrustN.display}</td>
                  <td>${test.metrics.totalImpulseNs.display}</td>
                  <td>${test.metrics.maxPressureBar.display}</td>
                  <td><a class="archive-action" href="${resolvePath(test.links.page)}">${copy("common.detailPage")}</a></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  function buildMethods(tests) {
    const latest = tests[0];
    return `
      <section class="section" id="methods">
        <div class="section-heading">
          <h2>${copy("home.methodsTitle")}</h2>
        </div>
        <div class="finding-grid">
          <article class="mini-panel">
            <h3>${copy("common.methodology")}</h3>
            <ul>${latest.processing.slice(0, 5).map((item) => `<li><strong>${localize(item.label)}:</strong> ${localize(item.value)}</li>`).join("")}</ul>
          </article>
          <article class="mini-panel">
            <h3>${copy("common.pipelineDerived")}</h3>
            <ul>
              <li>${copy("common.filteredSource")}</li>
              <li>${copy("common.sourceArtifactsNote")}</li>
              <li>${state.lang === "ko" ? "각 상세 페이지에서 보정 값과 입력 파일을 함께 확인할 수 있습니다." : "Each detail page includes calibration values and source input references."}</li>
            </ul>
          </article>
        </div>
      </section>`;
  }

  function renderHeader() {
    return `
      <header class="site-header">
        <div class="site-header__inner">
          <div class="brand">
            <a class="brand__home-link" href="${resolvePath("index.html")}" aria-label="${state.lang === "ko" ? "홈으로" : "Home"}">
              ${logoImage("assets/logos/psi-logo-banner.jpeg", "brand__banner", "PSI Postech Aerospace Initiative", "brand__logo-surface")}
            </a>
            <div class="brand__text">
              <div class="brand__eyebrow">${copy("home.eyebrow")}</div>
              <div class="brand__title">${localize(catalog.site.name)}</div>
            </div>
          </div>
          <div class="site-header__controls">
            <div class="pill-toggle" aria-label="${state.lang === "ko" ? "언어 선택" : "Language"}">
              <button type="button" data-language="ko" aria-pressed="${state.lang === "ko"}">KO</button>
              <button type="button" data-language="en" aria-pressed="${state.lang === "en"}">EN</button>
            </div>
            <button type="button" class="icon-button" id="theme-toggle" aria-label="${themeToggleLabel()}">${themeToggleLabel()}</button>
          </div>
        </div>
      </header>`;
  }

  function renderHome() {
    document.body.innerHTML = buildComparisonPanel(catalog.tests);
    bindCommonControls(); bindHomeControls(); updateComparison();
  }

  function initHomeCharts() {
    const latest = catalog.tests[0];
    const derived = dataCache.get(latest.id);
    if (derived) {
      const spark = downsample(derived.rows, 160).map((r) => [r.time_s, r.filtered_force_N]);
      ensureChart("hero-spark", () => PSICharts.sparkOption({ theme: state.theme, data: spark }));
    }
    updateComparison();
  }

  function renderDetailTables(rows) {
    return `<table class="detail-table"><tbody>${rows.map((item) => `<tr><th>${localize(item.label)}</th><td>${localize(item.value)}</td></tr>`).join("")}</tbody></table>`;
  }

  function renderDetail(test) {
    if (!test) { renderError(); return; }
    const tabs = ["thrust", "pressure", "metrics"];
    document.body.innerHTML = `<div class="site-shell">
          <div class="panel comparison-layout">
            <div class="toolbar">${chartPanelTabs("dt", tabs)}</div>
            ${tabs.map((tab) => {
              if (tab === "metrics") {
                return `
              <div class="tabpanel" id="dt-panel-metrics" role="tabpanel" aria-labelledby="dt-tab-metrics" ${state.comparisonTab === "metrics" ? "" : "hidden"}>
                <div class="chart-header">
                  <div class="chart-header__title">${copy("common.metrics")}</div>
                </div>
                ${metricsGridHTML("dt")}
              </div>`;
              }
              return `
              <div class="tabpanel" id="dt-panel-${tab}" role="tabpanel" aria-labelledby="dt-tab-${tab}" ${state.comparisonTab === tab ? "" : "hidden"}>
                <div class="chart-header">
                  <div class="chart-header__title">${copy(`common.${tab}`)}</div>
                  <div class="chart-header__note">${copy("common.chartHint")}</div>
                </div>
                <div class="chart-shell">
                  <div class="chart-canvas" id="dt-canvas-${tab}"></div>
                </div>
              </div>`;
            }).join("")}
          </div>
    </div>`;
    bindCommonControls(); bindDetailControls(test); updateDetailChart(test);
  }

  function bindTablistKeyboard() {
    document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (event) => {
          let nextIndex = null;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = tabs.length - 1;
          if (nextIndex == null) return;
          event.preventDefault();
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        });
      });
    });
  }

  function switchChartTab(prefix, tab) {
    state.comparisonTab = tab;
    document.querySelectorAll(`[id^="${prefix}-tab-"]`).forEach((btn) => {
      const isActive = btn.dataset.chartTab === tab;
      btn.setAttribute("aria-selected", String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
    document.querySelectorAll(`[id^="${prefix}-panel-"]`).forEach((panel) => {
      panel.hidden = panel.id !== `${prefix}-panel-${tab}`;
    });
  }

  function bindCommonControls() { bindTablistKeyboard(); }

  function refreshRunPickerRow(tests) {
    const row = document.getElementById("cmp-run-picker-row");
    if (row) row.innerHTML = buildRunPickerHTML(tests);
    bindRunPickerControls(tests);
  }

  function bindRunPickerControls(tests) {
    const addBtn = document.getElementById("run-picker-add-btn");
    const dropdown = document.getElementById("run-picker-dropdown");

    if (addBtn && dropdown) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.hidden = !dropdown.hidden;
      });
      document.addEventListener("click", function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== addBtn) {
          dropdown.hidden = true;
          document.removeEventListener("click", closeDropdown);
        }
      });
      dropdown.querySelectorAll("[data-add-run]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.addRun;
          if (state.selectedTestIds.indexOf(id) === -1 && state.selectedTestIds.length < MAX_FOCUS_RUNS) {
            state.selectedTestIds = [...state.selectedTestIds, id];
          }
          dropdown.hidden = true;
          refreshRunPickerRow(tests);
          updateComparison();
        });
      });
    }
    document.querySelectorAll("[data-remove-run]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedTestIds = state.selectedTestIds.filter((id) => id !== btn.dataset.removeRun);
        refreshRunPickerRow(tests);
        updateComparison();
      });
    });
    const resetBtn = document.querySelector("[data-reset-runs]");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.selectedTestIds = tests.slice(0, MAX_FOCUS_RUNS).map((t) => t.id);
        refreshRunPickerRow(tests);
        updateComparison();
      });
    }
    const clearBtn = document.querySelector("[data-clear-runs]");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.selectedTestIds = [];
        refreshRunPickerRow(tests);
        updateComparison();
      });
    }
  }

  function bindHomeControls() {
    document.querySelectorAll("[data-chart-tab]").forEach((button) => {
      button.addEventListener("click", () => { switchChartTab("cmp", button.dataset.chartTab); updateComparison(); });
    });
    document.querySelectorAll("[data-comparison-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.comparisonMode = button.dataset.comparisonMode;
        document.querySelectorAll("[data-comparison-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.comparisonMode === state.comparisonMode)));
        const note = document.querySelector(`#cmp-panel-${state.comparisonTab} .chart-header__note`);
        if (note) note.textContent = state.comparisonTab === "metrics" ? copy("common.metricsScaleNote") : (state.comparisonMode === "aligned" ? copy("common.alignmentNote") : copy("common.absoluteNote"));
        updateComparison();
      });
    });
    document.querySelectorAll("[data-view-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.comparisonViewMode = button.dataset.viewMode;
        document.querySelectorAll("[data-view-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.viewMode === state.comparisonViewMode)));
        const pickerRow = document.getElementById("cmp-run-picker-row");
        const singleRow = document.getElementById("cmp-single-row");
        if (pickerRow) pickerRow.hidden = state.comparisonViewMode !== "focus";
        if (singleRow) singleRow.hidden = state.comparisonViewMode !== "single";
        updateComparison();
      });
    });
    const singleSelect = document.getElementById("single-run-select");
    if (singleSelect) {
      singleSelect.addEventListener("change", () => {
        state.selectedTestId = singleSelect.value;
        updateComparison();
      });
    }
    bindRunPickerControls(catalog.tests);
    const sortInput = document.getElementById("archive-sort");
    if (sortInput) {
      sortInput.addEventListener("change", (event) => {
        state.archiveSort = event.target.value;
        const tbody = document.querySelector(".archive-table tbody");
        if (tbody) {
          tbody.innerHTML = sortedTests(catalog.tests).map((test) => `
            <tr>
              <td>${test.date}</td>
              <td><strong>${localize(test.title)}</strong><div class="muted">${localize(test.summary)}</div></td>
              <td>${test.metrics.maxThrustN.display}</td>
              <td>${test.metrics.totalImpulseNs.display}</td>
              <td>${test.metrics.maxPressureBar.display}</td>
              <td><a class="archive-action" href="${resolvePath(test.links.page)}">${copy("common.detailPage")}</a></td>
            </tr>`).join("");
        }
      });
    }
  }

  function bindDetailControls(test) {
    document.querySelectorAll("[data-chart-tab]").forEach((button) => {
      button.addEventListener("click", () => { switchChartTab("dt", button.dataset.chartTab); updateDetailChart(test); });
    });
  }

  function renderError() { throw new Error(copy('common.loadError')); }

  function rerender() {
    document.body.dataset.theme = state.theme;
    if (PAGE.page === "detail") {
      renderDetail(catalog.tests.find((item) => item.id === PAGE.testId));
      return;
    }
    renderHome();
  }

  async function preloadData() {
    if (PAGE.page === "detail") {
      const test = catalog.tests.find((item) => item.id === PAGE.testId);
      if (test) await ensureSeries(test);
      return;
    }
    await Promise.all(catalog.tests.map((test) => ensureSeries(test)));
  }

  state.lang = realDocument.documentElement.lang === 'ko' ? 'ko' : 'en';
  state.theme = realDocument.documentElement.dataset.theme || 'light';
  host.dataset.theme = state.theme;
  await new Promise((resolve, reject) => { const sheet = shadow.querySelector('link'); if (sheet.sheet) resolve(); else {sheet.onload = resolve; sheet.onerror = reject;} });
  await Promise.all(catalog.tests.map(test => ensureSeries(test)));
  state.selectedTestIds = catalog.tests.map(test => test.id);
  state.selectedTestId = catalog.tests[0].id;
  rerender();
  const resize = () => { if (disposed) return; chartRegistry.forEach(entry => {entry.instance.resize(); entry.syncEventAxisOverlay?.();}); };
  const observer = new ResizeObserver(resize); observer.observe(host);
  const themeObserver = new MutationObserver(() => {
    state.theme = realDocument.documentElement.dataset.theme || 'light';
    host.dataset.theme = state.theme;
    if (PAGE.page === 'detail') updateDetailChart(catalog.tests.find(test => test.id === PAGE.testId));
    else updateComparison();
  });
  themeObserver.observe(realDocument.documentElement, {attributes:true, attributeFilter:['data-theme']});
  await new Promise(resolve => requestAnimationFrame(resolve)); resize();
  return {
    select(testId) { PAGE.testId = testId; disposeAllCharts(); state.comparisonTab = 'thrust'; rerender(); resize(); },
    dispose() { disposed = true; observer.disconnect(); themeObserver.disconnect(); events.abort(); disposeAllCharts(); shadow.replaceChildren(); }
  };
}
