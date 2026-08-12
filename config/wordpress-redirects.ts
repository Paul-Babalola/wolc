export type LegacyRedirect = {
  from: string
  to: string
  statusCode?: 301 | 302 | 307 | 308
}

/** WordPress and legacy URL mappings for rccgwolc.org cutover. */
export const legacyRedirects: LegacyRedirect[] = [
  {from: '/prayer-request', to: '/prayer'},
  {from: '/prayer-request/', to: '/prayer'},
  {from: '/ministries/outreach-ministry', to: '/ministries/outreach'},
  {from: '/ministries/outreach-ministry/', to: '/ministries/outreach'},
  {from: '/leadership', to: '/about#pastors'},
  {from: '/leadership/', to: '/about#pastors'},
  {from: '/watch-live', to: '/livestream'},
  {from: '/watch-live/', to: '/livestream'},
  {from: '/plan-a-visit', to: '/visit'},
  {from: '/plan-a-visit/', to: '/visit'},
  {from: '/online-giving', to: '/give'},
  {from: '/online-giving/', to: '/give'},
  {from: '/donate', to: '/give'},
  {from: '/donate/', to: '/give'},
  {from: '/events/list', to: '/events'},
  {from: '/events/list/', to: '/events'},
]

export function legacyRedirectRouteRules() {
  return Object.fromEntries(
    legacyRedirects.map(({from, to, statusCode = 301}) => [
      from,
      {redirect: {to, statusCode}},
    ]),
  )
}

export function legacyVercelRedirects() {
  return legacyRedirects.map(({from, to, statusCode = 301}) => ({
    source: from,
    destination: to,
    permanent: statusCode === 301 || statusCode === 308,
  }))
}

/** Paths that should return HTTP 410 Gone after WordPress is retired. */
export const legacyGonePrefixes = [
  '/wp-admin',
  '/wp-json',
  '/wp-content',
  '/wp-includes',
  '/wp-login.php',
  '/xmlrpc.php',
  '/feed',
  '/comments/feed',
  '/tag/',
  '/category/',
  '/author/',
]
