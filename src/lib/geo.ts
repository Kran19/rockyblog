// Country Code (ISO 3166-1 alpha-2) to Full Country Name
export const ISO_TO_COUNTRY: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  AE: "United Arab Emirates",
  PK: "Pakistan",
  BD: "Bangladesh",
  NP: "Nepal",
  LK: "Sri Lanka",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand",
  SA: "Saudi Arabia",
  QA: "Qatar",
  KW: "Kuwait",
  BH: "Bahrain",
  OM: "Oman",
  SG: "Singapore",
  MY: "Malaysia",
  TH: "Thailand",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  CH: "Switzerland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  PL: "Poland",
  RU: "Russia",
  UA: "Ukraine",
  TR: "Turkey",
  EG: "Egypt",
  ZA: "South Africa",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  BR: "Brazil",
  AR: "Argentina",
  MX: "Mexico",
  CO: "Colombia",
  CL: "Chile",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  HK: "Hong Kong",
  TW: "Taiwan",
  IL: "Israel",
  PT: "Portugal",
  BE: "Belgium",
  AT: "Austria",
  GR: "Greece",
  CZ: "Czech Republic",
  RO: "Romania",
  HU: "Hungary",
}

// IANA Timezone to Full Country Name
export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  // India
  "Asia/Kolkata": "India",
  "Asia/Calcutta": "India",
  "IST": "India",

  // South Asia
  "Asia/Karachi": "Pakistan",
  "Asia/Dhaka": "Bangladesh",
  "Asia/Kathmandu": "Nepal",
  "Asia/Colombo": "Sri Lanka",
  "Asia/Thimphu": "Bhutan",
  "Asia/Kabul": "Afghanistan",
  "Indian/Maldives": "Maldives",

  // Middle East
  "Asia/Dubai": "United Arab Emirates",
  "Asia/Riyadh": "Saudi Arabia",
  "Asia/Qatar": "Qatar",
  "Asia/Kuwait": "Kuwait",
  "Asia/Bahrain": "Bahrain",
  "Asia/Muscat": "Oman",
  "Asia/Jerusalem": "Israel",
  "Asia/Beirut": "Lebanon",
  "Asia/Amman": "Jordan",
  "Asia/Baghdad": "Iraq",
  "Asia/Tehran": "Iran",

  // Southeast Asia
  "Asia/Singapore": "Singapore",
  "Asia/Kuala_Lumpur": "Malaysia",
  "Asia/Bangkok": "Thailand",
  "Asia/Jakarta": "Indonesia",
  "Asia/Makassar": "Indonesia",
  "Asia/Jayapura": "Indonesia",
  "Asia/Manila": "Philippines",
  "Asia/Ho_Chi_Minh": "Vietnam",
  "Asia/Phnom_Penh": "Cambodia",
  "Asia/Yangon": "Myanmar",

  // East Asia
  "Asia/Tokyo": "Japan",
  "Asia/Seoul": "South Korea",
  "Asia/Shanghai": "China",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Taipei": "Taiwan",

  // Europe
  "Europe/London": "United Kingdom",
  "Europe/Paris": "France",
  "Europe/Berlin": "Germany",
  "Europe/Rome": "Italy",
  "Europe/Madrid": "Spain",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Brussels": "Belgium",
  "Europe/Zurich": "Switzerland",
  "Europe/Vienna": "Austria",
  "Europe/Stockholm": "Sweden",
  "Europe/Oslo": "Norway",
  "Europe/Copenhagen": "Denmark",
  "Europe/Helsinki": "Finland",
  "Europe/Dublin": "Ireland",
  "Europe/Warsaw": "Poland",
  "Europe/Moscow": "Russia",
  "Europe/Istanbul": "Turkey",
  "Europe/Athens": "Greece",
  "Europe/Lisbon": "Portugal",

  // Americas
  "America/New_York": "United States",
  "America/Chicago": "United States",
  "America/Los_Angeles": "United States",
  "America/Denver": "United States",
  "America/Phoenix": "United States",
  "America/Detroit": "United States",
  "America/Indiana/Indianapolis": "United States",
  "America/Toronto": "Canada",
  "America/Vancouver": "Canada",
  "America/Montreal": "Canada",
  "America/Edmonton": "Canada",
  "America/Mexico_City": "Mexico",
  "America/Sao_Paulo": "Brazil",
  "America/Buenos_Aires": "Argentina",
  "America/Bogota": "Colombia",
  "America/Santiago": "Chile",

  // Oceania
  "Australia/Sydney": "Australia",
  "Australia/Melbourne": "Australia",
  "Australia/Brisbane": "Australia",
  "Australia/Perth": "Australia",
  "Australia/Adelaide": "Australia",
  "Pacific/Auckland": "New Zealand",

  // Africa
  "Africa/Johannesburg": "South Africa",
  "Africa/Cairo": "Egypt",
  "Africa/Lagos": "Nigeria",
  "Africa/Nairobi": "Kenya",
  "Africa/Accra": "Ghana",
}

// In-memory cache for IP lookups (limits external API calls)
const ipCache = new Map<string, { country: string; state?: string; city?: string; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true
  const cleanIp = ip.replace(/^::ffff:/, "").trim()
  if (
    cleanIp === "127.0.0.1" ||
    cleanIp === "::1" ||
    cleanIp === "localhost" ||
    cleanIp === "0.0.0.0" ||
    cleanIp.startsWith("10.") ||
    cleanIp.startsWith("192.168.") ||
    cleanIp.startsWith("fc00:") ||
    cleanIp.startsWith("fe80:")
  ) {
    return true
  }
  // Check 172.16.0.0 - 172.31.255.255
  if (cleanIp.startsWith("172.")) {
    const parts = cleanIp.split(".")
    const second = parseInt(parts[1], 10)
    if (second >= 16 && second <= 31) return true
  }
  return false
}

/**
 * Resolves country and city from a public IP address with caching and timeout.
 */
export async function resolveIpGeo(ip: string): Promise<{ country: string; state?: string; city?: string } | null> {
  if (!ip || isPrivateIp(ip)) return null

  const cleanIp = ip.replace(/^::ffff:/, "").trim()
  const cached = ipCache.get(cleanIp)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { country: cached.country, state: cached.state, city: cached.city }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 700)

    // Free, fast IP geo service
    const res = await fetch(`https://freeipapi.com/api/json/${cleanIp}`, {
      signal: controller.signal,
      headers: { "User-Agent": "RockyBlog-Geo/1.0" },
    })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data && data.countryName && data.countryName !== "-") {
        const result = {
          country: data.countryName,
          state: data.regionName && data.regionName !== "-" ? data.regionName : undefined,
          city: data.cityName && data.cityName !== "-" ? data.cityName : undefined,
          timestamp: Date.now(),
        }
        ipCache.set(cleanIp, result)
        return result
      }
    }
  } catch {
    // If first fails or times out, try secondary fallback
    try {
      const controller2 = new AbortController()
      const timer2 = setTimeout(() => controller2.abort(), 600)
      const res2 = await fetch(`https://api.country.is/${cleanIp}`, {
        signal: controller2.signal,
      })
      clearTimeout(timer2)
      if (res2.ok) {
        const data2 = await res2.json()
        if (data2 && data2.country) {
          const countryName = ISO_TO_COUNTRY[data2.country.toUpperCase()] || data2.country
          const result = { country: countryName, timestamp: Date.now() }
          ipCache.set(cleanIp, result)
          return result
        }
      }
    } catch {
      // Ignore network errors
    }
  }

  return null
}

export interface GeoDetectionInput {
  headers?: {
    get(name: string): string | null
  }
  ipAddress?: string | null
  clientCountry?: string | null
  clientState?: string | null
  clientCity?: string | null
  timezone?: string | null
  language?: string | null
}

export interface DetectedGeo {
  country: string
  state: string
  city: string
  source: "client" | "header" | "timezone" | "ip" | "fallback"
}

/**
 * Determines the true country, state, and city from available request data.
 * NEVER defaults blindly to "United States".
 */
export async function detectGeoLocation(input: GeoDetectionInput): Promise<DetectedGeo> {
  const { headers, ipAddress, clientCountry, clientState, clientCity, timezone, language } = input

  // 1. Client explicitly passed a reliable detected country
  if (
    clientCountry &&
    clientCountry !== "Unknown" &&
    clientCountry !== "N/A" &&
    clientCountry.trim() !== ""
  ) {
    return {
      country: clientCountry.trim(),
      state: clientState || "N/A",
      city: clientCity || "N/A",
      source: "client",
    }
  }

  // 2. Cloudflare / CDN Headers (cf-ipcountry, x-vercel-ip-country)
  if (headers) {
    const cfCountry = headers.get("cf-ipcountry")
    const vercelCountry = headers.get("x-vercel-ip-country")
    const geoCountry = headers.get("geoip_country_name") || headers.get("x-geo-country")

    const rawCountryCode = cfCountry || vercelCountry
    if (rawCountryCode && rawCountryCode.length === 2) {
      const countryName = ISO_TO_COUNTRY[rawCountryCode.toUpperCase()] || rawCountryCode.toUpperCase()
      const state = headers.get("cf-region") || headers.get("x-vercel-ip-country-region") || "N/A"
      const city = headers.get("cf-ipcity") || headers.get("x-vercel-ip-city") || "N/A"
      return { country: countryName, state, city, source: "header" }
    }

    if (geoCountry && geoCountry.length > 2) {
      return {
        country: geoCountry,
        state: headers.get("x-vercel-ip-country-region") || "N/A",
        city: headers.get("x-vercel-ip-city") || "N/A",
        source: "header",
      }
    }
  }

  // 3. Timezone detection (Highest browser accuracy without external requests)
  if (timezone && TIMEZONE_TO_COUNTRY[timezone]) {
    const country = TIMEZONE_TO_COUNTRY[timezone]
    let state = "N/A"
    let city = "N/A"
    if (timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta") {
      city = "India (Online)"
    }
    return { country, state, city, source: "timezone" }
  }

  // 4. IP-based lookup if public IP is available
  if (ipAddress && !isPrivateIp(ipAddress)) {
    const geo = await resolveIpGeo(ipAddress)
    if (geo && geo.country) {
      return {
        country: geo.country,
        state: geo.state || "N/A",
        city: geo.city || "N/A",
        source: "ip",
      }
    }
  }

  // 5. Language heuristic fallback (e.g. en-IN, hi-IN -> India)
  if (language) {
    const langLower = language.toLowerCase()
    if (
      langLower.includes("-in") ||
      langLower.startsWith("hi") ||
      langLower.startsWith("mr") ||
      langLower.startsWith("ta") ||
      langLower.startsWith("te") ||
      langLower.startsWith("gu") ||
      langLower.startsWith("bn-in") ||
      langLower.startsWith("pa-in")
    ) {
      return { country: "India", state: "N/A", city: "N/A", source: "timezone" }
    }
  }

  // 6. Final fallback: If timezone starts with Asia/, default to India or International instead of US
  if (timezone && timezone.startsWith("Asia/")) {
    return { country: "India", state: "N/A", city: "N/A", source: "fallback" }
  }

  // Default fallback when nothing can be determined
  return {
    country: "India",
    state: "N/A",
    city: "N/A",
    source: "fallback",
  }
}

