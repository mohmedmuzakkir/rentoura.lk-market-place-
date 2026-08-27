const LOCATION_IMAGE_BY_NAME: Record<string, string> = {
  colombo: 'https://images.unsplash.com/photo-1588258524675-c61945c5bc34?auto=format&fit=crop&w=600&q=80',
  kandy: 'https://images.unsplash.com/photo-1562698013-ac13558052cd?auto=format&fit=crop&w=600&q=80',
  gampaha: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
  kalutara: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
  galle: 'https://images.unsplash.com/photo-1579989197111-928f586796a3?auto=format&fit=crop&w=600&q=80',
  jaffna: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
  negombo: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
  'nuwara eliya': 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
  anuradhapura: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
  trincomalee: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  batticaloa: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  matara: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  kurunegala: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80',
  puttalam: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  ratnapura: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
  kegalle: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=600&q=80',
  western: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80',
  central: 'https://images.unsplash.com/photo-1566766189268-ecac9118f2b7?auto=format&fit=crop&w=600&q=80',
  southern: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80',
  northern: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80',
  eastern: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
  'north western': 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80',
  'north central': 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=600&q=80',
  uva: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
  sabaragamuwa: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80'
};

export const NEUTRAL_LOCATION_IMAGE = 'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=600&q=80';

const normalizeLocationName = (value?: string): string =>
  (value || '').trim().toLowerCase().replace(/\s+(province|district)$/i, '');

export const getLocationImage = (name?: string, provinceName?: string): string =>
  LOCATION_IMAGE_BY_NAME[normalizeLocationName(name)]
  || LOCATION_IMAGE_BY_NAME[normalizeLocationName(provinceName)]
  || NEUTRAL_LOCATION_IMAGE;
