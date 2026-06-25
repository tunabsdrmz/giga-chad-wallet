export const BRAND = {
  name: "ChadWallet",
  wordmark: "chadwallet",
  tagline: "Find the next 100x memecoins.",
  subtitle: "From memecoins to viral Solana tokens, trade any coin in seconds.",
} as const;

export const BRAND_ASSETS = {
  logoDark: "/brand/logo.png",
  logoLight: "/brand/logo-on-dark.png",
  logoTransparent: "/brand/logo-transparent.png",
  promoVideo: "/brand/promo.mp4",
  appScreens: {
    splash: "/brand/app/splash.png",
    token: "/brand/app/token.png",
    discover: "/brand/app/discover.png",
    kol: "/brand/app/kol.png",
    launch: "/brand/app/launch.png",
    portfolio: "/brand/app/portfolio.png",
    search: "/brand/app/search.png",
    x: "/brand/app/x.png",
    deposit: "/brand/app/deposit.png",
  },
  flowScreens: {
    buySell: "/brand/flow/buy-sell-4.png",
    kol: "/brand/flow/kol-4.png",
    launch: "/brand/flow/launch-4.png",
    memecoin: "/brand/flow/memecoin-4.png",
    portfolio: "/brand/flow/portfolio-4.png",
    relaunch: "/brand/flow/relaunch-4.png",
  },
  landing: {
    spaceBg: "/brand/landing/space-bg.webp",
    crossDevice: "/brand/landing/cross-device-desktop.png",
  },
} as const;

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/us/app/chadwallet/id6757367474",
  googlePlay: "https://play.google.com/store/apps/details?id=xyz.chadwallet.www",
} as const;

export const SOCIAL_LINKS = {
  twitter: "https://x.com",
  discord: "https://discord.com",
  telegram: "https://telegram.org",
} as const;

export const NAV_LINKS = [
  { label: "Trade", href: "/trade" },
  { label: "Features", href: "/#features" },
  { label: "Download", href: "/#download" },
] as const;
