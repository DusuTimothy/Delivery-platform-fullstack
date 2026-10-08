// Real photos used across the app (hotlinked from stable public CDNs).
// Every URL below was verified to return HTTP 200 before being added.

// ---- Marketing hero photos (Wikimedia Commons) ----
export const HERO_PHOTOS = {
  // "Signing for a parcel delivery on a phone" - Meanwell Packaging, CC BY 2.0
  // https://commons.wikimedia.org/wiki/File:Signing_for_a_parcel_delivery_on_a_phone.jpg
  signin:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Signing_for_a_parcel_delivery_on_a_phone.jpg/960px-Signing_for_a_parcel_delivery_on_a_phone.jpg',
  // "Skoteroj de kurieroj de Taŝir Pico (Erevano)" - RG72, CC BY-SA 4.0
  // https://commons.wikimedia.org/wiki/File:Skoteroj_de_kurieroj_de_Taŝir_Pico_(Erevano).jpg
  register:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Skoteroj_de_kurieroj_de_Ta%C5%9Dir_Pico_%28Erevano%29.jpg/960px-Skoteroj_de_kurieroj_de_Ta%C5%9Dir_Pico_%28Erevano%29.jpg',
}

// ---- Vehicle photos (Wikimedia Commons) ----
export const VEHICLE_PHOTOS = {
  // "Moscow, Baumanskaya Street, delivery bicycles" - CC0 (public domain)
  BIKE:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Moscow%2C_Baumanskaya_Street%2C_delivery_bicycles%2C_Mar_2026_02.jpg/960px-Moscow%2C_Baumanskaya_Street%2C_delivery_bicycles%2C_Mar_2026_02.jpg',
  // "Motorciklo de la manĝolivera servo Armen Foods" - RG72, CC BY-SA 4.0
  MOTORBIKE:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Motorciklo_de_la_man%C4%9Dolivera_servo_Armen_Foods.jpg/960px-Motorciklo_de_la_man%C4%9Dolivera_servo_Armen_Foods.jpg',
  // "2024 Canoo MPDV" - Calreyn88, CC BY-SA 4.0
  VAN:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/2024_Canoo_MPDV_%2826973%29.jpg/960px-2024_Canoo_MPDV_%2826973%29.jpg',
}

// Map a rider's free-text vehicle type ("Bike", "Motorbike", "Trike"...)
// to one of our three photo categories.
export function vehiclePhotoKey(vehicleType = '') {
  const v = String(vehicleType).toLowerCase()
  if (v.includes('bike') && !v.includes('motor')) return 'BIKE'
  if (v.includes('van') || v.includes('truck') || v.includes('car')) return 'VAN'
  return 'MOTORBIKE'
}

// ---- Real user portrait photos (randomuser.me, free placeholder service) ----
// Deterministic: the same user always gets the same photo.
const PORTRAIT_COUNT = 99 // portraits are numbered 0-99 on the service
export function userPhoto(seed = '') {
  let hash = 0
  for (const ch of String(seed)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const gender = hash % 2 === 0 ? 'men' : 'women'
  const n = hash % PORTRAIT_COUNT
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`
}
