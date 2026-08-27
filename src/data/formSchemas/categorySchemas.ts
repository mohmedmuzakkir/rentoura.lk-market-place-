import { CategoryFormSchema, FieldSchema } from '../../types/postFormTypes';
import { getJobCategoryFormSchema } from './jobSchemas';
import { getServiceCategoryFormSchema } from './serviceSchemas';

/**
 * 1. VEHICLE RENTAL SCHEMAS
 */

export const RENTAL_CAR_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'vehicles',
  categoryName: 'Vehicles',
  subcategoryId: 'cars',
  subcategoryName: 'Cars',
  title: 'Car Specifications & Features',
  description: 'Provide accurate vehicle specifications for renters',
  fields: [
    {
      id: 'make',
      label: 'Vehicle Make / Brand',
      type: 'select',
      required: true,
      options: [
        { id: 'toyota', label: 'Toyota' },
        { id: 'honda', label: 'Honda' },
        { id: 'nissan', label: 'Nissan' },
        { id: 'suzuki', label: 'Suzuki / Maruti' },
        { id: 'mitsubishi', label: 'Mitsubishi' },
        { id: 'hyundai', label: 'Hyundai' },
        { id: 'kia', label: 'Kia' },
        { id: 'bmw', label: 'BMW' },
        { id: 'mercedes', label: 'Mercedes-Benz' },
        { id: 'audi', label: 'Audi' },
        { id: 'tesla', label: 'Tesla' },
        { id: 'other', label: 'Other Brand' }
      ],
      gridCols: 2
    },
    {
      id: 'model',
      label: 'Vehicle Model',
      type: 'text',
      required: true,
      placeholder: 'e.g. Axio WxB, Prius, Vezel, Aqua, Wagon R, Swift',
      gridCols: 2
    },
    {
      id: 'year',
      label: 'Manufacture Year',
      type: 'number',
      required: true,
      placeholder: 'e.g. 2018',
      validation: { min: 1990, max: 2026 },
      gridCols: 2
    },
    {
      id: 'fuelType',
      label: 'Fuel Type',
      type: 'select',
      required: true,
      options: [
        { id: 'petrol', label: 'Petrol' },
        { id: 'hybrid', label: 'Petrol Hybrid' },
        { id: 'diesel', label: 'Diesel' },
        { id: 'electric', label: 'Electric (EV)' },
        { id: 'plug-in-hybrid', label: 'Plug-in Hybrid' }
      ],
      gridCols: 2
    },
    {
      id: 'transmission',
      label: 'Transmission',
      type: 'radio',
      required: true,
      options: [
        { id: 'automatic', label: 'Automatic' },
        { id: 'manual', label: 'Manual' },
        { id: 'triptronic', label: 'Triptronic / CVT' }
      ],
      defaultValue: 'automatic',
      gridCols: 2
    },
    {
      id: 'seats',
      label: 'Seating Capacity',
      type: 'select',
      required: true,
      options: [
        { id: '4', label: '4 Seater' },
        { id: '5', label: '5 Seater (Standard)' },
        { id: '7', label: '7 Seater (SUV / MPV)' },
        { id: '8+', label: '8+ Seater' }
      ],
      defaultValue: '5',
      gridCols: 2
    },
    {
      id: 'rentalType',
      label: 'Driver Option',
      type: 'radio',
      required: true,
      options: [
        { id: 'self-drive', label: 'Self-Drive Only' },
        { id: 'with-driver', label: 'With Driver Only' },
        { id: 'both', label: 'Both Self-Drive & With Driver Available' }
      ],
      defaultValue: 'self-drive'
    },
    {
      id: 'freeMileage',
      label: 'Free Daily Mileage Allowance',
      type: 'select',
      options: [
        { id: '100km', label: '100 km / day' },
        { id: '150km', label: '150 km / day' },
        { id: '200km', label: '200 km / day' },
        { id: '250km', label: '250 km / day' },
        { id: 'unlimited', label: 'Unlimited Mileage' }
      ],
      defaultValue: '100km',
      gridCols: 2
    },
    {
      id: 'extraKmCharge',
      label: 'Excess Mileage Fee',
      type: 'currency',
      placeholder: 'e.g. 85',
      prefix: 'Rs.',
      suffix: '/ extra km',
      gridCols: 2
    },
    {
      id: 'insuranceIncluded',
      label: 'Comprehensive Rent-a-Car Insurance Included?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'vehicleFeatures',
      label: 'Vehicle Inclusions & Comforts',
      type: 'multi-select',
      options: [
        { id: 'ac', label: 'Climate Control A/C' },
        { id: 'bluetooth', label: 'Bluetooth Audio & Handsfree' },
        { id: 'reverse-cam', label: 'Reverse Camera / Sensors' },
        { id: 'gps', label: 'GPS Navigation' },
        { id: 'dashcam', label: 'Dash Camera' },
        { id: 'usb-charge', label: 'Fast USB Chargers' },
        { id: 'roof-rack', label: 'Roof Rack / Luggage Carrier' },
        { id: 'baby-seat', label: 'Baby / Child Safety Seat Available' }
      ]
    },
    {
      id: 'description',
      label: 'Vehicle Description & Rental Conditions',
      type: 'textarea',
      required: true,
      placeholder: 'Detail fuel efficiency, vehicle cleanliness, required documents (NIC/Passport, Driving License, Billing Proof), deposit return policies, and airport/hotel pickup...',
      validation: { minLength: 30, maxLength: 2000 }
    }
  ]
};

export const RENTAL_VAN_BUS_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'vehicles',
  categoryName: 'Vehicles',
  subcategoryId: 'vans',
  subcategoryName: 'Vans & Passenger Coaches',
  title: 'Van / Bus Specifications',
  description: 'Provide seating capacity, AC, and driver arrangements',
  fields: [
    {
      id: 'vanType',
      label: 'Vehicle Class / Model',
      type: 'select',
      required: true,
      options: [
        { id: 'kdh-super-gl', label: 'Toyota KDH Super GL (Luxury High Roof)' },
        { id: 'kdh-flat-roof', label: 'Toyota KDH Flat Roof' },
        { id: 'hiace-dolphin', label: 'Toyota HiAce / Dolphin' },
        { id: 'caravan', label: 'Nissan Caravan / Urvan' },
        { id: 'rosa-bus', label: 'Mitsubishi Rosa Mini-Bus (26-30 Seats)' },
        { id: 'coaster-bus', label: 'Toyota Coaster (26-30 Seats)' },
        { id: 'luxury-coach', label: 'Full Size Tourist Coach (45-54 Seats)' }
      ],
      gridCols: 2
    },
    {
      id: 'seats',
      label: 'Passenger Seating Capacity',
      type: 'select',
      required: true,
      options: [
        { id: '9', label: '9 Seater VIP' },
        { id: '14', label: '14 Seater Commuter' },
        { id: '26', label: '26 Seater Mini Bus' },
        { id: '30', label: '30 Seater Bus' },
        { id: '45+', label: '45+ Luxury Coach' }
      ],
      defaultValue: '14',
      gridCols: 2
    },
    {
      id: 'withDriver',
      label: 'Driver Inclusion',
      type: 'radio',
      required: true,
      options: [
        { id: 'with-driver', label: 'With Professional English/Sinhala Speaking Driver' },
        { id: 'self-drive', label: 'Self Drive (Commercial Permit Required)' },
        { id: 'both', label: 'Both Options Available' }
      ],
      defaultValue: 'with-driver'
    },
    {
      id: 'fuelPolicy',
      label: 'Fuel & Driver Batta Terms',
      type: 'select',
      options: [
        { id: 'dry-rate', label: 'Vehicle Only (Hirer pays fuel & driver food/lodging)' },
        { id: 'all-inclusive', label: 'All Inclusive (Fuel + Driver Batta included per km)' },
        { id: 'packaged-tour', label: 'Custom Tour Package' }
      ],
      defaultValue: 'dry-rate'
    },
    {
      id: 'vanFeatures',
      label: 'Passenger Amenities',
      type: 'multi-select',
      options: [
        { id: 'dual-ac', label: 'Dual Line A/C' },
        { id: 'linea-seats', label: 'Adjustable Reclining Linea Seats' },
        { id: 'tv-mic', label: 'Overhead TV / Mic / Sound Setup' },
        { id: 'luggage-space', label: 'Extended Luggage Compartment' },
        { id: 'coolbox', label: 'Coolbox / Fridge' },
        { id: 'tinted-glass', label: 'Privacy Tinted Windows' }
      ]
    },
    {
      id: 'description',
      label: 'Van Description & Tour Packages',
      type: 'textarea',
      required: true,
      placeholder: 'Describe tour experience, airport transfer rates, wedding hires, fuel rates, and driver accommodations...',
      validation: { minLength: 30, maxLength: 2000 }
    }
  ]
};

export const RENTAL_BIKE_TUKTUK_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'vehicles',
  categoryName: 'Vehicles',
  subcategoryId: 'three-wheelers',
  subcategoryName: 'Three Wheelers & Bikes',
  title: 'Bike / Tuk-Tuk Specifications',
  description: 'Provide rental conditions for two & three wheelers',
  fields: [
    {
      id: 'vehicleType',
      label: 'Type of Vehicle',
      type: 'select',
      required: true,
      options: [
        { id: 'tuk-tuk-4stroke', label: 'Bajaj 4-Stroke Tuk-Tuk' },
        { id: 'tuk-tuk-2stroke', label: 'Bajaj 2-Stroke Tuk-Tuk' },
        { id: 'tvs-king', label: 'TVS King Tuk-Tuk' },
        { id: 'scooter-dio', label: 'Honda Dio / Activa Scooter' },
        { id: 'scooter-ntorq', label: 'TVS N-Torq 125 Scooter' },
        { id: 'motorcycle-pulsar', label: 'Bajaj Pulsar / Yamaha FZ' },
        { id: 'trail-bike', label: 'Trail / Off-Road Motorcycle' },
        { id: 'bicycle-mtb', label: 'Mountain Bicycle (MTB)' },
        { id: 'bicycle-electric', label: 'Electric E-Bike' }
      ],
      gridCols: 2
    },
    {
      id: 'helmetsProvided',
      label: 'Helmets / Rain Cover Provided',
      type: 'select',
      options: [
        { id: '2-helmets', label: '2 Quality Helmets Included' },
        { id: '1-helmet', label: '1 Helmet Included' },
        { id: 'rain-covers', label: 'Tuk-Tuk Full Rain Curtains' },
        { id: 'none', label: 'No gear included' }
      ],
      defaultValue: '2-helmets',
      gridCols: 2
    },
    {
      id: 'freeKm',
      label: 'Daily Free Mileage',
      type: 'select',
      options: [
        { id: 'unlimited', label: 'Unlimited Mileage' },
        { id: '100km', label: '100 km / day' },
        { id: '150km', label: '150 km / day' }
      ],
      defaultValue: 'unlimited',
      gridCols: 2
    },
    {
      id: 'touristFriendly',
      label: 'Tourist License & IDP Support Provided?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'description',
      label: 'Description & Rental Terms',
      type: 'textarea',
      required: true,
      placeholder: 'Mention engine condition, helmet sanitization, Sri Lanka driving endorsement assistance, tools/spare tire provided...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 2. PROPERTY & ACCOMMODATION SCHEMAS
 */

export const RENTAL_HOUSE_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'prop-rent',
  categoryName: 'Property Rentals',
  subcategoryId: 'houses',
  subcategoryName: 'Houses & Villas',
  title: 'House & Villa Specifications',
  description: 'Provide home specs, room layouts, and residential amenities',
  fields: [
    {
      id: 'propertyType',
      label: 'Property Class',
      type: 'select',
      required: true,
      options: [
        { id: 'single-story', label: 'Single Storey Standalone House' },
        { id: 'two-story', label: 'Two Storey Luxury House' },
        { id: 'luxury-villa', label: 'Private Luxury Villa & Pool' },
        { id: 'colonial-bungalow', label: 'Colonial / Estate Bungalow' },
        { id: 'annex-upper', label: 'Upper Floor / Annex with Separate Entrance' }
      ],
      gridCols: 2
    },
    {
      id: 'furnishing',
      label: 'Furnishing Status',
      type: 'select',
      required: true,
      options: [
        { id: 'fully-furnished', label: 'Fully Furnished (Teak furniture, electronics & beds)' },
        { id: 'semi-furnished', label: 'Semi-Furnished (Basic beds & kitchen setup)' },
        { id: 'unfurnished', label: 'Unfurnished (Vacant home)' }
      ],
      defaultValue: 'fully-furnished',
      gridCols: 2
    },
    {
      id: 'bedrooms',
      label: 'Number of Bedrooms',
      type: 'select',
      required: true,
      options: [
        { id: '1', label: '1 Bedroom' },
        { id: '2', label: '2 Bedrooms' },
        { id: '3', label: '3 Bedrooms' },
        { id: '4', label: '4 Bedrooms' },
        { id: '5+', label: '5+ Bedrooms' }
      ],
      defaultValue: '3',
      gridCols: 2
    },
    {
      id: 'bathrooms',
      label: 'Number of Bathrooms',
      type: 'select',
      required: true,
      options: [
        { id: '1', label: '1 Bathroom' },
        { id: '2', label: '2 Bathrooms (1 Attached)' },
        { id: '3', label: '3 Bathrooms (En-Suite)' },
        { id: '4+', label: '4+ Bathrooms' }
      ],
      defaultValue: '2',
      gridCols: 2
    },
    {
      id: 'floorArea',
      label: 'Floor Area (Sq. Ft.)',
      type: 'number',
      placeholder: 'e.g. 2400',
      suffix: 'Sq. Ft.',
      gridCols: 2
    },
    {
      id: 'parkingSpaces',
      label: 'Vehicle Parking',
      type: 'select',
      options: [
        { id: '1', label: '1 Covered Vehicle Parking' },
        { id: '2', label: '2 Vehicles Garage' },
        { id: '3+', label: '3+ Vehicles Paved Parking' },
        { id: 'street', label: 'Street Parking Only' }
      ],
      defaultValue: '2',
      gridCols: 2
    },
    {
      id: 'utilityBilling',
      label: 'Utility Billing Arrangement',
      type: 'select',
      options: [
        { id: 'separate-meters', label: 'Separate CEB Electricity & Water Meters (Paid by Tenant)' },
        { id: 'included', label: 'Utilities Included in Monthly Rent' },
        { id: 'fixed-contribution', label: 'Fixed Monthly Utility Contribution' }
      ],
      defaultValue: 'separate-meters',
      gridCols: 2
    },
    {
      id: 'depositMonths',
      label: 'Key Money / Advance Payment',
      type: 'select',
      options: [
        { id: '1', label: '1 Month Advance' },
        { id: '3', label: '3 Months Advance' },
        { id: '6', label: '6 Months Key Money' },
        { id: 'negotiable', label: 'Negotiable with Owner' }
      ],
      defaultValue: '3',
      gridCols: 2
    },
    {
      id: 'houseAmenities',
      label: 'House Amenities & Security',
      type: 'multi-select',
      options: [
        { id: 'ac', label: 'Air Conditioning in Master / All Bedrooms' },
        { id: 'hot-water', label: 'Solar / Geyser Hot Water' },
        { id: 'fiber-wifi', label: 'SLT Fiber Internet / WiFi' },
        { id: 'garden', label: 'Landscaped Private Garden' },
        { id: 'cctv-security', label: 'CCTV Cameras & Perimeter Wall' },
        { id: 'generator-solar', label: 'Solar Power / Generator Backup' },
        { id: 'servant-room', label: 'Maid / Driver Room & Washroom' },
        { id: 'rooftop', label: 'Private Rooftop Terrace' }
      ]
    },
    {
      id: 'description',
      label: 'Property Description & Neighbourhood',
      type: 'textarea',
      required: true,
      placeholder: 'Highlight proximity to leading schools, hospitals, supermarkets, public transport, peaceful residential surroundings, and water pressure/storage tanks...',
      validation: { minLength: 30, maxLength: 2000 }
    }
  ]
};

export const RENTAL_APARTMENT_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'prop-rent',
  categoryName: 'Property Rentals',
  subcategoryId: 'apartments',
  subcategoryName: 'Apartments & Condos',
  title: 'Apartment & Complex Details',
  description: 'Provide floor level, complex amenities, and management fees',
  fields: [
    {
      id: 'complexName',
      label: 'Apartment Complex / Tower Name',
      type: 'text',
      placeholder: 'e.g. Havelock City, Cinnamon Life, Iconic Galaxy, Prime Grand',
      gridCols: 2
    },
    {
      id: 'floorLevel',
      label: 'Floor Level',
      type: 'select',
      options: [
        { id: 'ground', label: 'Ground / 1st Floor' },
        { id: 'mid', label: 'Mid Floor (2nd - 6th Floor)' },
        { id: 'high', label: 'High Floor (7th - 15th Floor)' },
        { id: 'penthouse', label: 'Penthouse / Top Floor' }
      ],
      defaultValue: 'mid',
      gridCols: 2
    },
    {
      id: 'bedrooms',
      label: 'Bedrooms',
      type: 'select',
      required: true,
      options: [
        { id: 'studio', label: 'Studio Apartment' },
        { id: '1', label: '1 Bedroom' },
        { id: '2', label: '2 Bedrooms' },
        { id: '3', label: '3 Bedrooms' },
        { id: '4+', label: '4+ Bedrooms' }
      ],
      defaultValue: '2',
      gridCols: 2
    },
    {
      id: 'bathrooms',
      label: 'Bathrooms',
      type: 'select',
      required: true,
      options: [
        { id: '1', label: '1 Bathroom' },
        { id: '2', label: '2 Bathrooms' },
        { id: '3', label: '3 Bathrooms' }
      ],
      defaultValue: '2',
      gridCols: 2
    },
    {
      id: 'furnishing',
      label: 'Furnishing Status',
      type: 'select',
      options: [
        { id: 'fully-furnished', label: 'Fully Furnished (Turnkey)' },
        { id: 'semi-furnished', label: 'Semi-Furnished' },
        { id: 'unfurnished', label: 'Unfurnished' }
      ],
      defaultValue: 'fully-furnished',
      gridCols: 2
    },
    {
      id: 'mgmtFeeIncluded',
      label: 'Monthly Maintenance Fee Included in Rent?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'complexAmenities',
      label: 'Condo & Complex Amenities',
      type: 'multi-select',
      options: [
        { id: 'swimming-pool', label: 'Swimming Pool & Kid Pool' },
        { id: 'gym', label: 'Fully Equipped Fitness Gym' },
        { id: '24h-security', label: '24/7 Security & Access Card Lifts' },
        { id: 'backup-power', label: '100% Full Backup Generator' },
        { id: 'allocated-parking', label: 'Allocated Basement Parking' },
        { id: 'clubhouse', label: 'Clubhouse & Function Hall' },
        { id: 'balcony-view', label: 'Sea / City / Lake View Balcony' }
      ]
    },
    {
      id: 'description',
      label: 'Apartment Description',
      type: 'textarea',
      required: true,
      placeholder: 'Detail kitchen fittings (cooker hob, hood, microwave), laundry space, scenic views, and minimum lease duration...',
      validation: { minLength: 30, maxLength: 2000 }
    }
  ]
};

export const RENTAL_ROOM_ACCOMMODATION_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'rooms-acc',
  categoryName: 'Rooms & Accommodation',
  subcategoryId: 'single-room',
  subcategoryName: 'Rooms & Boarding (Bodim)',
  title: 'Room & Boarding Specifications',
  description: 'Provide room occupancy, bathroom sharing, and boarding facilities',
  fields: [
    {
      id: 'roomCategory',
      label: 'Room Setup',
      type: 'select',
      required: true,
      options: [
        { id: 'single-attached', label: 'Single Room with Attached Bathroom' },
        { id: 'single-shared', label: 'Single Room with Shared Bathroom' },
        { id: 'double-room', label: 'Double Room (2 Persons / Couple)' },
        { id: 'boarding-shared', label: 'Shared Bed Space in Boarding (Bodim)' },
        { id: 'student-hostel', label: 'Student / University Accommodation' },
        { id: 'executive-room', label: 'Working Professional / Executive Room' }
      ],
      gridCols: 2
    },
    {
      id: 'genderPreference',
      label: 'Occupant Preference',
      type: 'select',
      required: true,
      options: [
        { id: 'any', label: 'Open to Anyone' },
        { id: 'female-only', label: 'Girls / Female Only' },
        { id: 'male-only', label: 'Boys / Male Only' },
        { id: 'couples-only', label: 'Married Couples Only' },
        { id: 'students-only', label: 'University Students Only' }
      ],
      defaultValue: 'any',
      gridCols: 2
    },
    {
      id: 'billsIncluded',
      label: 'Utility Bills (Electricity & Water)',
      type: 'select',
      options: [
        { id: 'all-included', label: 'Water & Electricity 100% Included' },
        { id: 'sub-meter', label: 'Separate Sub-Meter for Electricity' },
        { id: 'shared-split', label: 'Bills Shared Equally Among Tenants' }
      ],
      defaultValue: 'all-included',
      gridCols: 2
    },
    {
      id: 'mealsProvided',
      label: 'Food & Meals Option',
      type: 'select',
      options: [
        { id: 'none', label: 'Room Only (No Cooking / Self Outside)' },
        { id: 'kitchen-access', label: 'Shared Kitchen Cooking Facilities' },
        { id: '3-meals', label: '3 Meals Provided (Full Board Bodim)' }
      ],
      defaultValue: 'kitchen-access',
      gridCols: 2
    },
    {
      id: 'roomFeatures',
      label: 'Room Furnishing & Amenities',
      type: 'multi-select',
      options: [
        { id: 'bed-mattress', label: 'Bed, Spring Mattress & Pillows' },
        { id: 'wardrobe-table', label: 'Wardrobe, Study Table & Chair' },
        { id: 'ceiling-fan', label: 'Ceiling Fan' },
        { id: 'ac', label: 'Air Conditioner (A/C)' },
        { id: 'wifi', label: 'High Speed WiFi' },
        { id: 'washing-machine', label: 'Washing Machine Access' },
        { id: 'separate-entrance', label: 'Separate Entrance & Key' },
        { id: 'bike-parking', label: 'Motorbike / Scooter Parking' }
      ]
    },
    {
      id: 'description',
      label: 'Room Description & Rules',
      type: 'textarea',
      required: true,
      placeholder: 'State walking distance to bus stops, universities (e.g. Peradeniya, Moratuwa, Kelaniya), gate opening/closing hours, and advance deposit terms...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 3. EVENT RENTALS SCHEMAS
 */

export const RENTAL_EVENT_VENUE_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'event-rentals',
  categoryName: 'Event Rentals',
  subcategoryId: 'wedding-hall',
  subcategoryName: 'Event Venues & Halls',
  title: 'Venue & Banquet Specifications',
  description: 'Provide guest capacity, catering options, and venue facilities',
  fields: [
    {
      id: 'venueType',
      label: 'Venue Classification',
      type: 'select',
      required: true,
      options: [
        { id: 'wedding-banquet', label: 'Luxury Wedding Banquet Hall' },
        { id: 'reception-hall', label: 'Reception & Dinner Hall' },
        { id: 'party-space', label: 'Birthday & Private Party Venue' },
        { id: 'outdoor-lawn', label: 'Outdoor Garden / Lawn Venue' },
        { id: 'conference-hall', label: 'Auditorium & Conference Hall' },
        { id: 'rooftop-venue', label: 'Rooftop Cocktail & Event Lounge' }
      ],
      gridCols: 2
    },
    {
      id: 'guestCapacity',
      label: 'Maximum Guest Capacity',
      type: 'select',
      required: true,
      options: [
        { id: '50-100', label: '50 - 100 Guests' },
        { id: '100-250', label: '100 - 250 Guests' },
        { id: '250-500', label: '250 - 500 Guests' },
        { id: '500-1000', label: '500 - 1,000 Guests' },
        { id: '1000+', label: '1,000+ Large Scale Venue' }
      ],
      defaultValue: '250-500',
      gridCols: 2
    },
    {
      id: 'cateringPolicy',
      label: 'Catering & Food Policy',
      type: 'select',
      options: [
        { id: 'inhouse-only', label: 'In-House Catering Only (Per Plate Packages)' },
        { id: 'outside-allowed', label: 'Outside Caterers Allowed (No Corkage)' },
        { id: 'corkage-charge', label: 'Outside Allowed with Corkage Fee' }
      ],
      defaultValue: 'outside-allowed',
      gridCols: 2
    },
    {
      id: 'venueAmenities',
      label: 'Venue Facilities & Services Included',
      type: 'multi-select',
      options: [
        { id: 'central-ac', label: 'Central Air Conditioning' },
        { id: 'backup-generator', label: 'Full Power Backup Generator' },
        { id: 'stage-trussing', label: 'Built-in Stage & Dynamic Lighting' },
        { id: 'bridal-room', label: 'Air-Conditioned Bridal Dressing Suite' },
        { id: 'valet-parking', label: 'Ample Car Parking / Valet Available' },
        { id: 'projector-screens', label: 'HD Projectors & LED Screens' },
        { id: 'sound-setup', label: 'Surround PA Sound System & Mic' }
      ]
    },
    {
      id: 'description',
      label: 'Venue Description & Booking Schedule',
      type: 'textarea',
      required: true,
      placeholder: 'Detail session timings (Day / Night), decor guidelines, advance booking deposit, and cancellation terms...',
      validation: { minLength: 30, maxLength: 2000 }
    }
  ]
};

export const RENTAL_SOUND_LIGHTING_DJ_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'event-rentals',
  categoryName: 'Event Rentals',
  subcategoryId: 'sound-system',
  subcategoryName: 'Sound, Lighting & DJ Gear',
  title: 'Sound & Audio-Visual Specs',
  description: 'Provide wattage, equipment list, and technician inclusion',
  fields: [
    {
      id: 'equipmentType',
      label: 'Equipment Package Type',
      type: 'select',
      required: true,
      options: [
        { id: 'line-array-sound', label: 'Full Concert Line-Array Sound System' },
        { id: 'wedding-acoustic-sound', label: 'Wedding / Acoustic Band Sound Setup' },
        { id: 'dj-console', label: 'DJ Console, Turntables & Mixers (Pioneer)' },
        { id: 'stage-moving-lights', label: 'Stage Moving Heads, Beam Lights & Lasers' },
        { id: 'outdoor-led-wall', label: 'P3/P4 Outdoor LED Video Wall' },
        { id: 'event-tents-canopy', label: 'Marquee Tents, Canopies & Chiavari Chairs' }
      ],
      gridCols: 2
    },
    {
      id: 'technicianIncluded',
      label: 'Sound Engineer / Operator Included?',
      type: 'select',
      options: [
        { id: 'full-team', label: 'Professional Sound Engineer & Crew Included' },
        { id: 'operator-only', label: '1 Dedicated Operator Included' },
        { id: 'gear-only', label: 'Gear Only (Dry Hire)' }
      ],
      defaultValue: 'full-team',
      gridCols: 2
    },
    {
      id: 'powerRequirement',
      label: 'Power Supply & Generator',
      type: 'select',
      options: [
        { id: 'generator-included', label: 'Backup Sound Generator Included in Price' },
        { id: 'venue-power', label: 'Operates on Standard Single/3-Phase Venue Power' },
        { id: 'generator-extra', label: 'Generator Available at Extra Cost' }
      ],
      defaultValue: 'venue-power',
      gridCols: 2
    },
    {
      id: 'setupTeardownIncluded',
      label: 'Transport, Setup & Teardown Included in Rate?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'description',
      label: 'Audio/Visual Specs & Package Inclusions',
      type: 'textarea',
      required: true,
      placeholder: 'List mixer model (Behringer X32/Yamaha), wireless mics (Shure/Sennheiser), subwoofers, cables, and rehearsal sound check timing...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 4. CONSTRUCTION & INDUSTRIAL EQUIPMENT
 */

export const RENTAL_CONSTRUCTION_MACHINERY_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'construction-eq',
  categoryName: 'Construction & Industrial',
  subcategoryId: 'scaffolding',
  subcategoryName: 'Heavy Machinery & Site Equipment',
  title: 'Machinery & Equipment Specifications',
  description: 'Provide power capacity, operator terms, and jobsite transport',
  fields: [
    {
      id: 'machineryType',
      label: 'Equipment Category',
      type: 'select',
      required: true,
      options: [
        { id: 'diesel-generator', label: 'Diesel Standby Generator (25kVA - 500kVA)' },
        { id: 'concrete-mixer', label: 'Concrete Batching Mixer & Vibrator' },
        { id: 'plate-compactor', label: 'Plate Compactor & Rammer' },
        { id: 'water-pump', label: 'Dewatering Mud / Submersible Water Pump' },
        { id: 'air-compressor', label: 'Heavy Pneumatic Air Compressor' },
        { id: 'welding-plant', label: 'Arc / TIG / MIG Industrial Welding Plant' },
        { id: 'scaffolding-frames', label: 'Steel Scaffolding Frames, Jacks & Pipes' },
        { id: 'survey-station', label: 'Total Station / Laser Survey Level' }
      ],
      gridCols: 2
    },
    {
      id: 'powerSource',
      label: 'Power Source',
      type: 'select',
      required: true,
      options: [
        { id: 'diesel', label: 'Diesel Engine' },
        { id: 'petrol', label: 'Petrol Engine' },
        { id: '3-phase-electric', label: '3-Phase Industrial Electric (400V)' },
        { id: 'single-phase', label: '230V Standard Electric' },
        { id: 'hydraulic', label: 'Hydraulic / Pneumatic' }
      ],
      defaultValue: 'diesel',
      gridCols: 2
    },
    {
      id: 'operatorProvided',
      label: 'Certified Operator Provided?',
      type: 'select',
      options: [
        { id: 'operator-included', label: 'Machine Operator Included with Daily Batta' },
        { id: 'operator-optional', label: 'Operator Available on Request' },
        { id: 'machine-only', label: 'Machine Only (Hirer operates)' }
      ],
      defaultValue: 'machine-only',
      gridCols: 2
    },
    {
      id: 'siteTransport',
      label: 'Jobsite Delivery / Mobilization',
      type: 'select',
      options: [
        { id: 'owner-transport', label: 'Flatbed Lorry Transport Available (Fee per km)' },
        { id: 'pickup-yard', label: 'Pickup from Machinery Yard / Depot' },
        { id: 'free-local', label: 'Free Delivery for 7+ Days Rental' }
      ],
      defaultValue: 'owner-transport',
      gridCols: 2
    },
    {
      id: 'description',
      label: 'Machinery Specifications & Maintenance Terms',
      type: 'textarea',
      required: true,
      placeholder: 'Specify kVA output, fuel consumption per hour, service routine, safety certifications, and emergency breakdown replacement guarantee...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 5. ELECTRONICS & CAMERAS
 */

export const RENTAL_ELECTRONICS_CAMERA_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'electronics',
  categoryName: 'Electronics & Media',
  subcategoryId: 'cameras',
  subcategoryName: 'Cameras, Lenses & Production Gear',
  title: 'Camera & Production Specifications',
  description: 'Provide camera brand, lens packages, and memory/battery inclusions',
  fields: [
    {
      id: 'brandModel',
      label: 'Camera / Gear Model',
      type: 'text',
      required: true,
      placeholder: 'e.g. Sony A7 IV, Canon R6 Mark II, FX3, BMPCC 6K, DJI Mini 4 Pro',
      gridCols: 2
    },
    {
      id: 'gearCategory',
      label: 'Equipment Category',
      type: 'select',
      required: true,
      options: [
        { id: 'mirrorless-body', label: 'Mirrorless / Cinema Camera Body' },
        { id: 'prime-zoom-lens', label: 'Prime / Zoom Lens (GM / L-Series)' },
        { id: 'drone-quadcopter', label: 'DJI 4K Drone & Remote Combo' },
        { id: 'gimbal-stabilizer', label: 'Gimbal Stabilizer (DJI RS3/RS4)' },
        { id: 'studio-lighting', label: 'Aputure / Godox Continuous COB Light' },
        { id: 'wireless-mic', label: 'DJI / Rode Wireless Pro Microphones' },
        { id: 'audio-recorder', label: 'Zoom / Sound Devices Audio Recorder' },
        { id: 'projector-screen', label: '4K Home Cinema Projector' }
      ],
      gridCols: 2
    },
    {
      id: 'accessoriesIncluded',
      label: 'Included Accessories Package',
      type: 'multi-select',
      options: [
        { id: 'extra-batteries', label: '3x High Capacity Batteries & Dual Charger' },
        { id: 'sd-cfexpress', label: 'High Speed V90 SD / CFexpress Card (128GB/256GB)' },
        { id: 'hard-pelican-case', label: 'Protective Pelican / Padded Bag' },
        { id: 'nd-filters', label: 'Variable ND Filter Set' },
        { id: 'tripod-monopod', label: 'Heavy Duty Fluid Head Tripod' },
        { id: 'hdmi-cables', label: 'HDMI & Power Cables Included' }
      ]
    },
    {
      id: 'description',
      label: 'Gear Description & Rental Policy',
      type: 'textarea',
      required: true,
      placeholder: 'Detail sensor condition, shutter count, optical clarity, caution deposit requirement, and verified NIC/Billing ID check at handover...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 6. FASHION & WEDDING OUTFITS
 */

export const RENTAL_FASHION_WEDDING_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'fashion',
  categoryName: 'Fashion & Outfits',
  subcategoryId: 'bridal',
  subcategoryName: 'Bridal, Groom & Formal Wear',
  title: 'Outfit & Designer Wear Specifications',
  description: 'Provide sizing, dry cleaning policy, and fitting trial options',
  fields: [
    {
      id: 'outfitType',
      label: 'Outfit Classification',
      type: 'select',
      required: true,
      options: [
        { id: 'bridal-saree', label: 'Kandyan / Indian Bridal Saree & Saree Jacket' },
        { id: 'wedding-gown', label: 'Western White Wedding Gown & Veil' },
        { id: 'groom-nilame', label: 'Traditional Kandyan Nilame Dress (Mul Anduma)' },
        { id: 'groom-tuxedo', label: 'Groom Luxury Tuxedo / 3-Piece Suit' },
        { id: 'lehenga-choli', label: 'Designer Party Lehenga Choli' },
        { id: 'evening-dress', label: 'Cocktail / Evening Gown' },
        { id: 'bridal-jewelry', label: 'Traditional 7-Chains Kandyan Jewelry Set' }
      ],
      gridCols: 2
    },
    {
      id: 'size',
      label: 'Standard Sizing',
      type: 'select',
      required: true,
      options: [
        { id: 'xs', label: 'Extra Small (XS)' },
        { id: 's', label: 'Small (S)' },
        { id: 'm', label: 'Medium (M)' },
        { id: 'l', label: 'Large (L)' },
        { id: 'xl', label: 'Extra Large (XL)' },
        { id: 'free-size', label: 'Free Size / Adjustable Pleats' }
      ],
      defaultValue: 'm',
      gridCols: 2
    },
    {
      id: 'dryCleaningIncluded',
      label: 'Dry Cleaning Handled by Owner Upon Return?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'trialFittingAvailable',
      label: 'Trial / In-Person Fitting Available Before Booking?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'description',
      label: 'Outfit Details & Care Rules',
      type: 'textarea',
      required: true,
      placeholder: 'Describe embroidery, fabric quality (Pure Silk, Velvet, Organza), matching accessories included, alterations allowed, and stain prevention policy...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * 7. MEDICAL & HEALTHCARE EQUIPMENT
 */

export const RENTAL_MEDICAL_EQUIPMENT_SCHEMA: CategoryFormSchema = {
  module: 'rentals',
  categoryId: 'medical',
  categoryName: 'Medical & Healthcare',
  subcategoryId: 'hospital-beds',
  subcategoryName: 'Patient Care & Medical Equipment',
  title: 'Medical Equipment Specifications',
  description: 'Provide sanitization standards, power backup, and patient setup',
  fields: [
    {
      id: 'medicalEquipmentType',
      label: 'Equipment Classification',
      type: 'select',
      required: true,
      options: [
        { id: 'hospital-bed-electric', label: '3-Function / 5-Function Electric ICU Hospital Bed' },
        { id: 'hospital-bed-manual', label: 'Manual 2-Crank Hospital Bed & Air Mattress' },
        { id: 'oxygen-concentrator', label: '5L / 10L Medical Oxygen Concentrator (Continuous Flow)' },
        { id: 'oxygen-cylinder', label: 'Medical Oxygen Cylinder & Flowmeter Regulator' },
        { id: 'wheelchair', label: 'Folding Lightweight Wheelchair / Commode Chair' },
        { id: 'patient-hoist', label: 'Hydraulic Patient Transfer Hoist' },
        { id: 'suction-machine', label: 'Medical Phlegm Suction Machine' },
        { id: 'bipap-cpap', label: 'BiPAP / CPAP Auto Machine' }
      ],
      gridCols: 2
    },
    {
      id: 'sterilizedGuaranteed',
      label: '100% Medically Sanitized & Sterilized?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'homeDemoIncluded',
      label: 'Doorstep Delivery, Assembly & Caregiver Training Included?',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'description',
      label: 'Medical Specifications & Maintenance Support',
      type: 'textarea',
      required: true,
      placeholder: 'Detail purity levels (for oxygen), battery backup capacity during power cuts, warranty replacement guarantee, and 24/7 technical hotline...',
      validation: { minLength: 20, maxLength: 2000 }
    }
  ]
};

/**
 * UNIVERSAL FALLBACK SCHEMA GENERATOR
 */
export function getFallbackSchema(module: 'rentals' | 'jobs' | 'services', categoryName: string, subcategoryName: string): CategoryFormSchema {
  return {
    module,
    categoryId: 'general',
    categoryName: categoryName || 'Rentals',
    subcategoryName: subcategoryName || 'General Item',
    title: `${categoryName || 'Rental'} Specifications & Features`,
    description: 'Provide accurate item details, usage guidelines, and rental terms',
    fields: [
      {
        id: 'condition',
        label: 'Item Condition / Quality Grade',
        type: 'select',
        required: true,
        options: [
          { id: 'brand-new', label: 'Brand New / Pristine Condition' },
          { id: 'like-new', label: 'Used - Like New (Flawless)' },
          { id: 'well-maintained', label: 'Well Maintained & Fully Functional' },
          { id: 'heavy-duty', label: 'Commercial / Heavy Duty Grade' }
        ],
        defaultValue: 'like-new',
        gridCols: 2
      },
      {
        id: 'brandName',
        label: 'Brand / Manufacturer Name',
        type: 'text',
        placeholder: 'e.g. Bosch, Sony, Yamaha, IKEA, Stanley',
        gridCols: 2
      },
      {
        id: 'deliveryAvailable',
        label: 'Doorstep Delivery Available to Renter?',
        type: 'toggle',
        defaultValue: false
      },
      {
        id: 'description',
        label: 'Detailed Description & Terms',
        type: 'textarea',
        required: true,
        placeholder: 'Detail item dimensions, accessories included, pickup points, ID requirements (NIC copy), and deposit refund conditions...',
        validation: { minLength: 20, maxLength: 2000 }
      }
    ]
  };
}

/**
 * Retrives the specific form schema according to the category taxonomy
 */
export function getCategoryFormSchema(
  module: 'rentals' | 'jobs' | 'services',
  categoryId?: string,
  subcategoryId?: string,
  categoryName?: string,
  subcategoryName?: string
): CategoryFormSchema {
  const catKey = (categoryId || '').toLowerCase();
  const subKey = (subcategoryId || '').toLowerCase();
  const catName = (categoryName || '').toLowerCase();
  const subName = (subcategoryName || '').toLowerCase();

  if (module === 'rentals') {
    // 1. Vehicles
    if (subKey.includes('car') || subKey === 'cars' || subName.includes('car')) {
      return RENTAL_CAR_SCHEMA;
    }
    if (subKey.includes('van') || subKey.includes('bus') || subName.includes('van') || subName.includes('bus')) {
      return RENTAL_VAN_BUS_SCHEMA;
    }
    if (subKey.includes('three') || subKey.includes('bike') || subKey.includes('motor') || subKey.includes('cycle') || subName.includes('bike')) {
      return RENTAL_BIKE_TUKTUK_SCHEMA;
    }
    if (catKey.includes('vehic') || catName.includes('vehic')) {
      return RENTAL_CAR_SCHEMA;
    }

    // 2. Property & Accommodation
    if (subKey.includes('apart') || subName.includes('apart') || subKey.includes('flat')) {
      return RENTAL_APARTMENT_SCHEMA;
    }
    if (catKey.includes('room') || subKey.includes('room') || subKey.includes('hostel') || subKey.includes('boarding') || subKey.includes('single')) {
      return RENTAL_ROOM_ACCOMMODATION_SCHEMA;
    }
    if (catKey.includes('prop') || catKey.includes('house') || subKey.includes('house') || subKey.includes('villa') || catName.includes('prop')) {
      return RENTAL_HOUSE_SCHEMA;
    }

    // 3. Event Rentals
    if (subKey.includes('hall') || subKey.includes('venue') || subKey.includes('wedding') || subName.includes('hall')) {
      return RENTAL_EVENT_VENUE_SCHEMA;
    }
    if (subKey.includes('sound') || subKey.includes('dj') || subKey.includes('light') || subKey.includes('screen') || subKey.includes('tent')) {
      return RENTAL_SOUND_LIGHTING_DJ_SCHEMA;
    }

    // 4. Construction & Industrial
    if (catKey.includes('const') || subKey.includes('scaffold') || subKey.includes('generator') || subKey.includes('pump') || subKey.includes('tool')) {
      return RENTAL_CONSTRUCTION_MACHINERY_SCHEMA;
    }

    // 5. Electronics & Media
    if (catKey.includes('electr') || subKey.includes('camera') || subKey.includes('lens') || subKey.includes('drone') || subKey.includes('audio')) {
      return RENTAL_ELECTRONICS_CAMERA_SCHEMA;
    }

    // 6. Fashion
    if (catKey.includes('fash') || subKey.includes('bridal') || subKey.includes('groom') || subKey.includes('dress') || subKey.includes('suit')) {
      return RENTAL_FASHION_WEDDING_SCHEMA;
    }

    // 7. Medical
    if (catKey.includes('med') || subKey.includes('bed') || subKey.includes('oxygen') || subKey.includes('wheelchair')) {
      return RENTAL_MEDICAL_EQUIPMENT_SCHEMA;
    }
  }

  if (module === 'jobs') {
    return getJobCategoryFormSchema(categoryId, subcategoryId, categoryName, subcategoryName);
  }

  if (module === 'services') {
    return getServiceCategoryFormSchema(categoryId, subcategoryId, categoryName, subcategoryName);
  }

  return getFallbackSchema(module, categoryName || 'Selected Category', subcategoryName || 'General');
}
