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

/** URL/host vs merchant id (e.g. TB-463194). */
export function buildPortalLoginBody(identifier, password) {
  const trimmed = String(identifier ?? "").trim()
  const looksLikeUrl =
    /^https?:\/\//i.test(trimmed) || /\.[a-z]{2,}/i.test(trimmed)
  if (looksLikeUrl) {
    return { merchant_url: trimmed, password }
  }
  return { merchant_id: trimmed, password }
}

export function portalLogin(credentials) {
  const body =
    credentials.merchant_id != null || credentials.merchant_url != null
      ? {
          ...(credentials.merchant_id && {
            merchant_id: credentials.merchant_id,
          }),
          ...(credentials.merchant_url && {
            merchant_url: credentials.merchant_url,
          }),
          ...(credentials.domain && { domain: credentials.domain }),
          password: credentials.password,
        }
      : credentials.domain != null
        ? buildPortalLoginBody(credentials.domain, credentials.password)
        : credentials

  return portalRequest("/api/client-portal/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
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
