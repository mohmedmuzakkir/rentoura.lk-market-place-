import { MainCategoryData } from '../categorySelectorData';

export const SERVICES_CATEGORIES: MainCategoryData[] = [
  // 1. Home Services
  {
    id: 'home-services',
    name: 'Home Services',
    slug: 'home-services',
    icon: '🏠',
    description: 'Plumbing, electrical, carpentry, painting, gardening, pest control & handyman',
    aliases: ['handyman', 'carpenter', 'painter', 'mason', 'gardening', 'pest control', 'cctv', 'solar', 'water tank', 'house repair'],
    subcategories: [
      { 
        id: 'plumbing-home', 
        name: 'Plumbing', 
        subtitle: 'Pipe leaks, taps, pumps & drainage fixes', 
        icon: '🚰', 
        aliases: ['plumber', 'pipe', 'tap', 'water leak'],
        thirdLevelOptions: [
          { id: 'plumbing-pipe-leak', name: 'Pipe Leak & Burst Line Repair', subtitle: 'Concealed & surface pipe leak fixing', icon: '💧' },
          { id: 'plumbing-tap-fitting', name: 'Tap & Mixer Fitting', subtitle: 'Sink, basin & shower mixer installation', icon: '🚰' },
          { id: 'plumbing-drain-unblock', name: 'Drain & Trap Unblocking', subtitle: 'Sinks, floor gullies & trap cleaning', icon: '🕳️' },
          { id: 'plumbing-water-pump-home', name: 'Water Pump & Tank Hookup', subtitle: 'Pressure pumps, float valves & tank plumbing', icon: '⚙️' }
        ]
      },
      { 
        id: 'electrical-home', 
        name: 'Electrical', 
        subtitle: 'House wiring, switches, trips & lighting', 
        icon: '⚡', 
        aliases: ['electrician', 'wiring', 'tripping', 'short circuit'],
        thirdLevelOptions: [
          { id: 'electrical-house-wiring-sub', name: 'House Wiring & Conduit', subtitle: 'New point wiring & rewiring work', icon: '⚡' },
          { id: 'electrical-trips-faults', name: 'Breaker Trips & Short Circuit Fix', subtitle: 'RCCB/MCB tripping & emergency electrical fix', icon: '⚡' },
          { id: 'electrical-switch-sockets', name: 'Switch, Sockets & DB Board', subtitle: 'Wall sockets, main switches & distribution board', icon: '🎛️' },
          { id: 'electrical-lights-fans-sub', name: 'Lights & Fan Installation', subtitle: 'LED downlights, chandeliers & ceiling fans', icon: '💡' }
        ]
      },
      { 
        id: 'carpentry-home', 
        name: 'Carpentry', 
        subtitle: 'Door fitting, lock repairs & timber woodwork', 
        icon: '🪚', 
        aliases: ['carpenter', 'wood work', 'door repair', 'lock'],
        thirdLevelOptions: [
          { id: 'carpentry-door-lock-fix', name: 'Door Fitting & Lock Repair', subtitle: 'Wooden door hanging, mortise locks & handles', icon: '🚪' },
          { id: 'carpentry-furniture-repair-sub', name: 'Furniture Repair & Polish', subtitle: 'Teak/mahogany furniture restoration & varnish', icon: '🛋️' },
          { id: 'carpentry-cupboards-shelves', name: 'Pantry Cupboards & Shelves', subtitle: 'Custom pantry cabinets, wardrobes & shelving', icon: '🪚' }
        ]
      },
      { 
        id: 'painting-home', 
        name: 'Painting', 
        subtitle: 'Wall painting, weather-shield & interior putty', 
        icon: '🎨', 
        aliases: ['painter', 'wall paint', 'varnish'],
        thirdLevelOptions: [
          { id: 'painting-interior-putty', name: 'Interior Wall Painting & Putty', subtitle: 'Wall smoothing, primer & emulsion coats', icon: '🎨' },
          { id: 'painting-exterior-weather-sub', name: 'Exterior Weather-shield Painting', subtitle: 'High-durability outdoor wall coating', icon: '🏠' },
          { id: 'painting-wood-metal-varnish', name: 'Wood Varnish & Metal Enamel', subtitle: 'Doors, windows, gates & ironwork painting', icon: '🖌️' }
        ]
      },
      { 
        id: 'masonry-home', 
        name: 'Masonry', 
        subtitle: 'Plastering, brickwork, floor leveling & repairs', 
        icon: '🧱', 
        aliases: ['mason', 'plastering', 'brick'],
        thirdLevelOptions: [
          { id: 'masonry-wall-plaster', name: 'Wall Plastering & Render', subtitle: 'Smooth wall render & crack filling', icon: '🧱' },
          { id: 'masonry-brick-block', name: 'Brick & Block Work', subtitle: 'Boundary walls, partitions & masonry', icon: '🧱' },
          { id: 'masonry-concrete-floor', name: 'Concrete Floor & Leveling', subtitle: 'Sub-floor concrete & screed leveling', icon: '📐' }
        ]
      },
      { 
        id: 'tile-work-home', 
        name: 'Tile Work', 
        subtitle: 'Tile laying, re-grouting & bathroom tiling', 
        icon: '📐', 
        aliases: ['tiling', 'tile baass'],
        thirdLevelOptions: [
          { id: 'tile-floor-laying', name: 'Floor Tile Laying', subtitle: 'Porcelain & ceramic floor tiling', icon: '📐' },
          { id: 'tile-bathroom-wall', name: 'Bathroom & Kitchen Wall Tiling', subtitle: 'Waterproof wall tiling & border designs', icon: '🚿' },
          { id: 'tile-grout-repair', name: 'Tile Re-grouting & Repair', subtitle: 'Hollow tile fix & fresh tile grouting', icon: '🛠️' }
        ]
      },
      { 
        id: 'roofing-home', 
        name: 'Roofing', 
        subtitle: 'Roof leak sealing, gutters & ceiling repairs', 
        icon: '🏠', 
        aliases: ['roof leak', 'asbestos', 'roof repair'],
        thirdLevelOptions: [
          { id: 'roofing-leak-seal', name: 'Roof Leak Sealing & Waterproofing', subtitle: 'Silicone sealing, flashing & leak patch', icon: '🏠' },
          { id: 'roofing-gutter-clean-fix', name: 'Gutter & Downpipe Repair', subtitle: 'PVC/zinc gutters & downpipe cleaning', icon: '🌧️' },
          { id: 'roofing-tile-sheet-replace', name: 'Roof Tile & Sheet Replacement', subtitle: 'Amano sheets, asbestos & Calicut tile fix', icon: '🔨' }
        ]
      },
      { 
        id: 'gardening-home', 
        name: 'Gardening & Landscaping', 
        subtitle: 'Lawn mowing, tree trimming & garden design', 
        icon: '🌱', 
        aliases: ['gardener', 'lawn mowing', 'tree cutting'],
        thirdLevelOptions: [
          { id: 'gardening-lawn-mow', name: 'Lawn Mowing & Grass Trimming', subtitle: 'Turf cutting, weeding & lawn care', icon: '🌱' },
          { id: 'gardening-tree-pruning', name: 'Tree Pruning & Branch Trimming', subtitle: 'Overhanging branch cutting & shaping', icon: '🪓' },
          { id: 'gardening-[#]', name: 'Landscape Design & Planting', subtitle: 'Interlocking paving, flowerbeds & features', icon: '🏡' }
        ]
      },
      { 
        id: 'pest-control-home', 
        name: 'Pest Control', 
        subtitle: 'Termite (weyo), bedbug & rodent eradication', 
        icon: '🐜', 
        aliases: ['termites', 'weyo', 'cockroach', 'pest'],
        thirdLevelOptions: [
          { id: 'pest-termite-weyo', name: 'Termite / Weyo Soil Treatment', subtitle: 'Pre-construction & post-construction chemical barrier', icon: '🐜' },
          { id: 'pest-bedbug-cockroach-sub', name: 'Bedbug & Cockroach Fumigation', subtitle: 'Gel & spray treatment for indoor pests', icon: '🪲' },
          { id: 'pest-rodent-mosquito-sub', name: 'Rodent & Mosquito Control', subtitle: 'Bait stations & outdoor thermal fogging', icon: '🦟' }
        ]
      },
      { 
        id: 'handyman-home', 
        name: 'Handyman', 
        subtitle: 'Quick domestic fixes, drilling & wall mounting', 
        icon: '🛠️', 
        aliases: ['handyman', 'drilling', 'curtain rod'],
        thirdLevelOptions: [
          { id: 'handyman-tv-mount', name: 'TV & Mirror Wall Mounting', subtitle: 'Heavy-duty wall anchors, brackets & shelf fitting', icon: '📺' },
          { id: 'handyman-curtain-drilling', name: 'Curtain Rod & Blind Installation', subtitle: 'Masonry/tile drilling & curtain rail fitting', icon: '🛠️' },
          { id: 'handyman-quick-fixes', name: 'General Household Minor Repairs', subtitle: 'Door hinges, latches, hooks & small fixes', icon: '🔧' }
        ]
      },
      { 
        id: 'furniture-repair-home', 
        name: 'Furniture Repair', 
        subtitle: 'Couch reupholstering, polish & cane repair', 
        icon: '🛋️', 
        aliases: ['sofa repair', 'cushion work', 'polish'],
        thirdLevelOptions: [
          { id: 'furniture-sofa-upholstery', name: 'Sofa Re-upholstering & Cushioning', subtitle: 'Fabric/leather replacement & foam padding', icon: '🛋️' },
          { id: 'furniture-wood-french-polish', name: 'Wood French Polishing', subtitle: 'High-gloss lacquer & traditional teak polish', icon: '✨' },
          { id: 'furniture-cane-weaving', name: 'Cane & Rattan Weaving Repair', subtitle: 'Chair seat cane re-weaving & repair', icon: '🪑' }
        ]
      },
      { 
        id: 'cctv-install-home', 
        name: 'CCTV Installation', 
        subtitle: 'Home camera security setup & mobile view', 
        icon: '📹', 
        aliases: ['cctv', 'security camera'],
        thirdLevelOptions: [
          { id: 'cctv-camera-mounting', name: 'Camera Fitting & Cabling', subtitle: 'Indoor/outdoor IP & analog camera wiring', icon: '📹' },
          { id: 'cctv-nvr-mobile-config', name: 'DVR/NVR & Smartphone Setup', subtitle: 'Remote live viewing & motion alert config', icon: '📱' },
          { id: 'cctv-repair-maintenance', name: 'CCTV Troubleshooting & Repair', subtitle: 'Power supply, hard drive & offline fix', icon: '⚙️' }
        ]
      },
      { 
        id: 'solar-install-home', 
        name: 'Solar Installation', 
        subtitle: 'Rooftop on-grid/off-grid solar systems', 
        icon: '☀️', 
        aliases: ['solar power', 'solar panel', 'inverter'],
        thirdLevelOptions: [
          { id: 'solar-on-grid-system', name: 'On-Grid Net Metering Installation', subtitle: 'CEB/LECO approved rooftop solar setup', icon: '☀️' },
          { id: 'solar-off-grid-battery', name: 'Off-Grid & Battery Backup System', subtitle: 'Hybrid inverter & Lithium-ion storage', icon: '🔋' },
          { id: 'solar-panel-cleaning-sub', name: 'Solar Panel Wash & Maintenance', subtitle: 'Dust/bird drop cleaning & output check', icon: '🧼' }
        ]
      },
      { 
        id: 'water-tank-cleaning', 
        name: 'Water Tank Cleaning', 
        subtitle: 'Overhead & underground sump tank sanitation', 
        icon: '💧', 
        aliases: ['tank clean', 'water tank'],
        thirdLevelOptions: [
          { id: 'tank-overhead-scrub', name: 'Overhead Plastic/Concrete Tank Wash', subtitle: 'High-pressure wash & UV disinfection', icon: '💧' },
          { id: 'tank-underground-sump-clean', name: 'Underground Sump Tank Cleaning', subtitle: 'Sludge removal & water pump pipe flush', icon: '🕳️' }
        ]
      }
    ]
  },

  // 2. Home Appliance Repair
  {
    id: 'appliance-repair',
    name: 'Home Appliance Repair',
    slug: 'home-appliance-repair',
    icon: '🧊',
    description: 'Fridges, washing machines, microwaves, TVs, ovens & small appliance repair',
    aliases: ['fridge repair', 'washing machine repair', 'microwave repair', 'tv repair', 'gas cooker repair', 'ac repair', 'refrigerator'],
    subcategories: [
      { 
        id: 'refrigerator-repair', 
        name: 'Refrigerator Repair', 
        subtitle: 'Gas recharging, cooling issues & thermostats', 
        icon: '🧊', 
        aliases: ['fridge repair', 'freezer repair', 'gas filling'],
        thirdLevelOptions: [
          { id: 'fridge-gas-recharge', name: 'Gas Refilling & Leak Repair', subtitle: 'R600a/R134a refrigerant charging & copper welding', icon: '💨' },
          { id: 'fridge-compressor-replace', name: 'Compressor Repair & Replacement', subtitle: 'Relay, capacitor & motor compressor fix', icon: '⚙️' },
          { id: 'fridge-defrost-thermostat', name: 'No-Frost & Thermostat Repair', subtitle: 'Defrost timer, sensor & heater element fix', icon: '🌡️' }
        ]
      },
      { 
        id: 'washing-machine-repair', 
        name: 'Washing Machine Repair', 
        subtitle: 'Motor, PCB board, drum & water drainage fix', 
        icon: '🧺', 
        aliases: ['washer repair', 'spin fix'],
        thirdLevelOptions: [
          { id: 'washer-pcb-board-fix', name: 'PCB Board & Electronics Repair', subtitle: 'Front load & top load motherboard repair', icon: '🎛️' },
          { id: 'washer-motor-spin-fix', name: 'Motor & Drive Belt Replacement', subtitle: 'Spinning noise, agitator & drum bearing fix', icon: '⚙️' },
          { id: 'washer-drain-valve-fix', name: 'Water Drain Pump & Valve Repair', subtitle: 'E2/E4 error code & drainage clogging fix', icon: '🚰' }
        ]
      },
      { 
        id: 'ac-repair-sub', 
        name: 'AC Repair & Service', 
        subtitle: 'Filter cleaning, gas filling & compressor fixes', 
        icon: '❄️', 
        aliases: ['ac service', 'aircon service', 'ac repair'],
        thirdLevelOptions: [
          { id: 'ac-chemical-wash-clean', name: 'Chemical Service & Deep Wash', subtitle: 'Evaporator coil, blower wheel & tray chemical clean', icon: '❄️' },
          { id: 'ac-gas-topup-sub', name: 'Gas Charging (R32 / R410A / R22)', subtitle: 'Gas pressure leak test & gas refill', icon: '💨' },
          { id: 'ac-[#]', name: 'Compressor & PCB Control Repair', subtitle: 'Inverter PCB repair & outdoor capacitor replacement', icon: '⚡' },
          { id: 'ac-install-relocate-sub', name: 'AC Installation & Dismantling', subtitle: 'Split AC wall mounting, piping & shifting', icon: '🛠️' }
        ]
      },
      { 
        id: 'tv-repair', 
        name: 'TV Repair', 
        subtitle: 'LED/LCD display backlight, motherboard & sound', 
        icon: '📺', 
        aliases: ['television repair', 'led repair', 'screen fix'],
        thirdLevelOptions: [
          { id: 'tv-backlight-strip-fix', name: 'LED Display Backlight Strip Replacement', subtitle: 'Sound working but no picture display fix', icon: '📺' },
          { id: 'tv-motherboard-power-board', name: 'Mainboard & Power Supply Board Repair', subtitle: 'No power LED, restarting & HDMI port fix', icon: '⚡' },
          { id: 'tv-panel-bonding-fix', name: 'Screen Panel & T-Con Board Fix', subtitle: 'Vertical lines, double image & display bonding', icon: '🖥️' }
        ]
      },
      { 
        id: 'microwave-repair', 
        name: 'Microwave Repair', 
        subtitle: 'Heating magnetron, turntable & electrical fixes', 
        icon: '🍲', 
        aliases: ['microwave fix', 'oven repair'],
        thirdLevelOptions: [
          { id: 'microwave-magnetron-fix', name: 'Magnetron & Heating Element Repair', subtitle: 'Not heating food & high voltage diode fix', icon: '🔥' },
          { id: 'microwave-touch-panel', name: 'Touchpad Panel & Door Switch Fix', subtitle: 'Buttons unresponsive & door latch repair', icon: '🎛️' }
        ]
      },
      { 
        id: 'cooker-stove-repair', 
        name: 'Cooker / Stove Repair', 
        subtitle: 'Gas leakage, burner clogging & induction repair', 
        icon: '🍳', 
        aliases: ['gas cooker', 'burner fix'],
        thirdLevelOptions: [
          { id: 'cooker-gas-burner-clean', name: 'Gas Stove Burner & Valve Repair', subtitle: 'Yellow flame, clogged jets & auto-ignition', icon: '🍳' },
          { id: 'cooker-induction-repair', name: 'Induction Cooktop Electronics Repair', subtitle: 'E0/E1 error codes & IGBT transistor fix', icon: '⚡' }
        ]
      },
      { 
        id: 'water-heater-repair', 
        name: 'Water Heater Repair', 
        subtitle: 'Geyser element replacement & thermostat repair', 
        icon: '🚿', 
        aliases: ['geyser repair', 'hot water'],
        thirdLevelOptions: [
          { id: 'water-heater-element', name: 'Heating Element & Anode Replacement', subtitle: 'Water not heating & scale removal', icon: '🚿' },
          { id: 'water-heater-thermostat', name: 'Thermostat & ELCB Safety Switch Fix', subtitle: 'Temperature sensor & breaker tripping fix', icon: '⚡' }
        ]
      },
      { 
        id: 'small-appliance-repair', 
        name: 'Small Appliance Repair', 
        subtitle: 'Blenders, irons, rice cookers & vacuum cleaners', 
        icon: '🔌', 
        aliases: ['blender repair', 'iron repair', 'rice cooker repair'],
        thirdLevelOptions: [
          { id: 'small-blender-grinder-fix', name: 'Blender & Grinder Motor Fix', subtitle: 'Coupling gear, carbon brush & jar blade fix', icon: '🔌' },
          { id: 'small-steam-iron-repair', name: 'Steam Iron & Rice Cooker Repair', subtitle: 'Thermal fuse, cord & element repair', icon: '⚡' },
          { id: 'small-vacuum-cleaner-fix', name: 'Vacuum Cleaner & Air Fryer Repair', subtitle: 'Suction motor, hose & heating coil repair', icon: '🌀' }
        ]
      }
    ]
  },

  // 3. Electrical Services
  {
    id: 'electrical-services',
    name: 'Electrical Services',
    slug: 'electrical-services',
    icon: '⚡',
    description: 'House wiring, 3-phase upgrades, generator servicing & panel boards',
    aliases: ['electrician', 'wiring', 'panel board', '3 phase', 'generator repair', 'earth wire'],
    subcategories: [
      { 
        id: 'house-wiring-full', 
        name: 'House & Building Wiring', 
        subtitle: 'New wiring, renovations & conduit work', 
        icon: '⚡',
        thirdLevelOptions: [
          { id: 'wiring-new-construction', name: 'New Building Point & Conduit Wiring', subtitle: 'Complete single-phase & 3-phase initial wiring', icon: '⚡' },
          { id: 'wiring-renovation-rewire', name: 'House Rewiring & Modernization', subtitle: 'Replacing old wire conduits & adding points', icon: '🔌' },
          { id: 'wiring-fault-finding-sub', name: 'Electrical Short Circuit & Leak Finder', subtitle: 'Megger testing & earth leakage localization', icon: '🔍' }
        ]
      },
      { 
        id: 'panel-breaker-service', 
        name: 'Breaker & Panel Board Fix', 
        subtitle: 'RCCB trips, main switches & distribution boards', 
        icon: '🎛️',
        thirdLevelOptions: [
          { id: 'panel-db-board-install', name: 'Distribution Board (DB) Assembly', subtitle: 'MCB, RCCB, busbar & surge protector wiring', icon: '🎛️' },
          { id: 'panel-tripping-troubleshoot', name: 'RCCB / Earth Trip Troubleshooting', subtitle: 'Fixing nuisance trips & earthing resistance', icon: '⚡' }
        ]
      },
      { 
        id: 'generator-service', 
        name: 'Generator Repair & Service', 
        subtitle: 'Standby diesel & petrol generator maintenance', 
        icon: '⚙️',
        thirdLevelOptions: [
          { id: 'gen-routine-service', name: 'Routine Engine Oil & Filter Change', subtitle: 'Spark plug, air filter & fuel line flush', icon: '⚙️' },
          { id: 'gen-ats-changeover-switch', name: 'ATS Automatic Changeover Switch', subtitle: 'Auto-start panel & mains transfer switch', icon: '🔌' }
        ]
      },
      { 
        id: 'lighting-fan-install', 
        name: 'Lighting & Fan Installation', 
        subtitle: 'Chandeliers, downlights & ceiling fans', 
        icon: '💡',
        thirdLevelOptions: [
          { id: 'light-chandelier-pendant', name: 'Chandelier & Feature Light Mounting', subtitle: 'Ceiling anchor & remote control light wiring', icon: '💡' },
          { id: 'fan-[#]', name: 'Ceiling Fan & Exhaust Fan Fitting', subtitle: 'Fan hook mounting, regulator & exhaust wiring', icon: '🌀' }
        ]
      }
    ]
  },

  // 4. Plumbing Services
  {
    id: 'plumbing-services',
    name: 'Plumbing Services',
    slug: 'plumbing-services',
    icon: '🚰',
    description: 'Leak detection, bathroom fittings, motor pumps and gully clearance',
    aliases: ['plumber', 'gully service', 'water pump repair', 'bathroom fitting', 'drain blockage'],
    subcategories: [
      { 
        id: 'leak-detection-fix', 
        name: 'Leak Detection & Pipe Repair', 
        subtitle: 'Concealed pipe leaks & burst line repair', 
        icon: '💧',
        thirdLevelOptions: [
          { id: 'leak-concealed-scan', name: 'Acoustic / Pressure Pipe Leak Testing', subtitle: 'Locating hidden wall/slab leaks without breaking', icon: '🔍' },
          { id: 'leak-pvc-pipe-joint', name: 'PVC & PE Pipe Joint Replacement', subtitle: 'Pressure pipe repairs & valve replacements', icon: '💧' }
        ]
      },
      { 
        id: 'sanitary-fitting', 
        name: 'Bathroom & Sanitary Fitting', 
        subtitle: 'Commodes, sinks, showers & mixer taps', 
        icon: '🚿',
        thirdLevelOptions: [
          { id: 'sanitary-commode-install', name: 'Commode & Bidet Installation', subtitle: 'Floor/wall-mounted commodes & flush valves', icon: '🚽' },
          { id: 'sanitary-shower-mixer-tap', name: 'Shower Panel & Basin Mixer Fitting', subtitle: 'Hot/cold water mixer taps & rain shower fitting', icon: '🚿' }
        ]
      },
      { 
        id: 'water-pump-service', 
        name: 'Water Pump Repair & Fitting', 
        subtitle: 'Pressure pumps, auto switches & motors', 
        icon: '⚙️',
        thirdLevelOptions: [
          { id: 'pump-motor-rewinding', name: 'Pump Motor Repair & Rewinding', subtitle: 'Impeller, seal & capacitor replacement', icon: '⚙️' },
          { id: 'pump-pressure-auto-switch', name: 'Automatic Pressure Controller Setup', subtitle: 'Constant water pressure pump system setup', icon: '🚰' }
        ]
      },
      { 
        id: 'drain-gully-cleaning', 
        name: 'Drain & Gully Unblocking', 
        subtitle: 'Sewerage line unblocking & gully service', 
        icon: '🕳️',
        thirdLevelOptions: [
          { id: 'drain-[#]', name: 'High-Pressure Sewerage Line Unblocking', subtitle: 'Spring snake & pressure jet pipe clearing', icon: '🕳️' },
          { id: 'drain-gully-suck-bowser', name: 'Gully Bowser Cesspit Clearance', subtitle: 'Septic tank & gully pit suction pumping', icon: '🚛' }
        ]
      }
    ]
  },

  // 5. AC & Refrigeration
  {
    id: 'ac-refrigeration',
    name: 'AC & Refrigeration',
    slug: 'ac-refrigeration',
    icon: '❄️',
    description: 'Air conditioning cleaning, installation, gas charging & cold room service',
    aliases: ['ac repair', 'air conditioner', 'ac service', 'cold room', 'refrigeration', 'ac gas'],
    subcategories: [
      { 
        id: 'ac-maintenance-service', 
        name: 'AC Cleaning & General Service', 
        subtitle: 'Chemical wash, blower cleaning & efficiency tune', 
        icon: '❄️', 
        aliases: ['ac service', 'chemical wash'],
        thirdLevelOptions: [
          { id: 'ac-routine-filter-clean', name: 'Routine Filter & Coil Cleaning', subtitle: 'Air filter wash, drain pipe flush & amp check', icon: '❄️' },
          { id: 'ac-full-chemical-overhaul', name: 'Full Chemical Dismantling Service', subtitle: 'Stripping indoor unit for deep chemical wash', icon: '🧼' }
        ]
      },
      { 
        id: 'ac-installation-move', 
        name: 'AC Installation & Relocation', 
        subtitle: 'New AC mounting & shifting between rooms', 
        icon: '🛠️',
        thirdLevelOptions: [
          { id: 'ac-new-unit-install', name: 'New Split AC Unit Installation', subtitle: 'Wall bracket, copper piping & outdoor mounting', icon: '🛠️' },
          { id: 'ac-[#]', name: 'AC Unmounting & Relocation', subtitle: 'Gas pump-down, removal & re-installation', icon: '📦' }
        ]
      },
      { 
        id: 'ac-gas-charge', 
        name: 'AC Gas Charging', 
        subtitle: 'R32, R410A refrigerant top-up & leak testing', 
        icon: '💨',
        thirdLevelOptions: [
          { id: 'ac-gas-leak-nitrogen-test', name: 'Nitrogen Pressure Leak Test', subtitle: 'Finding flare nut & copper coil micro-leaks', icon: '🔍' },
          { id: 'ac-gas-full-recharge', name: 'Full Refrigerant Gas Recharge', subtitle: 'Vacuuming system & precision gas charging', icon: '💨' }
        ]
      },
      { 
        id: 'commercial-cold-room', 
        name: 'Commercial Cold Room Service', 
        subtitle: 'Walk-in chillers, supermarket freezers', 
        icon: '🏢',
        thirdLevelOptions: [
          { id: 'cold-room-chiller-repair', name: 'Walk-in Chiller & Freezer Repair', subtitle: 'Defrost heater, evaporator & solenoid valves', icon: '🏢' },
          { id: 'cold-room-display-chiller', name: 'Supermarket Display Cabinet Service', subtitle: 'Open chiller & bottle cooler servicing', icon: '🧊' }
        ]
      }
    ]
  },

  // 6. Cleaning Services
  {
    id: 'cleaning-services',
    name: 'Cleaning Services',
    slug: 'cleaning-services',
    icon: '🧹',
    description: 'Deep house cleaning, sofa shampooing, water tank & commercial janitorial',
    aliases: ['cleaner', 'sofa cleaning', 'deep cleaning', 'carpet wash', 'janitorial', 'window clean'],
    subcategories: [
      { 
        id: 'deep-house-cleaning', 
        name: 'Deep House Cleaning', 
        subtitle: 'Move-in/move-out full home scrubbing & disinfection', 
        icon: '🏠', 
        aliases: ['house cleaning'],
        thirdLevelOptions: [
          { id: 'clean-move-in-out', name: 'Move-in / Move-out Home Cleaning', subtitle: 'Empty house thorough scrubbing, kitchen & bathrooms', icon: '🏠' },
          { id: 'clean-post-construction-home', name: 'Post-Construction Dust & Cement Scrub', subtitle: 'Paint spot removal, floor buffing & window wipe', icon: '🧹' }
        ]
      },
      { 
        id: 'sofa-carpet-shampoo', 
        name: 'Sofa & Carpet Shampooing', 
        subtitle: 'Fabric/leather steam cleaning & stain extraction', 
        icon: '🛋️', 
        aliases: ['sofa wash', 'carpet clean'],
        thirdLevelOptions: [
          { id: 'shampoo-sofa-set', name: 'Sofa & Armchair Shampooing', subtitle: 'Injection-extraction fabric stain cleaning', icon: '🛋️' },
          { id: 'shampoo-carpet-rug', name: 'Wall-to-Wall Carpet & Rug Wash', subtitle: 'Deep pile dirt extraction & odor removal', icon: '🛋️' }
        ]
      },
      { 
        id: 'commercial-janitorial', 
        name: 'Commercial & Office Cleaning', 
        subtitle: 'Daily/weekly office janitorial maintenance', 
        icon: '🏢',
        thirdLevelOptions: [
          { id: 'janitorial-daily-office', name: 'Daily / Weekly Office Janitorial Staff', subtitle: 'Desk wipe, trash clearing & restroom cleaning', icon: '🏢' },
          { id: 'janitorial-floor-buff-polish', name: 'Commercial Floor Scrubbing & Buffing', subtitle: 'Terrazzo, granite & tile machine polishing', icon: '✨' }
        ]
      },
      { 
        id: 'window-glass-cleaning', 
        name: 'Glass & Facade Cleaning', 
        subtitle: 'High-rise windows & exterior facade washing', 
        icon: '🪟',
        thirdLevelOptions: [
          { id: 'glass-window-interior-ext', name: 'Window & Showroom Glass Wipe', subtitle: 'Streak-free glass cleaning for shops & homes', icon: '🪟' },
          { id: 'glass-facade-high-rise', name: 'High-Rise Rope Access Facade Clean', subtitle: 'Spider-man facade cleaning & cladding wash', icon: '🏢' }
        ]
      }
    ]
  },

  // 7. Vehicle Services
  {
    id: 'vehicle-services',
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: '🚗',
    description: 'Car repair, mobile mechanic, AC repair, detailing, wash & towing breakdown',
    aliases: ['mechanic', 'car repair', 'car wash', 'auto electrical', 'towing', 'breakdown', 'tyre service', 'battery jump'],
    subcategories: [
      { 
        id: 'car-repair-serv', 
        name: 'Car Repair & Mechanical', 
        subtitle: 'Engine tune-up, brake service & suspension', 
        icon: '🚗', 
        aliases: ['mechanic', 'engine tune up', 'brakes'],
        thirdLevelOptions: [
          { id: 'mech-engine-tuneup-scan', name: 'Computer OBD Diagnostic & Engine Tune', subtitle: 'Scanner diagnostics, spark plugs & throttle clean', icon: '💻' },
          { id: 'mech-brake-pad-disc', name: 'Brake Pad Replacement & Disc Turning', subtitle: 'Brake shoe, fluid flush & caliper service', icon: '🛑' },
          { id: 'mech-suspension-rack-fix', name: 'Suspension, Rack & Shock Absorber', subtitle: 'Lower arms, rack ends & bushing replacement', icon: '🔧' }
        ]
      },
      { 
        id: 'motorcycle-repair-serv', 
        name: 'Motorcycle & Scooter Repair', 
        subtitle: 'Bike tuning, engine overhaul & oil changes', 
        icon: '🏍️', 
        aliases: ['bike mechanic'],
        thirdLevelOptions: [
          { id: 'bike-tuneup-oil-change', name: 'Bike General Service & Oil Change', subtitle: 'Chain lubing, carburetor tune & brake check', icon: '🏍️' },
          { id: 'bike-engine-overhaul-sub', name: 'Engine Overhaul & Piston Rings', subtitle: 'Full engine rebuilding & clutch plate fix', icon: '⚙️' }
        ]
      },
      { 
        id: 'three-wheel-repair-serv', 
        name: 'Three Wheeler Repair', 
        subtitle: 'Tuk-tuk tuning, 2-stroke/4-stroke servicing', 
        icon: '🛺',
        thirdLevelOptions: [
          { id: 'tuktuk-service-tune', name: 'Tuk-Tuk Engine Tune & Cable Fix', subtitle: 'Clutch/accelerator cable, brakes & oil change', icon: '🛺' }
        ]
      },
      { 
        id: 'auto-electrical-serv', 
        name: 'Auto Electrical & Battery', 
        subtitle: 'Starter motors, alternators & battery jumping', 
        icon: '⚡', 
        aliases: ['battery service', 'starter motor'],
        thirdLevelOptions: [
          { id: 'auto-battery-jumpstart-delivery', name: 'On-Demand Battery Jumpstart & Replacement', subtitle: 'Mobile doorstep battery delivery & installation', icon: '🔋' },
          { id: 'auto-starter-alternator-fix', name: 'Starter Motor & Alternator Repair', subtitle: 'Carbon brush, solenoid switch & rewinding', icon: '⚡' }
        ]
      },
      { 
        id: 'vehicle-ac-serv', 
        name: 'Vehicle AC Repair', 
        subtitle: 'Car AC gas charging, condenser & compressor fix', 
        icon: '❄️', 
        aliases: ['car ac'],
        thirdLevelOptions: [
          { id: 'car-ac-gas-charge-leak', name: 'Car AC Gas Refill & Cooling Fix', subtitle: 'Leak detection, evaporator coil & gas charging', icon: '❄️' },
          { id: 'car-ac-compressor-clutch', name: 'Compressor Clutch & Fan Service', subtitle: 'Condenser fan, expansion valve & belt replacement', icon: '⚙️' }
        ]
      },
      { 
        id: 'car-wash-detailing', 
        name: 'Car Wash & Detailing', 
        subtitle: 'Ceramic coating, cut & polish, interior shampoo', 
        icon: '✨', 
        aliases: ['car detailing', 'cut and polish'],
        thirdLevelOptions: [
          { id: 'detail-cut-polish-wax', name: '3-Step Body Cut, Polish & Ceramic Wax', subtitle: 'Swirl mark removal & paint protection', icon: '✨' },
          { id: 'detail-interior-deep-shampoo', name: 'Interior Deep Cleaning & Seat Shampoo', subtitle: 'Stain extraction from seats, carpet & ceiling', icon: '🧼' }
        ]
      },
      { 
        id: 'towing-roadside', 
        name: 'Towing & Roadside Breakdown', 
        subtitle: '24/7 flatbed recovery & breakdown assistance', 
        icon: '🛻', 
        aliases: ['towing', 'breakdown service'],
        thirdLevelOptions: [
          { id: 'towing-flatbed-recovery-sub', name: '24/7 Flatbed Tow Truck Service', subtitle: 'Safe vehicle transport islandwide', icon: '🛻' },
          { id: 'towing-roadside-flat-tyre', name: 'Roadside Flat Tyre & Fuel Assistance', subtitle: 'Mobile tyre change & emergency fuel drop', icon: '🛞' }
        ]
      },
      { 
        id: 'tyre-wheel-service', 
        name: 'Tyre & Wheel Alignment', 
        subtitle: 'Puncture repair, wheel balancing & tyre replacement', 
        icon: '🛞',
        thirdLevelOptions: [
          { id: 'tyre-wheel-alignment-balance', name: '3D Wheel Alignment & Balancing', subtitle: 'Computerized alignment & counterweighting', icon: '🛞' },
          { id: 'tyre-mobile-puncture-fix', name: 'Doorstep Puncture Repair', subtitle: 'Tubeless tyre patch & mushroom plug repair', icon: '🛠️' }
        ]
      }
    ]
  },

  // 8. Computer & Mobile
  {
    id: 'computer-mobile',
    name: 'Computer & Mobile',
    slug: 'computer-mobile',
    icon: '💻',
    description: 'Laptop repair, mobile screen replacement, data recovery & software setup',
    aliases: ['laptop repair', 'phone repair', 'mobile repair', 'screen replacement', 'data recovery', 'computer repair', 'windows install'],
    subcategories: [
      { 
        id: 'laptop-repair-serv', 
        name: 'Laptop Repair', 
        subtitle: 'Motherboard chip-level fix, display & hinges', 
        icon: '💻', 
        aliases: ['laptop fix', 'macbook repair'],
        thirdLevelOptions: [
          { id: 'laptop-motherboard-chiplevel', name: 'Chip-Level Motherboard Repair', subtitle: 'Short circuit, IC replacement & no-power fix', icon: '💻' },
          { id: 'laptop-screen-hinge-replace', name: 'Display Screen & Hinge Replacement', subtitle: 'Broken LCD, flex cable & casing repair', icon: '🖥️' }
        ]
      },
      { 
        id: 'desktop-repair-serv', 
        name: 'Desktop PC Repair', 
        subtitle: 'Hardware upgrades, power supply & custom builds', 
        icon: '🖥️',
        thirdLevelOptions: [
          { id: 'pc-custom-build-upgrade', name: 'Custom Gaming / Workstation PC Build', subtitle: 'GPU, RAM, SSD installation & liquid cooling', icon: '🖥️' },
          { id: 'pc-psu-motherboard-fix', name: 'Power Supply Unit (PSU) & RAM Fix', subtitle: 'Blue screen of death (BSOD) & boot failure fix', icon: '⚡' }
        ]
      },
      { 
        id: 'mobile-phone-repair-serv', 
        name: 'Mobile Phone Repair', 
        subtitle: 'Display screen, battery & charging port replacement', 
        icon: '📱', 
        aliases: ['phone repair', 'iphone repair', 'samsung repair'],
        thirdLevelOptions: [
          { id: 'mobile-screen-glass-replace', name: 'OLED Display & Glass Replacement', subtitle: 'Cracked screen glass bonding & original LCD', icon: '📱' },
          { id: 'mobile-battery-charging-port', name: 'Battery Replacement & Charging Port', subtitle: 'Draining battery, Type-C & Lightning port fix', icon: '🔋' }
        ]
      },
      { 
        id: 'printer-repair-serv', 
        name: 'Printer Repair & Ink Refill', 
        subtitle: 'Head cleaning, roller jam & toner cartridge refill', 
        icon: '🖨️',
        thirdLevelOptions: [
          { id: 'printer-head-clean-jam', name: 'Printhead Unblocking & Paper Jam Fix', subtitle: 'Epson, Canon, HP ink tank head flushing', icon: '🖨️' },
          { id: 'printer-toner-refill', name: 'Laser Printer Toner Cartridge Refill', subtitle: 'Black & color laser powder refill', icon: '⚙️' }
        ]
      },
      { 
        id: 'data-recovery-serv', 
        name: 'Data Recovery', 
        subtitle: 'Corrupted hard drives, SSDs & memory cards', 
        icon: '💾', 
        aliases: ['recover files', 'hard disk repair'],
        thirdLevelOptions: [
          { id: 'data-hdd-ssd-recovery', name: 'Hard Drive & SSD Data Recovery', subtitle: 'Formatted drive, deleted partition & raw disk', icon: '💾' },
          { id: 'data-[#]', name: 'Flash Drive & SD Card Recovery', subtitle: 'Corrupted USB drive & camera SD card recovery', icon: '🔍' }
        ]
      },
      { 
        id: 'software-os-setup', 
        name: 'Software & OS Installation', 
        subtitle: 'Windows 11/10, macOS, antivirus & drivers', 
        icon: '💿',
        thirdLevelOptions: [
          { id: 'sw-windows-mac-format', name: 'Windows 11 / macOS Clean Format', subtitle: 'Driver setup, Office suite & optimization', icon: '💿' },
          { id: 'sw-antivirus-malware', name: 'Virus & Ransomware Removal', subtitle: 'Deep system malware cleanup & security', icon: '🛡️' }
        ]
      },
      { 
        id: 'network-cctv-setup', 
        name: 'WiFi & Network Setup', 
        subtitle: 'Office LAN cabling, router & mesh WiFi configuration', 
        icon: '📡',
        thirdLevelOptions: [
          { id: 'net-router-mesh-wifi', name: 'Mesh WiFi & Router Coverage Extender', subtitle: 'Eliminating dead zones & high-speed Wi-Fi', icon: '📡' },
          { id: 'net-office-lan-cabling', name: 'Office CAT6 LAN Cabling & Patch Panel', subtitle: 'Structured network wiring & rack setup', icon: '🔌' }
        ]
      }
    ]
  },

  // 9. Business Services
  {
    id: 'business-services',
    name: 'Business Services',
    slug: 'business-services',
    icon: '💼',
    description: 'Company registration, HR, recruitment, office support and consulting',
    aliases: ['business consulting', 'company registration', 'hr consultancy', 'recruitment', 'translation', 'secretarial'],
    subcategories: [
      { 
        id: 'company-registration', 
        name: 'Company Registration (PVT LTD)', 
        subtitle: 'ROC incorporation, Form 1 & bank account support', 
        icon: '🏛️', 
        aliases: ['pvt ltd', 'business registration'],
        thirdLevelOptions: [
          { id: 'biz-pvt-ltd-incorporation', name: 'PVT LTD Company Incorporation', subtitle: 'Name approval, Form 1, Form 18, Form 19 & Articles', icon: '🏛️' },
          { id: 'biz-sole-proprietor-reg', name: 'Sole Proprietorship / Partnership Reg', subtitle: 'Provincial Department of Business Names reg', icon: '📑' }
        ]
      },
      { 
        id: 'business-consulting', 
        name: 'Business Consulting', 
        subtitle: 'Strategy, market research & feasibility studies', 
        icon: '📊',
        thirdLevelOptions: [
          { id: 'biz-feasibility-project-report', name: 'Bank Loan Feasibility Report & Proposal', subtitle: 'Financial projections & market viability study', icon: '📊' }
        ]
      },
      { 
        id: 'recruitment-hr-serv', 
        name: 'Recruitment & HR Services', 
        subtitle: 'Staff headhunting, payroll & HR management', 
        icon: '👥',
        thirdLevelOptions: [
          { id: 'hr-headhunting-placement', name: 'Staff Recruitment & Executive Search', subtitle: 'Candidate screening, interviews & headhunting', icon: '👥' },
          { id: 'hr-payroll-epf-etf', name: 'Payroll Management & EPF/ETF Filing', subtitle: 'Monthly salary slip processing & C-Form filing', icon: '💼' }
        ]
      },
      { 
        id: 'translation-serv', 
        name: 'Translation Services', 
        subtitle: 'Sworn & certified English/Sinhala/Tamil translation', 
        icon: '🗣️',
        thirdLevelOptions: [
          { id: 'trans-sworn-certified-legal', name: 'Sworn & Certified Legal Translation', subtitle: 'Birth certificates, marriage deeds & court docs', icon: '🗣️' }
        ]
      },
      { 
        id: 'document-prep-serv', 
        name: 'Document & Tender Preparation', 
        subtitle: 'Business plans, profiles & project proposals', 
        icon: '📑',
        thirdLevelOptions: [
          { id: 'doc-tender-bid-preparation', name: 'Government & Corporate Tender Bids', subtitle: 'BOQ, technical proposal & bid documentation', icon: '📑' }
        ]
      }
    ]
  },

  // 10. Digital Services
  {
    id: 'digital-services',
    name: 'Digital Services',
    slug: 'digital-services',
    icon: '🌐',
    description: 'Web development, mobile apps, SEO, digital marketing & Google Ads',
    aliases: ['website', 'web design', 'app development', 'seo', 'social media marketing', 'digital marketing', 'google ads', 'meta ads'],
    subcategories: [
      { 
        id: 'web-development-serv', 
        name: 'Web Development', 
        subtitle: 'Custom business websites & corporate web apps', 
        icon: '🌐', 
        aliases: ['website design', 'web developer'],
        thirdLevelOptions: [
          { id: 'web-corporate-wordpress-site', name: 'Corporate WordPress / React Website', subtitle: 'Responsive 5-10 page company website', icon: '🌐' },
          { id: 'web-custom-web-application', name: 'Custom Full-Stack Web Application', subtitle: 'Tailored portal, CRM & admin dashboard', icon: '💻' }
        ]
      },
      { 
        id: 'ecommerce-setup-serv', 
        name: 'E-Commerce Website Setup', 
        subtitle: 'Shopify, WooCommerce, Payment Gateway (PayHere)', 
        icon: '🛒', 
        aliases: ['online shop', 'shopify'],
        thirdLevelOptions: [
          { id: 'ecom-shopify-woocommerce', name: 'Shopify / WooCommerce Online Store', subtitle: 'Product catalog, shopping cart & inventory', icon: '🛒' },
          { id: 'ecom-payment-gateway-payhere', name: 'PayHere / IPG Payment Gateway Integration', subtitle: 'Visa/Mastercard local payment gateway setup', icon: '💳' }
        ]
      },
      { 
        id: 'mobile-app-dev-serv', 
        name: 'Mobile App Development', 
        subtitle: 'iOS & Android custom native/Flutter mobile apps', 
        icon: '📱',
        thirdLevelOptions: [
          { id: 'app-flutter-cross-platform', name: 'Flutter / React Native Cross-Platform App', subtitle: 'Single codebase iOS & Android application', icon: '📱' }
        ]
      },
      { 
        id: 'seo-digital-serv', 
        name: 'SEO (Search Engine Optimization)', 
        subtitle: 'Rank #1 on Google search results in Sri Lanka', 
        icon: '🔍',
        thirdLevelOptions: [
          { id: 'seo-onpage-technical-local', name: 'On-Page & Technical Local SEO', subtitle: 'Keywords, meta tags, schema & speed optimization', icon: '🔍' },
          { id: 'seo-backlink-offpage-rank', name: 'High Authority Off-Page Backlinking', subtitle: 'Organic search ranking boosting packages', icon: '📈' }
        ]
      },
      { 
        id: 'social-media-marketing', 
        name: 'Social Media Management', 
        subtitle: 'Meta ads, Instagram & TikTok organic growth', 
        icon: '💬', 
        aliases: ['facebook ads', 'instagram marketing'],
        thirdLevelOptions: [
          { id: 'smm-facebook-instagram-management', name: 'Facebook & Instagram Page Management', subtitle: 'Monthly content calendar, graphic posts & reels', icon: '💬' }
        ]
      },
      { 
        id: 'google-meta-ads', 
        name: 'Google & YouTube Ads', 
        subtitle: 'Targeted pay-per-click search & display campaigns', 
        icon: '📢',
        thirdLevelOptions: [
          { id: 'ads-google-search-ppc', name: 'Google Search PPC & Display Ads', subtitle: 'High-converting search ad setup & optimization', icon: '📢' }
        ]
      }
    ]
  },

  // 11. Creative Services
  {
    id: 'creative-services',
    name: 'Creative Services',
    slug: 'creative-services',
    icon: '🎨',
    description: 'Graphic design, logo design, video editing, branding and animation',
    aliases: ['graphic design', 'logo design', 'video editing', 'animation', 'copywriting', 'branding', 'banner design'],
    subcategories: [
      { 
        id: 'logo-branding-serv', 
        name: 'Logo & Brand Identity', 
        subtitle: 'Unique vector logos, brand manuals & stationery', 
        icon: '✨', 
        aliases: ['logo maker', 'branding'],
        thirdLevelOptions: [
          { id: 'logo-vector-brand-package', name: 'Vector Logo Design & Guidelines', subtitle: 'Original minimalist logo with brand color palette', icon: '✨' }
        ]
      },
      { 
        id: 'graphic-design-serv', 
        name: 'Graphic Design', 
        subtitle: 'Flyers, brochures, social posts & packaging', 
        icon: '🎨', 
        aliases: ['photoshop', 'flyer design'],
        thirdLevelOptions: [
          { id: 'gd-social-media-artwork', name: 'Social Media Post & Banner Artwork', subtitle: 'High-converting Instagram & Facebook ad visuals', icon: '🎨' },
          { id: 'gd-brochure-flyer-packaging', name: 'Brochure, Flyer & Product Packaging', subtitle: 'Print-ready CMYK designs with die-lines', icon: '📦' }
        ]
      },
      { 
        id: 'ui-ux-design-serv', 
        name: 'UI/UX Design', 
        subtitle: 'Mobile app and web screen wireframes (Figma)', 
        icon: '📱',
        thirdLevelOptions: [
          { id: 'uiux-figma-mobile-web-prototype', name: 'Figma Mobile App & Web Screen UI', subtitle: 'Interactive wireframes & design systems', icon: '📱' }
        ]
      },
      { 
        id: 'video-editing-serv', 
        name: 'Video Editing', 
        subtitle: 'YouTube videos, reels, commercials & colour grading', 
        icon: '✂️', 
        aliases: ['video editor', 'tiktok editor'],
        thirdLevelOptions: [
          { id: 've-reels-shorts-tiktok-edit', name: 'Reels, Shorts & TikTok Fast Cuts', subtitle: 'Engaging captions, sound effects & transitions', icon: '✂️' },
          { id: 've-youtube-commercial-edit', name: 'YouTube & Commercial Video Editing', subtitle: '4K video cutting, audio levelling & color grading', icon: '🎬' }
        ]
      },
      { 
        id: 'animation-motion-serv', 
        name: 'Animation & Motion Graphics', 
        subtitle: '2D explainer videos, intro animations & 3D logos', 
        icon: '🎬',
        thirdLevelOptions: [
          { id: 'anim-2d-explainer-video', name: '2D Animated Product Explainer Video', subtitle: 'Custom voiceover, script & character animation', icon: '🎬' }
        ]
      },
      { 
        id: 'content-writing-serv', 
        name: 'Content & Copywriting', 
        subtitle: 'Compelling website copy, blogs & sales letters', 
        icon: '✍️',
        thirdLevelOptions: [
          { id: 'copy-website-sales-copy', name: 'Website Landing Page & Sales Copy', subtitle: 'High-converting marketing copy in English', icon: '✍️' }
        ]
      }
    ]
  },

  // 12. Photography & Videography
  {
    id: 'photo-video-services',
    name: 'Photography & Videography',
    slug: 'photography-videography',
    icon: '📷',
    description: 'Wedding photography, event shoots, product photography & drone shoots',
    aliases: ['photographer', 'videographer', 'wedding photo', 'drone shoot', 'product photoshoot', 'model shoot'],
    subcategories: [
      { 
        id: 'wedding-photography-serv', 
        name: 'Wedding Photography', 
        subtitle: 'Pre-shoots, wedding albums & bridal portraiture', 
        icon: '💒', 
        aliases: ['wedding shoot'],
        thirdLevelOptions: [
          { id: 'photo-wedding-full-day', name: 'Full Day Wedding Coverage & Album', subtitle: 'Poruwa, church/registration & reception photo package', icon: '💒' },
          { id: 'photo-pre-wedding-preshoot', name: 'Pre-Wedding & Engagement Shoot', subtitle: 'Outdoor romantic portrait session', icon: '📸' }
        ]
      },
      { 
        id: 'event-photography-serv', 
        name: 'Event Photography', 
        subtitle: 'Birthdays, corporate events & convocation shoots', 
        icon: '📸',
        thirdLevelOptions: [
          { id: 'photo-birthday-party-shoot', name: 'Birthday & Anniversary Event Shoot', subtitle: 'Candid event photos & instant soft copies', icon: '🎂' }
        ]
      },
      { 
        id: 'product-photography-serv', 
        name: 'Product & Food Photography', 
        subtitle: 'E-commerce studio photos & restaurant menus', 
        icon: '🛍️',
        thirdLevelOptions: [
          { id: 'photo-studio-ecom-product', name: 'White Background E-Commerce Studio Shoot', subtitle: 'Clean Amazon/Shopify product photos', icon: '🛍️' }
        ]
      },
      { 
        id: 'wedding-videography-serv', 
        name: 'Wedding Videography', 
        subtitle: 'Cinematic wedding trailers & full coverage', 
        icon: '🎥',
        thirdLevelOptions: [
          { id: 'video-cinematic-wedding-trailer', name: 'Cinematic Wedding Highlight Film', subtitle: 'Color graded 4K cinematic wedding film', icon: '🎥' }
        ]
      },
      { 
        id: 'drone-shoot-serv', 
        name: 'Drone Photography & Video', 
        subtitle: '4K aerial shoots for land, villas & events', 
        icon: '🛸', 
        aliases: ['drone video', 'aerial photo'],
        thirdLevelOptions: [
          { id: 'drone-aerial-property-land', name: 'Aerial Land & Real Estate Drone Shoot', subtitle: '4K property boundary videos & aerial photos', icon: '🛸' }
        ]
      },
      { 
        id: 'photo-retouching-serv', 
        name: 'Photo Editing & Album Design', 
        subtitle: 'Skin retouching, background removal & album printing', 
        icon: '🖼️',
        thirdLevelOptions: [
          { id: 'edit-skin-retouch-album', name: 'High-End Portrait Retouching & Album Layout', subtitle: 'Magazine skin smoothing & storybook album design', icon: '🖼️' }
        ]
      }
    ]
  },

  // 13. Education & Tutoring
  {
    id: 'education-tutoring-serv',
    name: 'Education & Tutoring',
    slug: 'education-tutoring',
    icon: '📚',
    description: 'Maths, science, English, music, ICT and language private classes',
    aliases: ['tuition', 'tutor', 'maths tuition', 'science tuition', 'english class', 'ielts', 'piano lessons', 'sinhala class'],
    subcategories: [
      { 
        id: 'maths-tuition', 
        name: 'Maths Tuition', 
        subtitle: 'Grade 6-11 O/L & Combined Maths A/L', 
        icon: '📐',
        thirdLevelOptions: [
          { id: 'tut-ol-maths-class', name: 'O/L Mathematics Individual / Group Class', subtitle: 'Past paper revision & syllabus coverage', icon: '📐' },
          { id: 'tut-al-combined-maths', name: 'A/L Combined Mathematics (Pure & Applied)', subtitle: 'Theory & revision for Cambridge/Edexcel & Local A/L', icon: '📐' }
        ]
      },
      { 
        id: 'science-tuition', 
        name: 'Science Tuition', 
        subtitle: 'O/L Science, A/L Physics, Chemistry & Biology', 
        icon: '🔬',
        thirdLevelOptions: [
          { id: 'tut-al-physics-chemistry', name: 'A/L Physics & Chemistry Individual Class', subtitle: 'Practicals, theory & paper class', icon: '🔬' }
        ]
      },
      { 
        id: 'english-ielts-tuition', 
        name: 'English & IELTS Classes', 
        subtitle: 'Spoken English, grammar & IELTS preparation', 
        icon: '🗣️', 
        aliases: ['ielts', 'spoken english'],
        thirdLevelOptions: [
          { id: 'tut-ielts-academic-general', name: 'IELTS Academic & General Training Prep', subtitle: 'Speaking, writing, reading & listening mock tests', icon: '🗣️' }
        ]
      },
      { 
        id: 'ict-coding-tuition', 
        name: 'ICT & Coding Classes', 
        subtitle: 'School ICT syllabus & Python/Web programming', 
        icon: '💻',
        thirdLevelOptions: [
          { id: 'tut-python-web-coding-kids', name: 'Python & Web Development Coding Class', subtitle: 'Beginner programming for kids & teens', icon: '💻' }
        ]
      },
      { 
        id: 'accounting-tuition', 
        name: 'Accounting & Commerce Tuition', 
        subtitle: 'O/L & A/L Business studies & accounting', 
        icon: '📊',
        thirdLevelOptions: [
          { id: 'tut-al-accounting-commerce', name: 'A/L Accounting & Business Studies', subtitle: 'English & Sinhala medium paper classes', icon: '📊' }
        ]
      },
      { 
        id: 'music-instrument-classes', 
        name: 'Music & Instrument Lessons', 
        subtitle: 'Guitar, keyboard, violin & vocal training', 
        icon: '🎸',
        thirdLevelOptions: [
          { id: 'tut-guitar-keyboard-class', name: 'Guitar & Piano Keyboard Lessons', subtitle: 'Chords, sight reading & practical songs', icon: '🎸' }
        ]
      },
      { 
        id: 'language-classes', 
        name: 'Foreign Language Classes', 
        subtitle: 'Korean (EPS), Japanese (JLPT), French, Tamil', 
        icon: '🌍',
        thirdLevelOptions: [
          { id: 'tut-korean-eps-topik', name: 'Korean EPS-TOPIK Exam Preparation', subtitle: 'Specialized coaching for Korean job exam', icon: '🇰🇷' },
          { id: 'tut-japanese-jlpt-n5-n4', name: 'Japanese JLPT N5 / N4 Language Class', subtitle: 'Hiragana, Katakana, Kanji & conversation', icon: '🇯🇵' }
        ]
      }
    ]
  },

  // 14. Event Services
  {
    id: 'event-services',
    name: 'Event Services',
    slug: 'event-services',
    icon: '🎉',
    description: 'Event planning, wedding coordinators, DJ, sound, catering & decoration',
    aliases: ['wedding planner', 'dj service', 'sound system', 'catering', 'event coordinator', 'florist', 'mc', 'magician'],
    subcategories: [
      { 
        id: 'event-wedding-planning', 
        name: 'Event & Wedding Planning', 
        subtitle: 'Full coordination, vendor management & scheduling', 
        icon: '📋',
        thirdLevelOptions: [
          { id: 'event-wedding-coordinator-full', name: 'Full Wedding & Event Day Coordination', subtitle: 'Roster management, vendor sync & floor management', icon: '📋' }
        ]
      },
      { 
        id: 'event-decorations-serv', 
        name: 'Decorations & Stage Setup', 
        subtitle: 'Theme backdrops, floral poruwa & balloon arches', 
        icon: '💐',
        thirdLevelOptions: [
          { id: 'decor-poruwa-floral-wedding', name: 'Traditional Poruwa & Floral Hall Decor', subtitle: 'Fresh flower arrangements & head table decor', icon: '💐' }
        ]
      },
      { 
        id: 'dj-music-service', 
        name: 'DJ & Sound System Service', 
        subtitle: 'Club/wedding DJs with bass lighting setups', 
        icon: '🎧', 
        aliases: ['dj', 'sound service'],
        thirdLevelOptions: [
          { id: 'dj-wedding-party-sound-light', name: 'Wedding Party DJ & Intelligent Lighting', subtitle: 'Subwoofers, moving heads & bilingual party DJ', icon: '🎧' }
        ]
      },
      { 
        id: 'catering-event-serv', 
        name: 'Catering & Buffet Service', 
        subtitle: 'Rice & curry, fried rice, BBQ & dessert buffets', 
        icon: '🍽️',
        thirdLevelOptions: [
          { id: 'cater-buffet-rice-curry-party', name: 'Sri Lankan & Chinese Buffet Catering', subtitle: 'Menu selections with cutlery & waitstaff', icon: '🍽️' }
        ]
      },
      { 
        id: 'custom-cake-making', 
        name: 'Cake Making & Pastries', 
        subtitle: 'Wedding structures, birthday & customized fondant cakes', 
        icon: '🎂',
        thirdLevelOptions: [
          { id: 'cake-custom-fondant-wedding', name: 'Customized Fondant & Wedding Cakes', subtitle: 'Multi-tiered wedding structures & birthday cakes', icon: '🎂' }
        ]
      },
      { 
        id: 'mc-presenter-serv', 
        name: 'MC & Announcer', 
        subtitle: 'Bilingual masters of ceremony (Sinhala/English/Tamil)', 
        icon: '🎙️',
        thirdLevelOptions: [
          { id: 'mc-bilingual-wedding-corporate', name: 'Bilingual Event Host & MC', subtitle: 'Warm protocol handling for weddings & galas', icon: '🎙️' }
        ]
      }
    ]
  },

  // 15. Beauty & Personal Care
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    icon: '💇',
    description: 'Haircuts, bridal makeup, nail art, facials, massage & mehendi',
    aliases: ['salon', 'haircut', 'bridal makeup', 'facial', 'massage', 'mehendi', 'manicure', 'barber'],
    subcategories: [
      { 
        id: 'haircut-styling-serv', 
        name: 'Haircut & Styling', 
        subtitle: 'Gents & ladies haircuts, rebonding & keratin', 
        icon: '✂️',
        thirdLevelOptions: [
          { id: 'hair-rebonding-keratin-treatment', name: 'Hair Rebonding, Keratin & Color', subtitle: 'Smooth hair straightening & highlights', icon: '✂️' }
        ]
      },
      { 
        id: 'bridal-makeup-serv', 
        name: 'Bridal Dressing & Makeup', 
        subtitle: 'Kandyan, Indian & Western bridal dressing', 
        icon: '💄', 
        aliases: ['bridal dressing', 'makeup'],
        thirdLevelOptions: [
          { id: 'bridal-kandyan-western-dressing', name: 'Kandyan & Western Bridal Dressing Package', subtitle: 'Hair, makeup, saree drape & jewelry set', icon: '💄' }
        ]
      },
      { 
        id: 'facial-skin-care', 
        name: 'Facial & Skin Treatments', 
        subtitle: 'Gold facials, cleanup, acne & skin brightening', 
        icon: '💆',
        thirdLevelOptions: [
          { id: 'facial-gold-herbal-cleanup', name: 'Gold & Herbal Facial Cleanup', subtitle: 'Deep pore cleansing, blackhead extraction & mask', icon: '💆' }
        ]
      },
      { 
        id: 'nail-art-manicure', 
        name: 'Nail Art & Pedicure', 
        subtitle: 'Gel nails, acrylic extensions & foot spa', 
        icon: '💅',
        thirdLevelOptions: [
          { id: 'nail-gel-acrylic-extensions', name: 'Gel Polish & Acrylic Nail Extensions', subtitle: 'Custom nail art designs & foot pedicure spa', icon: '💅' }
        ]
      },
      { 
        id: 'mehendi-henna-serv', 
        name: 'Mehendi & Henna Art', 
        subtitle: 'Intricate bridal & party henna patterns', 
        icon: '✨',
        thirdLevelOptions: [
          { id: 'henna-bridal-mehendi-design', name: 'Bridal Mehendi & Henna Art', subtitle: 'Traditional Indian & Arabic henna patterns', icon: '✨' }
        ]
      },
      { 
        id: 'home-salon-service', 
        name: 'Home Salon Service', 
        subtitle: 'Doorstep beauty services for ladies', 
        icon: '🏠',
        thirdLevelOptions: [
          { id: 'salon-doorstep-ladies-beauty', name: 'Doorstep Ladies Beauty & Waxing Service', subtitle: 'Threading, waxing, facials at home convenience', icon: '🏠' }
        ]
      }
    ]
  },

  // 16. Health & Wellness
  {
    id: 'health-wellness-serv',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    icon: '🧘',
    description: 'Personal fitness trainers, yoga, home nursing, physiotherapy & wellness',
    aliases: ['fitness trainer', 'yoga', 'home nursing', 'physiotherapy', 'caregiver', 'gym trainer'],
    subcategories: [
      { 
        id: 'personal-trainer-serv', 
        name: 'Personal Trainer & Fitness Coach', 
        subtitle: 'Weight loss, muscle gain & home workouts', 
        icon: '🏋️',
        thirdLevelOptions: [
          { id: 'fit-home-personal-trainer', name: 'Home Personal Fitness Coaching', subtitle: 'One-on-one weight loss & body transformation', icon: '🏋️' }
        ]
      },
      { 
        id: 'yoga-instructor-serv', 
        name: 'Yoga Instructor', 
        subtitle: 'Hatha yoga, meditation & stress relief sessions', 
        icon: '🧘',
        thirdLevelOptions: [
          { id: 'yoga-meditation-home-session', name: 'Private Yoga & Breathing Session', subtitle: 'Stress relief, flexibility & mindfulness', icon: '🧘' }
        ]
      },
      { 
        id: 'physiotherapy-service', 
        name: 'Physiotherapy (Home Visits)', 
        subtitle: 'Post-surgery recovery & musculoskeletal rehab', 
        icon: '🏃',
        thirdLevelOptions: [
          { id: 'physio-home-visit-rehab', name: 'Home Visit Physiotherapy & Stroke Rehab', subtitle: 'Pain management, mobility & exercise therapy', icon: '🏃' }
        ]
      },
      { 
        id: 'home-nursing-service', 
        name: 'Home Nursing & Elder Care', 
        subtitle: 'Qualified nurses for bedridden & elderly care', 
        icon: '🩺', 
        aliases: ['caregiver', 'elder care'],
        thirdLevelOptions: [
          { id: 'nurse-fulltime-elderly-care', name: 'Full-Time Elderly Caregiver & Home Nurse', subtitle: 'Vital monitoring, medication administration & hygiene', icon: '🩺' }
        ]
      }
    ]
  },

  // 17. Delivery & Moving
  {
    id: 'delivery-moving-serv',
    name: 'Delivery & Moving',
    slug: 'delivery-moving',
    icon: '🚚',
    description: 'House moving, office shifting, lorry transport, courier & goods delivery',
    aliases: ['house moving', 'lorry hire', 'goods transport', 'courier', 'delivery service', 'packing service'],
    subcategories: [
      { 
        id: 'house-moving-serv', 
        name: 'House Moving & Shifting', 
        subtitle: 'Packing, loading, transit & furniture reassembly', 
        icon: '📦', 
        aliases: ['movers', 'house shift'],
        thirdLevelOptions: [
          { id: 'move-house-relocation-package', name: 'Turnkey House Shifting Package', subtitle: 'Bubble wrapping, loading, transport & unloading', icon: '📦' }
        ]
      },
      { 
        id: 'office-moving-serv', 
        name: 'Office Relocation', 
        subtitle: 'IT equipment, files & office furniture shifting', 
        icon: '🏢',
        thirdLevelOptions: [
          { id: 'move-office-it-furniture', name: 'Office Furniture & Server Shifting', subtitle: 'Systematic desk & IT rack relocation', icon: '🏢' }
        ]
      },
      { 
        id: 'lorry-goods-transport', 
        name: 'Lorry & Truck Hire (with Driver)', 
        subtitle: 'Dimo Batta, Canter & heavy lorries for hire', 
        icon: '🚛', 
        aliases: ['lorry hire', 'dimo batta'],
        thirdLevelOptions: [
          { id: 'lorry-dimo-batta-hire', name: 'Dimo Batta / Small Truck Hire', subtitle: 'Quick city goods transport with driver', icon: '🚛' },
          { id: 'lorry-14.5ft-canter-hire', name: '14.5ft Canter / Heavy Lorry Transport', subtitle: 'Covered lorry for furniture & factory goods', icon: '🚛' }
        ]
      },
      { 
        id: 'courier-express-delivery', 
        name: 'Express Courier & Parcel Delivery', 
        subtitle: 'Same day city delivery & islandwide packages', 
        icon: '🛵',
        thirdLevelOptions: [
          { id: 'courier-same-day-city-bike', name: 'Same-Day Motorbike Express Courier', subtitle: 'Documents & urgent package city delivery', icon: '🛵' }
        ]
      }
    ]
  },

  // 18. Construction Services
  {
    id: 'construction-services',
    name: 'Construction Services',
    slug: 'construction-services',
    icon: '🏗️',
    description: 'House construction, renovation, roofing, aluminium & architectural plans',
    aliases: ['house construction', 'builder', 'renovation', 'aluminium work', 'ceiling work', 'contractor'],
    subcategories: [
      { 
        id: 'full-house-construction', 
        name: 'House Construction (Turnkey)', 
        subtitle: 'Foundation to finish turnkey house building', 
        icon: '🏠', 
        aliases: ['contractor', 'builder'],
        thirdLevelOptions: [
          { id: 'const-turnkey-house-building', name: 'Turnkey Residential Construction', subtitle: 'Architectural drawings, structural build & finishes', icon: '🏠' }
        ]
      },
      { 
        id: 'home-renovation-ext', 
        name: 'Home Renovation & Extensions', 
        subtitle: 'Adding floors, modernizing kitchens & remodels', 
        icon: '🔨',
        thirdLevelOptions: [
          { id: 'const-floor-addition-remodel', name: 'Upper Floor Extension & Kitchen Remodel', subtitle: 'Structural modifications & home extension', icon: '🔨' }
        ]
      },
      { 
        id: 'aluminium-fabrication', 
        name: 'Aluminium Doors & Windows', 
        subtitle: 'Aluminium partitions, sliding doors & windows', 
        icon: '🪟', 
        aliases: ['aluminium work'],
        thirdLevelOptions: [
          { id: 'alum-sliding-window-door', name: 'Aluminium Sliding Doors & Windows', subtitle: 'Powder-coated aluminium frames & tempered glass', icon: '🪟' }
        ]
      },
      { 
        id: 'ceiling-plaster-work', 
        name: 'Ceiling Work (i-Panel / Gypsum)', 
        subtitle: 'Modern gypsum board & PVC i-panel ceilings', 
        icon: '🏛️',
        thirdLevelOptions: [
          { id: 'ceil-gypsum-board-ipanel', name: 'Gypsum Board & PVC i-Panel Ceiling', subtitle: 'Concealed LED strip ceiling design & installation', icon: '🏛️' }
        ]
      },
      { 
        id: 'steel-welding-gate', 
        name: 'Steel Fabrication & Gates', 
        subtitle: 'Remote roller doors, wrought iron gates & grills', 
        icon: '🔥', 
        aliases: ['welding', 'roller gate'],
        thirdLevelOptions: [
          { id: 'steel-remote-roller-gate', name: 'Automated Remote Roller Door & Gate', subtitle: 'Elcardo/custom roller shutter installation & repair', icon: '🔥' }
        ]
      }
    ]
  },

  // 19. Repair & Maintenance
  {
    id: 'repair-maintenance-serv',
    name: 'Repair & Maintenance',
    slug: 'repair-maintenance',
    icon: '🔧',
    description: 'General equipment repair, welding, power tool maintenance & sharpening',
    aliases: ['repair', 'tool repair', 'welding repair', 'maintenance', 'generator repair'],
    subcategories: [
      { 
        id: 'general-equipment-repair', 
        name: 'General Equipment Repair', 
        subtitle: 'Pumps, motors, compressors & mechanical tools', 
        icon: '⚙️',
        thirdLevelOptions: [
          { id: 'rep-air-compressor-repair', name: 'Air Compressor & Industrial Pump Repair', subtitle: 'Pressure valve, piston & motor rewinding', icon: '⚙️' }
        ]
      },
      { 
        id: 'power-tool-repair-serv', 
        name: 'Power Tool Repair', 
        subtitle: 'Armatures, carbon brushes & drill servicing', 
        icon: '🪛',
        thirdLevelOptions: [
          { id: 'rep-drill-grinder-armature', name: 'Angle Grinder & Rotary Drill Repair', subtitle: 'Bosch, Makita armature & brush replacement', icon: '🪛' }
        ]
      }
    ]
  },

  // 20. Legal & Professional
  {
    id: 'legal-professional-serv',
    name: 'Legal & Professional',
    slug: 'legal-professional',
    icon: '⚖️',
    description: 'Lawyers, notary public, deed drafting, title search & documentation',
    aliases: ['lawyer', 'notary', 'deed', 'attorney', 'title search', 'legal consultation'],
    subcategories: [
      { 
        id: 'notary-deed-drafting', 
        name: 'Notary Public & Deed Drafting', 
        subtitle: 'Land deeds, gift deeds & title verification', 
        icon: '📑', 
        aliases: ['notary', 'deed'],
        thirdLevelOptions: [
          { id: 'legal-deed-transfer-gift', name: 'Land Deed of Transfer & Gift Deed', subtitle: 'Attesting land deeds & Land Registry registration', icon: '📑' }
        ]
      },
      { 
        id: 'legal-consultation-serv', 
        name: 'Legal Consultation', 
        subtitle: 'Civil, corporate, family & property disputes', 
        icon: '⚖️',
        thirdLevelOptions: [
          { id: 'legal-civil-property-attorney', name: 'Civil & Property Dispute Attorney', subtitle: 'Court representation & legal advice', icon: '⚖️' }
        ]
      },
      { 
        id: 'affidavit-documentation', 
        name: 'Affidavits & Power of Attorney', 
        subtitle: 'Notarized affidavits & legal attestations', 
        icon: '🖋️',
        thirdLevelOptions: [
          { id: 'legal-power-of-attorney-affidavit', name: 'Power of Attorney & Sworn Affidavits', subtitle: 'General/special power of attorney drafting', icon: '🖋️' }
        ]
      }
    ]
  },

  // 21. Accounting & Finance Services
  {
    id: 'accounting-finance-serv',
    name: 'Accounting & Finance Services',
    slug: 'accounting-finance-services',
    icon: '📊',
    description: 'Tax filing (RAMIS/VAT), bookkeeping, auditing and payroll outsourcing',
    aliases: ['tax return', 'vat', 'ramis', 'bookkeeping', 'audit', 'tax consultant'],
    subcategories: [
      { 
        id: 'tax-filing-consulting', 
        name: 'Tax Consultation & RAMIS Filing', 
        subtitle: 'Individual & company income tax, VAT, SSCL', 
        icon: '📑', 
        aliases: ['tax', 'ramis', 'vat'],
        thirdLevelOptions: [
          { id: 'tax-ramis-income-return', name: 'RAMIS Individual & Company Income Tax Return', subtitle: 'Inland Revenue Department electronic filing', icon: '📑' }
        ]
      },
      { 
        id: 'bookkeeping-outsourcing', 
        name: 'Bookkeeping & Management Accounts', 
        subtitle: 'Monthly QuickBooks/Xero ledger maintenance', 
        icon: '📒',
        thirdLevelOptions: [
          { id: 'acc-quickbooks-xero-bookkeeping', name: 'QuickBooks / Xero Monthly Bookkeeping', subtitle: 'Bank reconciliation & profit/loss statements', icon: '📒' }
        ]
      },
      { 
        id: 'financial-audit-support', 
        name: 'Audit & Financial Reports', 
        subtitle: 'Statutory audit preparation & financial statements', 
        icon: '🔍',
        thirdLevelOptions: [
          { id: 'audit-statutory-financial-report', name: 'Statutory Annual Financial Audit', subtitle: 'Chartered accountant audit report for ROC', icon: '🔍' }
        ]
      }
    ]
  },

  // 22. Real Estate Services
  {
    id: 'real-estate-services',
    name: 'Real Estate Services',
    slug: 'real-estate-services',
    icon: '🏘️',
    description: 'Property valuation, real estate brokers, property management and surveying',
    aliases: ['property broker', 'valuer', 'land surveyor', 'property management', 'broker'],
    subcategories: [
      { 
        id: 'property-valuation-serv', 
        name: 'Property Valuation (Chartered Valuer)', 
        subtitle: 'Bank loan valuations & court estimates', 
        icon: '📜', 
        aliases: ['valuer'],
        thirdLevelOptions: [
          { id: 'val-chartered-bank-valuation', name: 'Bank Loan Chartered Property Valuation', subtitle: 'Official valuation report for home mortgages', icon: '📜' }
        ]
      },
      { 
        id: 'land-surveying-serv', 
        name: 'Land Surveying (Licensed Surveyor)', 
        subtitle: 'Boundary demarcation, contour plans & sub-divisions', 
        icon: '📐',
        thirdLevelOptions: [
          { id: 'surv-cadastral-boundary-plan', name: 'Boundary Surveying & Cadastral Plan', subtitle: 'Licensed surveyor plan for land sale & sub-division', icon: '📐' }
        ]
      },
      { 
        id: 'real-estate-brokerage', 
        name: 'Real Estate Brokerage', 
        subtitle: 'Assistance in finding tenants & buyers', 
        icon: '🤝',
        thirdLevelOptions: [
          { id: 'broker-land-house-brokerage', name: 'Land & House Sales Assistance', subtitle: 'Connecting buyers & sellers with legal agreement help', icon: '🤝' }
        ]
      },
      { 
        id: 'property-management-serv', 
        name: 'Property & Rental Management', 
        subtitle: 'Rent collection, tenant vetting & property upkeep', 
        icon: '🔑',
        thirdLevelOptions: [
          { id: 'prop-absentee-landlord-management', name: 'Absentee Landlord Property Management', subtitle: 'Tenant inspection, rent collection & maintenance', icon: '🔑' }
        ]
      }
    ]
  },

  // 23. Travel & Tourism Services
  {
    id: 'travel-tourism-serv',
    name: 'Travel & Tourism Services',
    slug: 'travel-tourism',
    icon: '🌴',
    description: 'Tour packages, airport drops, visa consultation and hotel bookings',
    aliases: ['tour package', 'airport drop', 'visa', 'travel agent', 'round tour', 'safari'],
    subcategories: [
      { 
        id: 'airport-drop-pickup', 
        name: 'Airport Drop & Pickup', 
        subtitle: 'Fixed-price transfers to/from BIA Katunayake', 
        icon: '✈️', 
        aliases: ['airport drop'],
        thirdLevelOptions: [
          { id: 'tour-bia-airport-transfer-car', name: 'BIA Airport Car / Van Transfer', subtitle: 'Fixed fare highway air-conditioned car', icon: '✈️' }
        ]
      },
      { 
        id: 'sri-lanka-tour-packages', 
        name: 'Sri Lanka Tour Packages & Round Trips', 
        subtitle: 'Ella, Sigiriya, Kandy, Nuwara Eliya & beach tours', 
        icon: '🌴',
        thirdLevelOptions: [
          { id: 'tour-island-roundtrip-driver', name: 'Private Tourist Driver & Vehicle Package', subtitle: 'English-speaking driver for 3-14 day round trips', icon: '🌴' }
        ]
      },
      { 
        id: 'visa-consultation-serv', 
        name: 'Visa & Passport Assistance', 
        subtitle: 'Tourist, student & work visa application help', 
        icon: '🛂',
        thirdLevelOptions: [
          { id: 'visa-schengen-uk-student-help', name: 'Schengen / UK / Australia Visa Guidance', subtitle: 'Documentation check & appointment booking', icon: '🛂' }
        ]
      }
    ]
  },

  // 24. Pet Services
  {
    id: 'pet-services',
    name: 'Pet Services',
    slug: 'pet-services',
    icon: '🐾',
    description: 'Dog grooming, pet sitting, boarding, veterinary visits and dog training',
    aliases: ['dog grooming', 'pet boarding', 'dog training', 'vet', 'pet sitter'],
    subcategories: [
      { 
        id: 'pet-grooming-service', 
        name: 'Pet Grooming (Doorstep)', 
        subtitle: 'Bathing, fur trimming, nail clipping & tick baths', 
        icon: '✂️', 
        aliases: ['dog wash', 'grooming'],
        thirdLevelOptions: [
          { id: 'pet-mobile-dog-wash-trim', name: 'Doorstep Dog Bath & Fur Styling', subtitle: 'Tick treatment, ear cleaning & hair clipping', icon: '✂️' }
        ]
      },
      { 
        id: 'pet-boarding-daycare', 
        name: 'Pet Boarding & Daycare', 
        subtitle: 'Safe home kennel care while you travel', 
        icon: '🐕',
        thirdLevelOptions: [
          { id: 'pet-dog-kennel-boarding-night', name: 'Home Pet Boarding & Overnight Care', subtitle: 'Cageless environment with daily walkies', icon: '🐕' }
        ]
      },
      { 
        id: 'dog-training-service', 
        name: 'Dog Training & Obedience', 
        subtitle: 'Puppy obedience, guard training & potty habits', 
        icon: '🎾',
        thirdLevelOptions: [
          { id: 'pet-guard-obedience-trainer', name: 'Puppy Obedience & Guard Dog Trainer', subtitle: 'Leash walking, command training & social habituation', icon: '🎾' }
        ]
      }
    ]
  },

  // 25. Security Services
  {
    id: 'security-services',
    name: 'Security Services',
    slug: 'security-services',
    icon: '🛡️',
    description: 'Security guard deployment, commercial surveillance and VIP protection',
    aliases: ['security service', 'security guards', 'surveillance', 'bodyguard'],
    subcategories: [
      { 
        id: 'security-guard-supply', 
        name: 'Security Guard Deployment', 
        subtitle: 'Trained static & roving security officers', 
        icon: '👮',
        thirdLevelOptions: [
          { id: 'sec-commercial-residential-guard', name: '24/7 Commercial & Residential Security Guards', subtitle: 'Uniformed security personnel deployment', icon: '👮' }
        ]
      },
      { 
        id: 'vip-protection-service', 
        name: 'VIP Protection & Bodyguards', 
        subtitle: 'Close personal protection & event security', 
        icon: '🕶️',
        thirdLevelOptions: [
          { id: 'sec-vip-close-bodyguard', name: 'VIP Close Protection Officer (CPO)', subtitle: 'Personal escort & event crowd control', icon: '🕶️' }
        ]
      }
    ]
  },

  // 26. Agriculture Services
  {
    id: 'agriculture-services',
    name: 'Agriculture Services',
    slug: 'agriculture-services',
    icon: '🌾',
    description: 'Land clearing, paddy harvesting, tractor services and tree cutting',
    aliases: ['tree cutting', 'land clearing', 'tractor service', 'paddy harvesting', 'agriculture'],
    subcategories: [
      { 
        id: 'tree-cutting-felling', 
        name: 'Tree Cutting & Dangerous Branch Removal', 
        subtitle: 'Safe tree felling near houses & power lines', 
        icon: '🪓', 
        aliases: ['tree cutting'],
        thirdLevelOptions: [
          { id: 'agri-dangerous-tree-rope-felling', name: 'Dangerous Tree Sectional Rope Felling', subtitle: 'Safe dismantling of big coconut/jak trees near roofs', icon: '🪓' }
        ]
      },
      { 
        id: 'land-clearing-jcb', 
        name: 'Land Clearing & Earth Levelling', 
        subtitle: 'JCB earthmoving, jungle clearance & grading', 
        icon: '🚜',
        thirdLevelOptions: [
          { id: 'agri-jcb-excavator-clearing', name: 'JCB & Backhoe Excavator Land Clearing', subtitle: 'Root removal, land leveling & trenching', icon: '🚜' }
        ]
      },
      { 
        id: 'tractor-ploughing-service', 
        name: 'Tractor Ploughing & Harvesting', 
        subtitle: 'Field preparation & combine harvesting', 
        icon: '🌾',
        thirdLevelOptions: [
          { id: 'agri-paddy-combine-harvester', name: 'Paddy Field Combine Harvester Service', subtitle: 'Threshing, harvesting & bagging', icon: '🌾' }
        ]
      }
    ]
  },

  // 27. Printing & Advertising
  {
    id: 'printing-advertising',
    name: 'Printing & Advertising',
    slug: 'printing-advertising',
    icon: '🖨️',
    description: 'Banner printing, business cards, t-shirt printing, signage and flyers',
    aliases: ['printing', 'banner printing', 'business cards', 'tshirt printing', 'signboard', 'flyer printing'],
    subcategories: [
      { 
        id: 'banner-signage-printing', 
        name: 'Flex Banners & Signboards', 
        subtitle: 'Large format outdoor banners, lightboards & neon signs', 
        icon: '🖼️',
        thirdLevelOptions: [
          { id: 'print-outdoor-flex-banner', name: 'Outdoor Flex Banner Printing & Fitting', subtitle: 'High-res solvent printing & frame fitting', icon: '🖼️' }
        ]
      },
      { 
        id: 'business-card-stationery', 
        name: 'Business Cards & Leaflets', 
        subtitle: 'Offset & digital color card printing', 
        icon: '💳',
        thirdLevelOptions: [
          { id: 'print-visiting-card-matte-spot', name: 'Visiting Cards (Matte & Spot UV)', subtitle: '350gsm premium business card printing', icon: '💳' }
        ]
      },
      { 
        id: 'tshirt-mug-printing', 
        name: 'Custom T-Shirt & Gift Printing', 
        subtitle: 'Screen printing, embroidery & promotional gifts', 
        icon: '👕',
        thirdLevelOptions: [
          { id: 'print-tshirt-screen-sublimation', name: 'Custom Corporate T-Shirt Screen Printing', subtitle: 'Collared polo shirts, caps & promotional wear', icon: '👕' }
        ]
      }
    ]
  },

  // 28. Food & Catering
  {
    id: 'food-catering-services',
    name: 'Food & Catering',
    slug: 'food-catering',
    icon: '🍽️',
    description: 'Home cooks, daily meal tiffin delivery, event catering & barbecue service',
    aliases: ['catering', 'home cook', 'meal delivery', 'lunch packet', 'bbq service', 'cake maker'],
    subcategories: [
      { 
        id: 'daily-meal-delivery', 
        name: 'Daily Meal & Lunch Packet Delivery', 
        subtitle: 'Home-cooked healthy lunch & dinner subscriptions', 
        icon: '🍱', 
        aliases: ['lunch packet', 'tiffin'],
        thirdLevelOptions: [
          { id: 'food-home-cooked-lunch-tiffin', name: 'Home-Cooked Rice & Curry Lunch Packet', subtitle: 'Daily office/home delivery of Sri Lankan rice & curry', icon: '🍱' }
        ]
      },
      { 
        id: 'home-cook-event', 
        name: 'Home Cook / Party Cooking', 
        subtitle: 'On-site cooking for family gatherings & alms-givings', 
        icon: '🍳',
        thirdLevelOptions: [
          { id: 'food-alms-giving-party-cook', name: 'Alms-Giving & Family Event On-Site Cook', subtitle: 'Traditional Sinhala/Tamil feast cooking', icon: '🍳' }
        ]
      },
      { 
        id: 'bbq-catering-service', 
        name: 'BBQ & Live Food Stations', 
        subtitle: 'Live barbecue grill and hopper stations', 
        icon: '🍖',
        thirdLevelOptions: [
          { id: 'food-live-bbq-hopper-station', name: 'Live BBQ Grill & Hopper Catering Station', subtitle: 'Hot hoppers, kottu & grilled meats on-site', icon: '🍖' }
        ]
      }
    ]
  },

  // 29. Cleaning & Laundry
  {
    id: 'cleaning-laundry-serv',
    name: 'Cleaning & Laundry',
    slug: 'cleaning-laundry',
    icon: '🧺',
    description: 'Dry cleaning, laundry wash & fold, iron service and shoe restoration',
    aliases: ['laundry', 'dry clean', 'ironing', 'wash and fold', 'suit dry clean'],
    subcategories: [
      { 
        id: 'laundry-wash-iron', 
        name: 'Laundry (Wash & Iron)', 
        subtitle: 'Kilogram wash, tumble dry and crisp pressing', 
        icon: '🧺',
        thirdLevelOptions: [
          { id: 'laundry-per-kg-wash-fold', name: 'Per-KG Wash, Dry & Fold Service', subtitle: 'Regular clothes washing & neatly folded packages', icon: '🧺' }
        ]
      },
      { 
        id: 'dry-cleaning-service', 
        name: 'Dry Cleaning', 
        subtitle: 'Suits, bridal sarees, blazers & delicate fabrics', 
        icon: '👔', 
        aliases: ['dry clean'],
        thirdLevelOptions: [
          { id: 'dryclean-suit-saree-blazer', name: 'Suit, Blazer & Saree Dry Cleaning', subtitle: 'Stain treatment & delicate solvent cleaning', icon: '👔' }
        ]
      },
      { 
        id: 'curtain-laundry-service', 
        name: 'Curtain & Blanket Laundry', 
        subtitle: 'Heavy curtain removal, washing & re-hanging', 
        icon: '🪟',
        thirdLevelOptions: [
          { id: 'laundry-heavy-curtain-wash', name: 'Heavy Curtain Removal, Wash & Re-Hanging', subtitle: 'In-home removal, industrial wash & steam pressing', icon: '🪟' }
        ]
      }
    ]
  },

  // 30. Other Services
  {
    id: 'other-services',
    name: 'Other Services',
    slug: 'other-services',
    icon: '🔧',
    description: 'Specialized and custom services not listed elsewhere',
    aliases: ['other service', 'custom work', 'general services'],
    subcategories: [
      { 
        id: 'general-misc-services', 
        name: 'General Professional Services', 
        subtitle: 'Other specialist services not categorized above', 
        icon: '🔧',
        thirdLevelOptions: [
          { id: 'misc-specialized-service', name: 'Specialized On-Demand Service', subtitle: 'Custom niche professional assistance', icon: '🔧' }
        ]
      }
    ]
  }
];

export const SERVICES_POPULAR_SEARCHES = [
  { label: 'AC Repair', icon: '❄️', mainCatId: 'appliance-repair', subCatId: 'ac-repair-sub' },
  { label: 'Plumbing', icon: '🚰', mainCatId: 'home-services', subCatId: 'plumbing-home' },
  { label: 'Electrician', icon: '⚡', mainCatId: 'home-services', subCatId: 'electrical-home' },
  { label: 'Cleaning', icon: '🧹', mainCatId: 'cleaning-services', subCatId: 'deep-house-cleaning' },
  { label: 'Graphic Design', icon: '🎨', mainCatId: 'creative-services', subCatId: 'graphic-design-serv' }
];
