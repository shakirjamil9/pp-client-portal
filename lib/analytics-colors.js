/** Chart colors aligned with payment rails (client portal UI). */
export const METHOD_CHART_COLORS = {
  d17: "#0284c7",
  flouci: "#7c3aed",
  card: "#ea580c",
  izi: "#059669",
  mandate: "#475569",
  unknown: "#94a3b8",
}

export function withMethodColors(methodStats) {
  return methodStats.map((m) => ({
    ...m,
    color: METHOD_CHART_COLORS[m.key] || METHOD_CHART_COLORS.unknown,
  }))
}
