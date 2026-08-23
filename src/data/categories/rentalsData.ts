import { MainCategoryData } from '../categorySelectorData';

export const RENTALS_CATEGORIES: MainCategoryData[] = [
  // 1. Property Rentals
  {
    id: 'prop-rent',
    name: 'Property Rentals',
    slug: 'property-rentals',
    icon: '🏠',
    description: 'Houses, apartments, commercial properties and land for rent',
    aliases: ['house', 'apartment', 'flat', 'villa', 'bungalow', 'annex', 'commercial', 'land', 'office space', 'shop', 'kade', 'gedara', 'bhavana'],
    subcategories: [
      {
        id: 'houses',
        name: 'Houses',
        slug: 'houses',
        subtitle: 'Single family & luxury homes',
        icon: '🏡',
        aliases: ['house', 'home', 'gedara', 'villa'],
        thirdLevelOptions: [
          { id: 'whole-house', name: 'Whole House', subtitle: 'Entire standalone home', icon: '🏡', aliases: ['full house'] },
          { id: 'luxury-house', name: 'Luxury House', subtitle: 'High-end with amenities', icon: '✨', aliases: ['mansion', 'luxury villa'] },
          { id: 'furnished-house', name: 'Furnished House', subtitle: 'Fully furnished with items', icon: '🛋️', aliases: ['furnished'] },
          { id: 'unfurnished-house', name: 'Unfurnished House', subtitle: 'Standard vacant home', icon: '🚪', aliases: ['unfurnished', 'empty'] }
        ]
      },
      {
        id: 'apartments',
        name: 'Apartments / Flats',
        slug: 'apartments-flats',
        subtitle: 'Studio to luxury complexes',
        icon: '🏢',
        aliases: ['apartment', 'flat', 'condo', 'complex'],
        thirdLevelOptions: [
          { id: 'studio-apt', name: 'Studio Apartment', subtitle: 'Compact open layout', icon: '🚪' },
          { id: '1-bed-apt', name: '1 Bedroom', subtitle: 'Single bedroom apartment', icon: '🛏️' },
          { id: '2-bed-apt', name: '2 Bedrooms', subtitle: 'Standard family unit', icon: '🛏️' },
          { id: '3-bed-apt', name: '3 Bedrooms', subtitle: 'Spacious family unit', icon: '🛏️' },
          { id: '4plus-bed-apt', name: '4+ Bedrooms', subtitle: 'Large luxury apartment', icon: '🏢' },
          { id: 'luxury-apt', name: 'Luxury Apartment', subtitle: 'Pool, gym & security', icon: '🌟' }
        ]
      },
      {
        id: 'villas',
        name: 'Villas',
        slug: 'villas',
        subtitle: 'Private luxury retreats & holiday homes',
        icon: '🏖️',
        aliases: ['villa', 'resort home', 'beach villa']
      },
      {
        id: 'bungalows',
        name: 'Bungalows',
        slug: 'bungalows',
        subtitle: 'Colonial & modern estate bungalows',
        icon: '🏛️',
        aliases: ['bungalow', 'estate home']
      },
      {
        id: 'annex-portions',
        name: 'Annex / Portions',
        slug: 'annex-portions',
        subtitle: 'Separate portion of house with kitchen',
        icon: '🚪',
        aliases: ['annex', 'portion', 'sub unit', 'upper floor', 'ground floor']
      },
      {
        id: 'holiday-homes',
        name: 'Holiday Homes',
        slug: 'holiday-homes',
        subtitle: 'Vacation stays & weekend villas',
        icon: '🌴',
        aliases: ['holiday bungalow', 'vacation home']
      },
      {
        id: 'commercial-properties',
        name: 'Commercial Properties',
        slug: 'commercial-properties',
        subtitle: 'Offices, shops, showrooms & retail',
        icon: '🏬',
        aliases: ['commercial', 'office', 'shop', 'kade', 'showroom'],
        thirdLevelOptions: [
          { id: 'comm-office', name: 'Office', subtitle: 'Corporate office space', icon: '💼' },
          { id: 'comm-shop', name: 'Shop / Retail', subtitle: 'Retail storefront & kiosk', icon: '🛍️' },
          { id: 'comm-warehouse', name: 'Warehouse', subtitle: 'Storage & logistics facility', icon: '🏭' },
          { id: 'comm-restaurant', name: 'Restaurant Space', subtitle: 'Food & beverage setup', icon: '🍽️' },
          { id: 'comm-building', name: 'Commercial Building', subtitle: 'Entire multi-story building', icon: '🏢' },
          { id: 'comm-industrial', name: 'Industrial Building', subtitle: 'Factory & workshop', icon: '⚙️' }
        ]
      },
      {
        id: 'office-spaces',
        name: 'Office Spaces',
        slug: 'office-spaces',
        subtitle: 'Private offices & co-working spaces',
        icon: '💼',
        aliases: ['office', 'coworking', 'workspace']
      },
      {
        id: 'shops-retail',
        name: 'Shops / Retail Spaces',
        slug: 'shops-retail',
        subtitle: 'Storefronts, showrooms & kiosks',
        icon: '🛍️',
        aliases: ['shop', 'store', 'showroom', 'kiosk']
      },
      {
        id: 'warehouses',
        name: 'Warehouses',
        slug: 'warehouses',
        subtitle: 'Commercial storage & distribution yards',
        icon: '📦',
        aliases: ['godown', 'storage unit', 'warehouse']
      },
      {
        id: 'restaurants-food',
        name: 'Restaurants / Food Spaces',
        slug: 'restaurants-food-spaces',
        subtitle: 'Cafes, bakeries & food stalls',
        icon: '🍽️',
        aliases: ['restaurant', 'cafe', 'food court', 'kitchen']
      },
      {
        id: 'hotels-guesthouses',
        name: 'Hotels / Guest Houses',
        slug: 'hotels-guesthouses',
        subtitle: 'Tourism property & boutique hotels',
        icon: '🏨',
        aliases: ['hotel', 'guesthouse', 'homestay']
      },
      {
        id: 'industrial-buildings',
        name: 'Industrial Buildings',
        slug: 'industrial-buildings',
        subtitle: 'Factories, production & storage plants',
        icon: '🏭',
        aliases: ['factory', 'plant', 'industrial']
      },
      {
        id: 'land',
        name: 'Land',
        slug: 'land',
        subtitle: 'Plots, bare land & estates',
        icon: '🏞️',
        aliases: ['land', 'plot', 'estate', 'pitiya', 'idama'],
        thirdLevelOptions: [
          { id: 'res-land', name: 'Residential Land', subtitle: 'For housing & apartments', icon: '🏡' },
          { id: 'comm-land', name: 'Commercial Land', subtitle: 'Main road commercial plot', icon: '🏬' },
          { id: 'agri-land', name: 'Agricultural Land', subtitle: 'Cultivation & paddy field', icon: '🌾' },
          { id: 'ind-land', name: 'Industrial Land', subtitle: 'For factories & heavy storage', icon: '🏭' }
        ]
      }
    ]
  },

  // 2. Rooms & Accommodation
  {
    id: 'rooms-acc',
    name: 'Rooms & Accommodation',
    slug: 'rooms-accommodation',
    icon: '🛏️',
    description: 'Rooms, boarding, student hostels & shared stays',
    aliases: ['room', 'boarding', 'hostel', 'bodim', 'kamara', 'stay', 'single room', 'shared room'],
    subcategories: [
      {
        id: 'single-room',
        name: 'Single Room',
        slug: 'single-room',
        subtitle: 'Private room for 1 person',
        icon: '🛏️',
        aliases: ['single room', '1 person'],
        thirdLevelOptions: [
          { id: 'single-att-bath', name: 'Attached Bathroom', subtitle: 'Private en-suite washroom', icon: '🚿' },
          { id: 'single-shared-bath', name: 'Shared Bathroom', subtitle: 'Common bathroom access', icon: '🚪' },
          { id: 'single-furnished', name: 'Furnished', subtitle: 'Bed, table & fan/AC provided', icon: '🛋️' },
          { id: 'single-unfurnished', name: 'Unfurnished', subtitle: 'Room only', icon: '🪑' }
        ]
      },
      {
        id: 'double-room',
        name: 'Double Room',
        slug: 'double-room',
        subtitle: 'Room for 2 persons / couple',
        icon: '👥',
        aliases: ['double room', 'couple room']
      },
      {
        id: 'shared-room',
        name: 'Shared Room',
        slug: 'shared-room',
        subtitle: 'Shared bed space / roommate',
        icon: '🤝',
        aliases: ['bedspace', 'shared bed', 'dormitory']
      },
      {
        id: 'boarding-room',
        name: 'Boarding Room',
        slug: 'boarding-room',
        subtitle: 'Monthly boarding place (Bodim)',
        icon: '🏠',
        aliases: ['bodim', 'boarding', 'monthly room']
      },
      {
        id: 'hostel',
        name: 'Hostel',
        slug: 'hostel',
        subtitle: 'Student & working hostels',
        icon: '🏢',
        aliases: ['hostel', 'dorm', 'ladies hostel', 'gents hostel']
      },
      {
        id: 'student-acc',
        name: 'Student Accommodation',
        slug: 'student-accommodation',
        subtitle: 'Near universities & institutes',
        icon: '🎓',
        aliases: ['student room', 'campus boarding']
      },
      {
        id: 'staff-acc',
        name: 'Staff Accommodation',
        slug: 'staff-accommodation',
        subtitle: 'Company / employee quarters',
        icon: '👔',
        aliases: ['employee quarters', 'staff room']
      },
      {
        id: 'short-stay',
        name: 'Short Stay Room',
        slug: 'short-stay-room',
        subtitle: 'Daily & weekly rental rooms',
        icon: '⏰',
        aliases: ['daily room', 'transit room', 'day stay']
      },
      {
        id: 'guest-room',
        name: 'Guest Room',
        slug: 'guest-room',
        subtitle: 'Homestay & tourist rooms',
        icon: '🛎️',
        aliases: ['homestay', 'tourist room']
      }
    ]
  },

  // 3. Vehicles
  {
    id: 'vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    icon: '🚗',
    description: 'Cars, vans, buses, three-wheelers, bikes, trucks & boats',
    aliases: ['car', 'van', 'bus', 'tuk tuk', 'three wheeler', 'auto', 'bike', 'motorcycle', 'lorry', 'truck', 'bicycle', 'boat', 'wahana'],
    subcategories: [
      {
        id: 'cars',
        name: 'Cars',
        slug: 'cars',
        subtitle: 'Sedans, SUVs, hatchbacks & luxury cars',
        icon: '🚗',
        aliases: ['car', 'sedan', 'suv', 'hybrid', 'electric car', 'prius', 'wagon r'],
        thirdLevelOptions: [
          { id: 'car-economy', name: 'Economy Car', subtitle: 'Wagon R, Alto, Vitz', icon: '🚙', aliases: ['alto', 'wagonr'] },
          { id: 'car-sedan', name: 'Sedan', subtitle: 'Axio, Premio, Civic, Yaris', icon: '🚗', aliases: ['axio', 'premio'] },
          { id: 'car-hatchback', name: 'Hatchback', subtitle: 'Compact city car', icon: '🚗' },
          { id: 'car-suv', name: 'SUV', subtitle: 'Prado, Vezel, CR-V, Montero', icon: '🚙', aliases: ['prado', 'vezel', 'jeep'] },
          { id: 'car-luxury', name: 'Luxury Car', subtitle: 'Mercedes, BMW, Audi', icon: '✨', aliases: ['benz', 'bmw', 'audi'] },
          { id: 'car-electric', name: 'Electric Car', subtitle: 'EVs & Tesla', icon: '⚡', aliases: ['ev', 'leaf'] },
          { id: 'car-hybrid', name: 'Hybrid Car', subtitle: 'Fuel-efficient hybrid vehicles', icon: '🔋' },
          { id: 'car-sports', name: 'Sports Car', subtitle: 'Convertible & coupe', icon: '🏎️' }
        ]
      },
      {
        id: 'vans',
        name: 'Vans',
        slug: 'vans',
        subtitle: 'Passenger, KDH & cargo vans',
        icon: '🚐',
        aliases: ['van', 'kdh', 'hiace', 'caravan'],
        thirdLevelOptions: [
          { id: 'van-passenger', name: 'Passenger Van', subtitle: 'KDH, HiAce 9-14 seats', icon: '🚐', aliases: ['kdh', 'hiace'] },
          { id: 'van-cargo', name: 'Cargo Van', subtitle: 'Delivery & goods transport', icon: '📦' },
          { id: 'van-luxury', name: 'Luxury Van', subtitle: 'Super GL, VIP interior', icon: '✨' }
        ]
      },
      {
        id: 'buses',
        name: 'Buses',
        slug: 'buses',
        subtitle: 'Mini buses, coaches & staff transport',
        icon: '🚌',
        aliases: ['bus', 'rosa', 'coaster', 'coach'],
        thirdLevelOptions: [
          { id: 'bus-mini', name: 'Mini Bus', subtitle: 'Rosa, Coaster 20-30 seats', icon: '🚐' },
          { id: 'bus-staff', name: 'Staff Transport Bus', subtitle: 'Office & factory route', icon: '🚌' },
          { id: 'bus-coach', name: 'Coach Bus', subtitle: 'Luxury AC 40-54 seats', icon: '🚎' },
          { id: 'bus-tourist', name: 'Tourist Bus', subtitle: 'Tours & excursions', icon: '🌴' }
        ]
      },
      {
        id: 'three-wheelers',
        name: 'Three Wheelers',
        slug: 'three-wheelers',
        subtitle: 'Bajaj, TVS, Piaggio tuk-tuks',
        icon: '🛺',
        aliases: ['tuk tuk', 'three wheeler', 'auto', 'bajaj', 'tvs']
      },
      {
        id: 'motorcycles',
        name: 'Motorcycles',
        slug: 'motorcycles',
        subtitle: 'Scooters, street bikes & trail bikes',
        icon: '🏍️',
        aliases: ['bike', 'scooter', 'motorcycle', 'dio', 'pulsar', 'fz'],
        thirdLevelOptions: [
          { id: 'moto-scooter', name: 'Scooter', subtitle: 'Dio, Pleasure, Activa, N-Torq', icon: '🛵' },
          { id: 'moto-motorbike', name: 'Motorbike', subtitle: 'Pulsar, FZ, Discovery, CB', icon: '🏍️' },
          { id: 'moto-sports', name: 'Sports Bike', subtitle: 'CBR, R15, KTM Duke', icon: '🏍️' },
          { id: 'moto-touring', name: 'Touring Bike', subtitle: 'Adventure & cruiser', icon: '🛣️' }
        ]
      },
      {
        id: 'bicycles',
        name: 'Bicycles',
        slug: 'bicycles',
        subtitle: 'City, mountain & electric bicycles',
        icon: '🚲',
        aliases: ['cycle', 'bicycle', 'push bike', 'mtb'],
        thirdLevelOptions: [
          { id: 'bike-city', name: 'City Bicycle', subtitle: 'Standard commute bike', icon: '🚲' },
          { id: 'bike-mountain', name: 'Mountain Bicycle', subtitle: 'MTB with gears & suspension', icon: '🚵' },
          { id: 'bike-road', name: 'Road Bicycle', subtitle: 'Speed racing bike', icon: '🚴' },
          { id: 'bike-electric', name: 'Electric Bicycle', subtitle: 'E-bike pedal assist', icon: '⚡' }
        ]
      },
      {
        id: 'trucks-lorries',
        name: 'Trucks & Lorries',
        slug: 'trucks-lorries',
        subtitle: 'Pickups, mini-lorries, tippers & containers',
        icon: '🚛',
        aliases: ['lorry', 'truck', 'dimo batta', 'canter', 'tipper', 'container'],
        thirdLevelOptions: [
          { id: 'trk-pickup', name: 'Pickup', subtitle: 'Hilux, D-Max, Cab', icon: '🛻' },
          { id: 'trk-mini-lorry', name: 'Mini Lorry', subtitle: 'Dimo Batta, Tata Ace, Mahindra', icon: '🚚' },
          { id: 'trk-lorry', name: 'Lorry', subtitle: 'Canter, Isuzu Elf, 10-14ft', icon: '🚛' },
          { id: 'trk-heavy', name: 'Heavy Truck', subtitle: 'Multi-axle & heavy payload', icon: '🚚' },
          { id: 'trk-container', name: 'Container Truck', subtitle: '20ft / 40ft prime mover', icon: '📦' }
        ]
      },
      {
        id: 'construction-vehicles',
        name: 'Construction Vehicles',
        slug: 'construction-vehicles',
        subtitle: 'Excavators, backhoes, cranes & tractors',
        icon: '🚜',
        aliases: ['jcb', 'excavator', 'backhoe', 'crane', 'tractor', 'roller'],
        thirdLevelOptions: [
          { id: 'cv-excavator', name: 'Excavator', subtitle: 'Track & wheeled digger (Kobelco/CAT)', icon: '🚜' },
          { id: 'cv-backhoe', name: 'Backhoe (JCB)', subtitle: 'JCB / loader combo', icon: '🚜' },
          { id: 'cv-bulldozer', name: 'Bulldozer', subtitle: 'Earthmoving & grading', icon: '🚜' },
          { id: 'cv-crane', name: 'Crane', subtitle: 'Mobile hydraulic & boom truck', icon: '🏗️' },
          { id: 'cv-roller', name: 'Road Roller', subtitle: 'Soil & asphalt compactor', icon: '🚜' },
          { id: 'cv-tractor', name: 'Tractor', subtitle: 'Farm & trailer tractor', icon: '🚜' },
          { id: 'cv-loader', name: 'Loader', subtitle: 'Wheel loader for sand & gravel', icon: '🚜' },
          { id: 'cv-dump-truck', name: 'Dump Truck', subtitle: 'Tipper for earth & gravel', icon: '🚛' }
        ]
      },
      {
        id: 'water-transport',
        name: 'Water Transport',
        slug: 'water-transport',
        subtitle: 'Speed boats, fishing boats, yachts & jet skis',
        icon: '🚤',
        aliases: ['boat', 'yacht', 'jetski', 'ferry'],
        thirdLevelOptions: [
          { id: 'wt-boat', name: 'Boat', subtitle: 'Motorized boat for lagoon & river', icon: '⛵' },
          { id: 'wt-fishing-boat', name: 'Fishing Boat', subtitle: 'Deep sea & coastal fishing', icon: '🎣' },
          { id: 'wt-speed-boat', name: 'Speed Boat', subtitle: 'Water sports & fast charter', icon: '🚤' },
          { id: 'wt-yacht', name: 'Yacht', subtitle: 'Luxury sailing & party yacht', icon: '🛥️' },
          { id: 'wt-jet-ski', name: 'Jet Ski', subtitle: 'Personal watercraft', icon: '🌊' }
        ]
      }
    ]
  },

  // 4. Event Rentals
  {
    id: 'event-rentals',
    name: 'Event Rentals',
    slug: 'event-rentals',
    icon: '🎉',
    description: 'Halls, canopies, lights, sound systems, catering & DJ items',
    aliases: ['wedding', 'party', 'hall', 'canopy', 'tent', 'sound system', 'dj', 'lights', 'chairs', 'tables', 'stage'],
    subcategories: [
      { id: 'wedding-hall', name: 'Wedding Hall', subtitle: 'Banquet halls & ballroom venues', icon: '💒', aliases: ['banquet', 'hotel hall'] },
      { id: 'reception-hall', name: 'Reception Hall', subtitle: 'Ceremony & dinner venues', icon: '🏛️' },
      { id: 'party-hall', name: 'Party Hall', subtitle: 'Birthdays & get-togethers', icon: '🎈' },
      { id: 'conference-hall', name: 'Conference Hall', subtitle: 'Auditoriums & seminars', icon: '🏢' },
      { id: 'meeting-room', name: 'Meeting Room', subtitle: 'Boardroom & training rooms', icon: '💼' },
      { id: 'event-ground', name: 'Event Ground', subtitle: 'Open-air grounds & turf fields', icon: '🎪' },
      { id: 'stage', name: 'Stage & Trussing', subtitle: 'Modular platforms & backdrop framing', icon: '🎭' },
      { id: 'sound-system', name: 'Sound System', subtitle: 'Speakers, line-arrays & microphones', icon: '🔊', aliases: ['speakers', 'mic'] },
      { id: 'dj-equipment', name: 'DJ Equipment', subtitle: 'DJ consoles, mixers & decks', icon: '🎧' },
      { id: 'lighting-equipment', name: 'Lighting Equipment', subtitle: 'Moving heads, par lights & lasers', icon: '💡' },
      { id: 'led-screen', name: 'LED Screen & Walls', subtitle: 'Indoor & outdoor video walls', icon: '🖥️' },
      { id: 'projector', name: 'Projector & Screens', subtitle: 'HD projectors & pull-up screens', icon: '📽️' },
      { id: 'tents-marquees', name: 'Tents & Marquees', subtitle: 'Canopies, huts & wedding tents', icon: '⛺', aliases: ['canopy', 'tent'] },
      { id: 'chairs-tables', name: 'Chairs & Tables', subtitle: 'Plastic, banquet & chiavari chairs', icon: '🪑' },
      { id: 'decorations', name: 'Decorations & Backdrops', subtitle: 'Floral, thematic & balloon arches', icon: '💐' },
      { id: 'generator-event', name: 'Generator', subtitle: 'Event backup power generators', icon: '⚡' },
      { id: 'portable-ac', name: 'Portable AC & Fans', subtitle: 'Mist fans & temporary marquee cooling', icon: '❄️' },
      { id: 'photo-booth', name: 'Photo Booth', subtitle: '360 video booth & props', icon: '📸' },
      { id: 'wedding-car', name: 'Wedding Car', subtitle: 'Decorated luxury & vintage cars', icon: '🚘' }
    ]
  },

  // 5. Construction & Industrial Equipment
  {
    id: 'construction-eq',
    name: 'Construction & Industrial Equipment',
    slug: 'construction-industrial-equipment',
    icon: '🏗️',
    description: 'Scaffolding, mixers, generators, pumps, compactors & heavy tools',
    aliases: ['scaffolding', 'mixer', 'generator', 'water pump', 'welding', 'compressor', 'compactor', 'baass'],
    subcategories: [
      { id: 'scaffolding', name: 'Scaffolding', subtitle: 'Steel frames, pipes & jacks', icon: '🪜' },
      { id: 'generators-const', name: 'Generators', subtitle: 'Diesel & petrol standby power (5kVA - 500kVA)', icon: '⚡' },
      { id: 'water-pumps', name: 'Water Pumps', subtitle: 'Submersible, dewatering & petrol pumps', icon: '💧' },
      { id: 'air-compressors', name: 'Air Compressors', subtitle: 'Pneumatic compressors & hoses', icon: '💨' },
      { id: 'welding-machines', name: 'Welding Machines', subtitle: 'Arc, TIG & MIG welders', icon: '🔥' },
      { id: 'concrete-mixers', name: 'Concrete Mixers', subtitle: 'Batching mixers & poker vibrators', icon: '⚙️' },
      { id: 'compactors', name: 'Compactors & Rammers', subtitle: 'Plate compactors & roller rammers', icon: '🔨' },
      { id: 'survey-equipment', name: 'Survey Equipment', subtitle: 'Total stations, theodolites & dumpy levels', icon: '📐' }
    ]
  },

  // 6. Tools & Machinery
  {
    id: 'tools-machinery',
    name: 'Tools & Machinery',
    slug: 'tools-machinery',
    icon: '🔧',
    description: 'Drills, grinders, cutters, pressure washers & power hand tools',
    aliases: ['drill', 'grinder', 'saw', 'cutter', 'pressure washer', 'ladder', 'tools'],
    subcategories: [
      { id: 'power-tools', name: 'Power Tools', subtitle: 'Drills, angle grinders & impact wrenches', icon: '🪛' },
      { id: 'hand-tools', name: 'Hand Tools', subtitle: 'Wrenches, spanners, pliers & kits', icon: '🔨' },
      { id: 'tile-cutters', name: 'Tile Cutters', subtitle: 'Electric & manual ceramic/granite cutters', icon: '🪚' },
      { id: 'drilling-machines', name: 'Drilling Machines', subtitle: 'Rotary hammers, core drills & magnetic drills', icon: '🔩' },
      { id: 'cutting-machines', name: 'Cutting Machines', subtitle: 'Chop saws, circular saws & metal cutters', icon: '🪚' },
      { id: 'ladders', name: 'Ladders', subtitle: 'Aluminum extension & A-frame ladders', icon: '🪜' },
      { id: 'pressure-washers', name: 'Pressure Washers', subtitle: 'High pressure water jet cleaners', icon: '💦' }
    ]
  },

  // 7. Electronics & Technology
  {
    id: 'electronics-tech',
    name: 'Electronics & Technology',
    slug: 'electronics-technology',
    icon: '💻',
    description: 'Laptops, computers, TVs, tablets, gaming consoles & tech devices',
    aliases: ['laptop', 'pc', 'computer', 'tv', 'screen', 'printer', 'tablet', 'ipad', 'playstation', 'ps5', 'projector', 'ups'],
    subcategories: [
      { id: 'laptop', name: 'Laptop', subtitle: 'Business, student & gaming laptops', icon: '💻', aliases: ['macbook', 'dell', 'thinkpad'] },
      { id: 'desktop-computer', name: 'Desktop Computer', subtitle: 'High performance PC towers & all-in-ones', icon: '🖥️' },
      { id: 'monitor', name: 'Monitor / Display', subtitle: '24" to 34" LED/IPS monitors', icon: '🖥️' },
      { id: 'printer-scanner', name: 'Printer / Scanner', subtitle: 'Laser, inkjet & multifunction photocopiers', icon: '🖨️' },
      { id: 'projector-tech', name: 'Projector', subtitle: 'Home theater & presentation projectors', icon: '📽️' },
      { id: 'tv', name: 'TV', subtitle: '43" - 75" Smart 4K displays', icon: '📺' },
      { id: 'tablet', name: 'Tablet / iPad', subtitle: 'iPads & Android tablets for events', icon: '📱' },
      { id: 'gaming-console', name: 'Gaming Console', subtitle: 'PlayStation 5, PS4, Xbox, Nintendo Switch', icon: '🎮', aliases: ['ps5', 'ps4', 'xbox'] },
      { id: 'vr-headset', name: 'VR Headset', subtitle: 'Meta Quest & VR gaming gear', icon: '🥽' },
      { id: 'networking-eq', name: 'Router & Networking', subtitle: '4G/5G routers, switches & WiFi access points', icon: '📡' },
      { id: 'ups-powerbank', name: 'UPS & Power Bank', subtitle: 'High-capacity battery stations', icon: '🔋' }
    ]
  },

  // 8. Cameras & Media Equipment
  {
    id: 'cameras-media',
    name: 'Cameras & Media Equipment',
    slug: 'cameras-media-equipment',
    icon: '📷',
    description: 'DSLR, mirrorless, lenses, drones, gimbals & studio lighting gear',
    aliases: ['camera', 'dslr', 'sony', 'canon', 'lens', 'drone', 'gimbal', 'tripod', 'studio lights', 'gopro'],
    subcategories: [
      { id: 'dslr-camera', name: 'DSLR Camera', subtitle: 'Canon & Nikon DSLR bodies', icon: '📷' },
      { id: 'mirrorless-camera', name: 'Mirrorless Camera', subtitle: 'Sony Alpha, Canon R, Fujifilm bodies', icon: '📸' },
      { id: 'video-camera', name: 'Video Camera', subtitle: 'Cinema cameras (FX3, BMPCC, RED)', icon: '🎥' },
      { id: 'action-camera', name: 'Action Camera', subtitle: 'GoPro Hero & Insta360 cameras', icon: '📹' },
      { id: 'lenses', name: 'Lenses', subtitle: 'Prime, zoom, telephoto & wide-angle lenses', icon: '🔍' },
      { id: 'drone', name: 'Drone', subtitle: 'DJI Mavic, Mini & Phantom series', icon: '🛸', aliases: ['dji', 'drone'] },
      { id: 'gimbal', name: 'Gimbal & Stabilizer', subtitle: 'DJI Ronin, RS3, Zhiyun gimbals', icon: '🕹️' },
      { id: 'tripod', name: 'Tripod & Monopod', subtitle: 'Heavy duty video & photo tripods', icon: '🔭' },
      { id: 'studio-lighting', name: 'Studio Lighting Kit', subtitle: 'Godox, Aputure softboxes & LED lights', icon: '💡' },
      { id: 'audio-recorder', name: 'Microphone & Audio', subtitle: 'Rode wireless mics, Zoom recorders', icon: '🎙️' }
    ]
  },

  // 9. Furniture
  {
    id: 'furniture',
    name: 'Furniture',
    slug: 'furniture',
    icon: '🛋️',
    description: 'Sofas, beds, dining sets, office desks & event furniture',
    aliases: ['sofa', 'bed', 'mattress', 'dining table', 'chair', 'wardrobe', 'desk', 'office chair', 'furniture'],
    subcategories: [
      { id: 'sofa', name: 'Sofa & Couches', subtitle: 'Living room sofas, recliners & L-shapes', icon: '🛋️' },
      { id: 'bed-mattress', name: 'Bed & Mattress', subtitle: 'King, queen & single beds with mattresses', icon: '🛏️' },
      { id: 'dining-table', name: 'Dining Table & Chairs', subtitle: '4-8 seater wooden & glass sets', icon: '🪑' },
      { id: 'wardrobe', name: 'Wardrobe & Closets', subtitle: '2-4 door almirahs & cloth racks', icon: '🚪' },
      { id: 'office-desk', name: 'Office Desk & Workstation', subtitle: 'Executive desks & computer tables', icon: '💼' },
      { id: 'office-chair', name: 'Office Chair', subtitle: 'Ergonomic mesh & leather chairs', icon: '🪑' },
      { id: 'conference-table', name: 'Conference Table', subtitle: 'Boardroom meeting tables', icon: '🏢' },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture', subtitle: 'Patio chairs, garden tables & benches', icon: '🪑' },
      { id: 'storage-cabinet', name: 'Storage Cabinet & Racks', subtitle: 'Bookcases, filing cabinets & display racks', icon: '🗄️' }
    ]
  },

  // 10. Home Appliances
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    slug: 'home-appliances',
    icon: '🧊',
    description: 'Fridges, washing machines, microwaves, ACs & household appliances',
    aliases: ['refrigerator', 'fridge', 'washing machine', 'ac', 'microwave', 'fan', 'vacuum', 'cooker', 'oven', 'water heater'],
    subcategories: [
      { id: 'refrigerator', name: 'Refrigerator & Freezer', subtitle: 'Single & double door fridges, deep freezers', icon: '🧊', aliases: ['fridge'] },
      { id: 'washing-machine', name: 'Washing Machine', subtitle: 'Top load & front load automatic washers', icon: '🧺' },
      { id: 'air-conditioner', name: 'Air Conditioner', subtitle: 'Split & portable AC units', icon: '❄️', aliases: ['ac', 'aircon'] },
      { id: 'microwave-oven', name: 'Microwave & Oven', subtitle: 'Convection microwaves & baking ovens', icon: '🍲' },
      { id: 'cooker-stove', name: 'Cooker / Stove', subtitle: 'Gas burners, induction & rice cookers', icon: '🍳' },
      { id: 'fan', name: 'Fans', subtitle: 'Stand fans, ceiling fans & tower fans', icon: '💨' },
      { id: 'water-dispenser', name: 'Water Dispenser', subtitle: 'Hot & cold bottle dispensers', icon: '💧' },
      { id: 'vacuum-cleaner', name: 'Vacuum Cleaner', subtitle: 'Wet/dry vacuums & carpet cleaners', icon: '🧹' },
      { id: 'water-heater', name: 'Water Heater', subtitle: 'Geysers & instant water heaters', icon: '🚿' }
    ]
  },

  // 11. Fashion & Clothing
  {
    id: 'fashion-clothing',
    name: 'Fashion & Clothing',
    slug: 'fashion-clothing',
    icon: '👗',
    description: 'Suits, blazers, sarees, party wear & designer apparel',
    aliases: ['suit', 'blazer', 'tuxedo', 'dress', 'saree', 'gown', 'lehenga', 'costume'],
    subcategories: [
      { id: 'suit-tuxedo', name: 'Suit & Tuxedo', subtitle: 'Men’s formal suits, blazers & tuxedos', icon: '👔' },
      { id: 'blazer', name: 'Blazer', subtitle: 'Casual & business blazers', icon: '🧥' },
      { id: 'saree', name: 'Saree', subtitle: 'Silk, designer & party wear sarees', icon: '🥻' },
      { id: 'evening-dress', name: 'Evening Dress & Gown', subtitle: 'Party wear gowns & cocktail dresses', icon: '👗' },
      { id: 'kurta-sherwani', name: 'Kurta & Sherwani', subtitle: 'Traditional ethnic wear', icon: '🥻' },
      { id: 'costumes', name: 'Costumes & Fancy Dress', subtitle: 'Character, cultural & Halloween wear', icon: '🎭' }
    ]
  },

  // 12. Wedding & Bridal Items
  {
    id: 'wedding-bridal',
    name: 'Wedding & Bridal Items',
    slug: 'wedding-bridal-items',
    icon: '💍',
    description: 'Bridal sarees, gowns, jewellery, nilame suits & bridal accessories',
    aliases: ['bridal', 'wedding dress', 'bridal saree', 'lehenga', 'jewellery', 'poruwa', 'nilame dress', 'bridal gown'],
    subcategories: [
      { id: 'bridal-saree', name: 'Bridal Saree', subtitle: 'Kandyan & Indian bridal sarees', icon: '🥻' },
      { id: 'bridal-gown', name: 'Bridal Gown', subtitle: 'Western bridal gowns & veils', icon: '👰' },
      { id: 'lehenga', name: 'Lehenga', subtitle: 'Bridal & reception lehengas', icon: '👗' },
      { id: 'nilame-suit', name: 'Nilame & Groom Wear', subtitle: 'Traditional Kandyan Mul Anduma & sherwanis', icon: '👑' },
      { id: 'jewellery', name: 'Bridal Jewellery', subtitle: 'Gold plated sets, headpieces & bangles', icon: '💎' },
      { id: 'wedding-accessories', name: 'Wedding Accessories', subtitle: 'Tiara, shoes, bouquets & clutches', icon: '👠' }
    ]
  },

  // 13. Outdoor & Camping
  {
    id: 'outdoor-camping',
    name: 'Outdoor & Camping',
    slug: 'outdoor-camping',
    icon: '⛺',
    description: 'Tents, sleeping bags, stoves, hiking gear & camping sets',
    aliases: ['tent', 'camping', 'sleeping bag', 'bbq grill', 'hiking', 'kayak', 'cooler box'],
    subcategories: [
      { id: 'camping-tent', name: 'Camping Tent', subtitle: '2, 4, 6 & 8 person waterproof tents', icon: '⛺' },
      { id: 'sleeping-bag', name: 'Sleeping Bag & Mat', subtitle: 'Thermal sleeping bags & air mattresses', icon: '🛌' },
      { id: 'camping-furniture', name: 'Camping Chair & Table', subtitle: 'Foldable lightweight furniture', icon: '🪑' },
      { id: 'camping-stove', name: 'Camping Stove & Cookware', subtitle: 'Butane portable stoves & mess kits', icon: '🍳' },
      { id: 'lantern-torch', name: 'Lantern & Headlamps', subtitle: 'Rechargeable LED camp lights', icon: '🔦' },
      { id: 'cooler-box', name: 'Cooler Box & Ice Chest', subtitle: 'Insulated ice boxes for trips', icon: '🧊' },
      { id: 'hiking-gear', name: 'Hiking Gear & Backpacks', subtitle: 'Trekking poles & 60L-80L rucksacks', icon: '🎒' },
      { id: 'bbq-grill-outdoor', name: 'BBQ Grill', subtitle: 'Charcoal & gas barbecue stands', icon: '🍖' }
    ]
  },

  // 14. Sports & Fitness Equipment
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness Equipment',
    slug: 'sports-fitness-equipment',
    icon: '🏋️',
    description: 'Treadmills, exercise bikes, dumbbells, cricket & gym gear',
    aliases: ['gym', 'treadmill', 'exercise bike', 'dumbbells', 'cricket', 'badminton', 'surfboard', 'fitness'],
    subcategories: [
      { id: 'treadmill', name: 'Treadmill', subtitle: 'Motorized home & commercial treadmills', icon: '🏃' },
      { id: 'exercise-bike', name: 'Exercise Bike', subtitle: 'Spin bikes & magnetic stationary cycles', icon: '🚴' },
      { id: 'dumbbells-weights', name: 'Dumbbells & Weights', subtitle: 'Barbells, plates & adjustable dumbbells', icon: '🏋️' },
      { id: 'gym-equipment', name: 'Multi Gym Equipment', subtitle: 'Home gym benches, racks & pull-up towers', icon: '🦾' },
      { id: 'cricket-gear', name: 'Cricket Equipment', subtitle: 'Bats, pads, helmets, nets & bowling machines', icon: '🏏' },
      { id: 'racquet-sports', name: 'Badminton & Tennis', subtitle: 'Racquets, portable nets & shuttlecocks', icon: '🏸' },
      { id: 'water-sports-eq', name: 'Surfing & Water Sports', subtitle: 'Surfboards, bodyboards & paddleboards', icon: '🏄' }
    ]
  },

  // 15. Baby & Kids Equipment
  {
    id: 'baby-kids',
    name: 'Baby & Kids Equipment',
    slug: 'baby-kids-equipment',
    icon: '🍼',
    description: 'Strollers, baby cots, car seats, high chairs & kids party toys',
    aliases: ['stroller', 'baby cot', 'pram', 'car seat', 'playpen', 'baby walker', 'cradle'],
    subcategories: [
      { id: 'baby-stroller', name: 'Baby Stroller / Pram', subtitle: 'Foldable lightweight & travel strollers', icon: '🛒' },
      { id: 'baby-cot', name: 'Baby Cot & Cradle', subtitle: 'Wooden & travel playpens with mattress', icon: '🛏️' },
      { id: 'baby-car-seat', name: 'Baby Car Seat', subtitle: 'Infant & toddler safety seats', icon: '🪑' },
      { id: 'high-chair', name: 'High Chair & Booster', subtitle: 'Feeding chairs with trays', icon: '🪑' },
      { id: 'baby-walker', name: 'Baby Walker & Jumper', subtitle: 'Activity walkers and rockers', icon: '🚶' },
      { id: 'kids-party-items', name: 'Kids Party Equipment', subtitle: 'Bouncy castles, soft play sets & mascots', icon: '🏰' }
    ]
  },

  // 16. Medical & Mobility Equipment
  {
    id: 'medical-mobility',
    name: 'Medical & Mobility Equipment',
    slug: 'medical-mobility-equipment',
    icon: '🩺',
    description: 'Wheelchairs, hospital beds, oxygen concentrators & patient aids',
    aliases: ['wheelchair', 'hospital bed', 'oxygen', 'crutches', 'walking frame', 'patient lift', 'medical'],
    subcategories: [
      { id: 'wheelchair', name: 'Wheelchair', subtitle: 'Manual, lightweight & electric wheelchairs', icon: '🦽', aliases: ['wheel chair'] },
      { id: 'hospital-bed', name: 'Hospital Bed', subtitle: 'Manual & motorized adjustable beds', icon: '🛏️' },
      { id: 'oxygen-equipment', name: 'Oxygen Equipment', subtitle: 'Oxygen concentrators & cylinders with regulator', icon: '🫁', aliases: ['oxygen concentrator', 'oxygen cylinder'] },
      { id: 'walking-aids', name: 'Walking Frame & Crutches', subtitle: 'Rollators, walkers & elbow crutches', icon: '🦯' },
      { id: 'commode-chair', name: 'Commode Chair', subtitle: 'Bedside commodes & shower chairs', icon: '🪑' },
      { id: 'patient-lift', name: 'Patient Lift & Hoist', subtitle: 'Hydraulic & electric patient transfer lifts', icon: '🦾' }
    ]
  },

  // 17. Office Equipment
  {
    id: 'office-equipment',
    name: 'Office Equipment',
    slug: 'office-equipment',
    icon: '🖨️',
    description: 'Photocopiers, conference tech, shredders & office machinery',
    aliases: ['printer', 'photocopier', 'scanner', 'projector', 'shredder', 'conference phone'],
    subcategories: [
      { id: 'photocopier-commercial', name: 'Commercial Photocopier', subtitle: 'Heavy duty A3/A4 network copiers', icon: '🖨️' },
      { id: 'conference-tech', name: 'Conference Tech', subtitle: 'Meeting owls, video soundbars & speakerphones', icon: '🎙️' },
      { id: 'paper-shredder', name: 'Paper Shredder', subtitle: 'Cross-cut heavy duty document shredders', icon: '📄' },
      { id: 'laminator-binding', name: 'Laminator & Binding', subtitle: 'Spiral & thermal binding machines', icon: '📑' }
    ]
  },

  // 18. Business & Commercial Equipment
  {
    id: 'business-commercial-eq',
    name: 'Business & Commercial Equipment',
    slug: 'business-commercial-equipment',
    icon: '💳',
    description: 'POS machines, barcode scanners, display stands & retail gear',
    aliases: ['pos', 'barcode scanner', 'cash register', 'display stand', 'exhibition booth', 'supermarket rack'],
    subcategories: [
      { id: 'pos-machine', name: 'POS Machine', subtitle: 'Touchscreen POS terminals & thermal printers', icon: '💳' },
      { id: 'barcode-scanner', name: 'Barcode Scanner', subtitle: 'Handheld 1D/2D wireless scanners', icon: '📟' },
      { id: 'cash-register', name: 'Cash Register & Drawer', subtitle: 'Electronic cash drawers & counter boxes', icon: '💵' },
      { id: 'exhibition-stands', name: 'Display & Exhibition Stand', subtitle: 'Rollup banners, display racks & promo counters', icon: '🖼️' }
    ]
  },

  // 19. Agriculture & Farming Equipment
  {
    id: 'agri-farming-eq',
    name: 'Agriculture & Farming Equipment',
    slug: 'agriculture-farming-equipment',
    icon: '🌾',
    description: 'Tractors, grass cutters, power sprayers, tillers & farm tools',
    aliases: ['tractor', 'grass cutter', 'brush cutter', 'tiller', 'harvester', 'sprayer', 'water pump', 'govi'],
    subcategories: [
      { id: 'farm-tractor', name: 'Tractor & Attachments', subtitle: '4WD tractors, rotavators & ploughs', icon: '🚜' },
      { id: 'grass-cutter', name: 'Grass & Brush Cutter', subtitle: 'Petrol 2-stroke/4-stroke grass trimmers', icon: '🌱', aliases: ['brush cutter', 'weed cutter'] },
      { id: 'power-sprayer', name: 'Power Sprayer', subtitle: 'Knapsack & engine sprayers for fertilizer', icon: '💦' },
      { id: 'power-tiller', name: 'Power Tiller', subtitle: 'Hand tractor tillers for paddy & field', icon: '⚙️' },
      { id: 'harvester-agri', name: 'Harvester', subtitle: 'Combine harvesters & threshers', icon: '🌾' },
      { id: 'farming-tools', name: 'Farming Hand Tools', subtitle: 'Mammoties, pruning shears & augers', icon: '🛠️' }
    ]
  },

  // 20. Boats & Water Transport
  {
    id: 'boats-water',
    name: 'Boats & Water Transport',
    slug: 'boats-water-transport',
    icon: '⛵',
    description: 'Speedboats, fishing boats, yachts, kayaks & jet skis',
    aliases: ['boat', 'yacht', 'speedboat', 'kayak', 'jetski', 'canoe'],
    subcategories: [
      { id: 'speedboat-rent', name: 'Speed Boat', subtitle: 'Tour & passenger speedboats', icon: '🚤' },
      { id: 'fishing-boat-rent', name: 'Fishing Boat', subtitle: 'Coastal and offshore crafts', icon: '🎣' },
      { id: 'yacht-rent', name: 'Yacht & Catamaran', subtitle: 'Luxury sailing and sunset cruises', icon: '🛥️' },
      { id: 'kayak-rent', name: 'Kayak & Canoe', subtitle: 'Single & tandem recreational kayaks', icon: '🛶' },
      { id: 'jet-ski-rent', name: 'Jet Ski', subtitle: 'High powered personal watercraft', icon: '🌊' }
    ]
  },

  // 21. Travel & Luggage
  {
    id: 'travel-luggage',
    name: 'Travel & Luggage',
    slug: 'travel-luggage',
    icon: '🧳',
    description: 'Suitcases, travel bags, roof racks & travel accessories',
    aliases: ['suitcase', 'luggage', 'travel bag', 'roof rack', 'trolley bag'],
    subcategories: [
      { id: 'hard-suitcase', name: 'Suitcase & Trolley Bags', subtitle: 'Large 28"-32" hard-shell suitcases', icon: '🧳' },
      { id: 'car-roof-rack', name: 'Car Roof Box & Carrier', subtitle: 'Universal roof luggage boxes', icon: '🚗' },
      { id: 'travel-accessories', name: 'Travel Accessories', subtitle: 'Weighing scales, adaptors & covers', icon: '🔌' }
    ]
  },

  // 22. Party & Entertainment Items
  {
    id: 'party-entertainment',
    name: 'Party & Entertainment Items',
    slug: 'party-entertainment-items',
    icon: '🎈',
    description: 'Bouncy castles, karaoke machines, mascots & party games',
    aliases: ['bouncy castle', 'karaoke', 'party game', 'mascot', 'popcorn machine', 'cotton candy'],
    subcategories: [
      { id: 'bouncy-castle', name: 'Bouncy Castle', subtitle: 'Inflatable castles and water slides', icon: '🏰' },
      { id: 'karaoke-machine', name: 'Karaoke Machine', subtitle: 'Microphones, screen & song tracks', icon: '🎤' },
      { id: 'snack-machines', name: 'Popcorn & Candy Floss Machine', subtitle: 'Party food stations', icon: '🍿' },
      { id: 'mascot-costumes', name: 'Mascots & Costumes', subtitle: 'Cartoon & festival character suits', icon: '🎭' }
    ]
  },

  // 23. Kitchen & Catering Equipment
  {
    id: 'kitchen-catering-eq',
    name: 'Kitchen & Catering Equipment',
    slug: 'kitchen-catering-equipment',
    icon: '🍳',
    description: 'Commercial cookers, chafing dishes, buffet sets & cutlery',
    aliases: ['chafing dish', 'buffet', 'catering plates', 'commercial cooker', 'cutlery', 'soup kettle'],
    subcategories: [
      { id: 'chafing-dish', name: 'Chafing Dishes & Buffet Warmers', subtitle: 'Stainless steel food warmers', icon: '🍲' },
      { id: 'plates-cutlery', name: 'Plates, Glasses & Cutlery', subtitle: 'Dinnerware sets for large functions', icon: '🍽️' },
      { id: 'commercial-cooker-rent', name: 'Commercial Burner & Stoves', subtitle: 'High pressure catering burners', icon: '🔥' },
      { id: 'drink-dispenser', name: 'Beverage & Juice Dispensers', subtitle: 'Cold drink & tea urn machines', icon: '🧃' },
      { id: 'bbq-catering', name: 'Catering BBQ Equipment', subtitle: 'Large function charcoal roasters', icon: '🍖' }
    ]
  },

  // 24. Pet Equipment
  {
    id: 'pet-equipment',
    name: 'Pet Equipment',
    slug: 'pet-equipment',
    icon: '🐾',
    description: 'Pet cages, carriers, travel crates, strollers & grooming gear',
    aliases: ['dog cage', 'cat carrier', 'pet crate', 'pet stroller', 'grooming table', 'pet bed'],
    subcategories: [
      { id: 'pet-cage', name: 'Pet Cage & Crate', subtitle: 'Heavy duty steel & wire dog/cat cages', icon: '🐕' },
      { id: 'pet-carrier', name: 'Pet Carrier & Travel Box', subtitle: 'IATA airline approved travel carriers', icon: '🐱' },
      { id: 'pet-stroller', name: 'Pet Stroller', subtitle: 'Wheeled strollers for dogs & cats', icon: '🛒' },
      { id: 'pet-grooming-eq', name: 'Pet Grooming Equipment', subtitle: 'Clippers, blowers & grooming tables', icon: '✂️' },
      { id: 'pet-training-eq', name: 'Pet Training Equipment', subtitle: 'Agility hurdles and leashes', icon: '🎾' }
    ]
  },

  // 25. Musical Instruments & Audio
  {
    id: 'musical-audio',
    name: 'Musical Instruments & Audio',
    slug: 'musical-instruments-audio',
    icon: '🎸',
    description: 'Guitars, keyboards, drum kits, DJ controllers & amplifiers',
    aliases: ['guitar', 'keyboard', 'piano', 'drums', 'organ', 'amp', 'amplifier', 'violin'],
    subcategories: [
      { id: 'guitar', name: 'Guitar', subtitle: 'Acoustic, electric & bass guitars', icon: '🎸' },
      { id: 'keyboard-piano', name: 'Keyboard & Piano', subtitle: 'Yamaha, Roland keyboards & digital pianos', icon: '🎹' },
      { id: 'drum-set', name: 'Drum Set', subtitle: 'Acoustic drum kits & electronic drums', icon: '🥁' },
      { id: 'amplifiers', name: 'Amplifier & Mixers', subtitle: 'Marshall, Fender amps & audio mixers', icon: '📻' },
      { id: 'traditional-instruments', name: 'Traditional Instruments', subtitle: 'Geta beraya, thammattama, tabla & violins', icon: '🪘' }
    ]
  },

  // 26. Education & Study Equipment
  {
    id: 'education-study-eq',
    name: 'Education & Study Equipment',
    slug: 'education-study-equipment',
    icon: '📚',
    description: 'Whiteboards, podiums, science lab gear & classroom benches',
    aliases: ['whiteboard', 'podium', 'classroom chair', 'projector screen', 'microscope'],
    subcategories: [
      { id: 'whiteboard-podium', name: 'Whiteboard & Podium', subtitle: 'Magnetic mobile whiteboards & lecterns', icon: '📋' },
      { id: 'classroom-furniture', name: 'Study Chairs & Desks', subtitle: 'Lecture hall chairs with writing pad', icon: '🪑' },
      { id: 'lab-equipment', name: 'Science & Lab Equipment', subtitle: 'Microscopes & educational models', icon: '🔬' }
    ]
  },

  // 27. Other Rental Items
  {
    id: 'other-rentals',
    name: 'Other Rental Items',
    slug: 'other-rental-items',
    icon: '📦',
    description: 'Miscellaneous specialty rental items and equipment',
    aliases: ['other', 'general rental', 'misc', 'custom items'],
    subcategories: [
      { id: 'general-misc-rent', name: 'General Rental Items', subtitle: 'Other items not listed above', icon: '📦' }
    ]
  }
];

export const RENTALS_POPULAR_SEARCHES = [
  { label: 'House for Rent', icon: '🏠', mainCatId: 'prop-rent', subCatId: 'houses', thirdLevelId: 'whole-house' },
  { label: 'Room for Rent', icon: '🛏️', mainCatId: 'rooms-acc', subCatId: 'single-room' },
  { label: 'Car for Rent', icon: '🚗', mainCatId: 'vehicles', subCatId: 'cars', thirdLevelId: 'car-sedan' },
  { label: 'Wedding Hall', icon: '💒', mainCatId: 'event-rentals', subCatId: 'wedding-hall' },
  { label: 'Construction Equipment', icon: '🏗️', mainCatId: 'construction-eq', subCatId: 'generators-const' }
];
