/**
 * Demo analytics for client portal UI. Replace with API when backend is ready.
 * Shapes align with TransactionRequest: requestType, amount, is_* method flags.
 */

export const MOCK_USER = {
  userId: "user_demo_8472",
  clientId: "client_acme",
  displayName: "Acme Gaming",
}

export const MOCK_SUMMARY = {
  deposits: { count: 1842, totalAmount: 428_760.5 },
  withdrawals: { count: 612, totalAmount: 198_340.25 },
  periodLabel: "Last 30 days",
}

/** Per method: deposit/withdraw counts and totals (TND) */
export const MOCK_METHOD_STATS = [
  {
    key: "d17",
    label: "D17",
    shortLabel: "D17",
    deposits: { count: 620, total: 142_100 },
    withdrawals: { count: 210, total: 58_200 },
    color: "#0284c7",
  },
  {
    key: "flouci",
    label: "Flouci",
    shortLabel: "Flouci",
    deposits: { count: 412, total: 98_450.5 },
    withdrawals: { count: 156, total: 44_120 },
    color: "#7c3aed",
  },
  {
    key: "card",
    label: "Credit card",
    shortLabel: "Card",
    deposits: { count: 318, total: 86_200 },
    withdrawals: { count: 98, total: 36_800 },
    color: "#ea580c",
  },
  {
    key: "izi",
    label: "IZI",
    shortLabel: "IZI",
    deposits: { count: 288, total: 62_010 },
    withdrawals: { count: 88, total: 32_220.25 },
    color: "#059669",
  },
  {
    key: "mandate",
    label: "Mandate",
    shortLabel: "Mandate",
    deposits: { count: 204, total: 40_000 },
    withdrawals: { count: 60, total: 27_000 },
    color: "#475569",
  },
]

export const MOCK_RECENT_TRANSACTIONS = [
  {
    transactionId: "tx_9k2m7n1p",
    requestType: "deposit",
    amount: 250,
    method: "Flouci",
    createdAt: "2026-05-14T09:12:00Z",
  },
  {
    transactionId: "tx_8j3h6g5f",
    requestType: "withdrawal",
    amount: 1200,
    method: "D17",
    createdAt: "2026-05-14T08:44:00Z",
  },
  {
    transactionId: "tx_7d2c1b9a",
    requestType: "deposit",
    amount: 89.5,
    method: "Credit card",
    createdAt: "2026-05-13T22:01:00Z",
  },
  {
    transactionId: "tx_6z5y4x3w",
    requestType: "deposit",
    amount: 500,
    method: "IZI",
    createdAt: "2026-05-13T18:30:00Z",
  },
  {
    transactionId: "tx_5v4u3t2s",
    requestType: "withdrawal",
    amount: 340,
    method: "Mandate",
    createdAt: "2026-05-13T14:05:00Z",
  },
  {
    transactionId: "tx_4r3q2p1o",
    requestType: "deposit",
    amount: 75,
    method: "D17",
    createdAt: "2026-05-12T11:20:00Z",
  },
  {
    transactionId: "tx_3n2m1l0k",
    requestType: "withdrawal",
    amount: 2000,
    method: "Credit card",
    createdAt: "2026-05-12T09:00:00Z",
  },
]
