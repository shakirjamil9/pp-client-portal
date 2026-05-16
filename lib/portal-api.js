const TOKEN_KEY = "tappy_client_portal_token"

export function getApiBaseUrl() {
  const u = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  return u.replace(/\/$/, "")
}

export function getStoredToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export { TOKEN_KEY }

export async function portalRequest(path, options = {}) {
  const base = getApiBaseUrl()
  const { token, ...rest } = options
  const headers = {
    "Content-Type": "application/json",
    ...rest.headers,
  }
  const t = token ?? (typeof window !== "undefined" ? getStoredToken() : null)
  if (t) {
    headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${base}${path}`, { ...rest, headers })
  let body = null
  try {
    body = await res.json()
  } catch {
    body = {}
  }
  if (!res.ok) {
    let msg = body?.message || `Request failed (${res.status})`
    if (Array.isArray(body?.errors) && body.errors.length) {
      msg = body.errors.join(", ")
    }
    throw new Error(msg)
  }
  return body
}

export function portalLogin({ domain, password }) {
  return portalRequest("/api/client-portal/auth/login", {
    method: "POST",
    body: JSON.stringify({ domain, password }),
  })
}

export function portalMe(token) {
  return portalRequest("/api/client-portal/auth/me", {
    method: "GET",
    token,
  })
}

export function portalAnalytics({ days = 30, recentLimit = 20, token } = {}) {
  const params = new URLSearchParams({
    recentLimit: String(recentLimit),
  })
  if (days === "all") {
    params.set("days", "all")
  } else {
    params.set("days", String(days ?? 30))
  }
  return portalRequest(`/api/client-portal/analytics?${params}`, {
    method: "GET",
    token,
  })
}
