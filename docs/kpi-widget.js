// kpi-widget.js
(function () {
  const e = React.createElement;

  function fmt(num, digits = 2) {
    if (!Number.isFinite(num)) return "N/A";
    return num.toLocaleString(undefined, { maximumFractionDigits: digits });
  }

  function KpiRow({ season, selectedRegion, sharePct }) {
    if (!selectedRegion) {
      return e(
        "div",
        { className: "kpiRow" },
        e("span", { className: "kpiLabel" }, "Share of Italy:"),
        e("span", { className: "kpiValue" }, "Select a region")
      );
    }

    return e(
      "div",
      { className: "kpiRow" },
      e("span", { className: "kpiLabel" }, "Share of Italy:"),
      e("span", { className: "kpiValue" }, `${fmt(sharePct)}%`),
      e("span", { className: "kpiMeta" }, `(${selectedRegion} • ${season})`)
    );
  }

  const rootEl = document.getElementById("kpiRoot");
  const root = ReactDOM.createRoot(rootEl);

  // main.js will call this
  window.renderShareKpi = function ({ season, selectedRegion, features }) {
    const values = (features || [])
      .map(f => Number(f?.properties?.value_gwh))
      .filter(Number.isFinite);

    const total = values.reduce((a, b) => a + b, 0);

    let selected = NaN;
    if (selectedRegion) {
      const f = (features || []).find(x => x?.properties?.region === selectedRegion);
      selected = Number(f?.properties?.value_gwh);
    }

    const sharePct =
      selectedRegion && Number.isFinite(selected) && total > 0
        ? (selected / total) * 100
        : NaN;

    root.render(
      e(KpiRow, {
        season,
        selectedRegion,
        sharePct
      })
    );
  };
})();
