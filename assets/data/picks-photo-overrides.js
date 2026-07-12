// Event-only fighter thumbnails for Picks.
// Existing ranked fighters still fall back to DISPLAY_OVERRIDES automatically.
const OKC_PHOTO_VERSION='okc-card-20260712a';
const okcPhoto=slug=>`assets/fighters/${slug}-thumb.webp?v=${OKC_PHOTO_VERSION}`;
window.UFC_PICKS_PHOTOS = {
  "Benoit Saint Denis": "assets/fighters/benoit-saint-denis-thumb.webp",
  "Paddy Pimblett": "assets/fighters/paddy-pimblett-thumb.webp",
  "Cory Sandhagen": "assets/fighters/cory-sandhagen-thumb.webp",
  "Mario Bautista": "assets/fighters/mario-bautista-thumb.webp",
  "Brandon Royval": "assets/fighters/brandon-royval-thumb.webp",
  "Lone'er Kavanagh": "assets/fighters/loneer-kavanagh-thumb.webp",
  "King Green": "assets/fighters/king-green-thumb.webp",
  "Terrance McKinney": "assets/fighters/terrance-mckinney-thumb.webp",
  "Nikita Krylov": "assets/fighters/nikita-krylov-thumb.webp",
  "Tabatha Ricci": okcPhoto('tabatha-ricci'),
  "Fatima Kline": okcPhoto('fatima-kline'),
  "Tommy McMillen": okcPhoto('tommy-mcmillen'),
  "Alberto Montes": okcPhoto('alberto-montes'),
  "Chase Hooper": okcPhoto('chase-hooper'),
  "Mitch Ramirez": okcPhoto('mitch-ramirez'),
  "Jared Cannonier": okcPhoto('jared-cannonier'),
  "Christian Leroy Duncan": okcPhoto('christian-leroy-duncan'),
  "Brad Tavares": okcPhoto('brad-tavares'),
  "Marc-André Barriault": okcPhoto('marc-andre-barriault'),
  "Marc-Andre Barriault": okcPhoto('marc-andre-barriault'),
  "Dricus Du Plessis": okcPhoto('dricus-du-plessis'),
  "Dricus du Plessis": okcPhoto('dricus-du-plessis'),
  "Kamaru Usman": okcPhoto('kamaru-usman')
};
