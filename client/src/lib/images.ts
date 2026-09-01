// Images & video for the Andiamo in Banca website — all served from /client/public (self-hosted; the old Manus CDN expired 2026-09)
// All real restaurant photography — no stock images
export const IMAGES = {
  // Logo
  logo: "/andiamo-logo.webp",

  // Exterior / Building
  exterior: "/exterior.webp",

  // The Vault — private dining, repainted red (new on-site photos in /public)
  vault: "/vault-red.jpg",
  vaultAlt: "/vault-red-2.jpg",

  // Main dining room — restored 1920s bank, grand columns
  diningRoom: "/dining-room.jpg",

  // Food Photography — new on-site dishes in /public
  petraleSole: "/petrale-sole.webp",
  lambChops: "/lamb-chops.jpg",
  alfredo: "/fettuccine-alfredo.jpg",
  mushroomAgnolotti: "/mushroom-agnolotti.jpg",
  oysters: "/oysters-rockefeller.jpg",
  steak: "/skirt-steak.jpg",

  // Happy Hour Flyer
  happyHour: "/happy-hour.webp",

  // Hero Video
  heroVideo: "/hero.mp4",

  // Awards
  wineSpectatorAward: "/wine-spectator-award-2026.jpg",

  // Legacy family-restaurant logos (black on transparent, in /public)
  figaroLogo: "/figaro-logo.png",
  donGiovanniLogo: "/dg-logo.png",
} as const;

// External links
export const LINKS = {
  opentable: "https://www.opentable.com/r/andiamo-in-banca-reservations-san-francisco?restref=1035160&lang=en-US&ot_source=Restaurant%20website",
  onlineOrdering: "https://slicelife.com/restaurants/ca/south-san-francisco/94080/andiamo-in-banca/menu?utm_campaign=order_now_button&utm_medium=referral&utm_content=slice_button&utm_source=",
  ezcater: "https://www.ezcater.com/catering/andiamo-in-banca-3",
  yelp: "https://www.yelp.com/biz/andiamo-in-banca-south-san-francisco-3?osq=andiamo+in+banca",
  instagram: "https://www.instagram.com/andiamoinbanca",
  phone: "(650) 745-8811",
  email: "willakkaya@gmail.com",
  address: "301 Linden Avenue, South San Francisco, CA 94080",
  addressShort: "301 Linden Ave\nSouth San Francisco, CA 94080",
  wineSpectatorAwards: "https://www.winespectator.com/articles/about-the-awards",
} as const;
