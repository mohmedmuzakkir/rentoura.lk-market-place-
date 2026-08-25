import { FeaturedListingItem } from '../types';
import { FEATURED_RENTALS, NEAR_YOU_RENTALS } from './mockData';

export const ADDITIONAL_RENTAL_TEST_LISTINGS: FeaturedListingItem[] = [
  // Property Rentals
  {
    id: 'rent-prop-1',
    title: 'Modern 3BR Apartment in Havelock City',
    category: 'Property',
    categoryType: 'APARTMENT',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Colombo 05, Western Province',
    price: 'Rs. 185,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    tags: ['3 Beds', '2 Baths', 'Pool & Gym'],
    specs: [
      { label: '3 Beds', icon: 'Bed' },
      { label: '2 Baths', icon: 'Bath' },
      { label: 'Parking', icon: 'Car' }
    ],
    isSaved: false
  },
  {
    id: 'rent-prop-2',
    title: 'Commercial Office Space in Main Street',
    category: 'Property',
    categoryType: 'HOUSE',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Kandy, Central Province',
    price: 'Rs. 75,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    tags: ['1,200 Sqft', 'AC', 'Main Road'],
    specs: [
      { label: '1200 Sqft', icon: 'Cpu' },
      { label: 'AC', icon: 'Snowflake' }
    ],
    isSaved: false
  },

  // Rooms & Accommodation
  {
    id: 'rent-room-1',
    title: 'Single Room with Attached Bathroom',
    category: 'Rooms',
    categoryType: 'HOUSE',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Kandy, Central Province',
    price: 'Rs. 18,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    tags: ['Attached Bath', 'Furnished', 'Near Town'],
    specs: [
      { label: '1 Bed', icon: 'Bed' },
      { label: '1 Bath', icon: 'Bath' }
    ],
    isSaved: false
  },
  {
    id: 'rent-room-2',
    title: 'Student Boarding Place near Campus',
    category: 'Rooms',
    categoryType: 'HOUSE',
    badgeType: 'POPULAR',
    badgeColor: '#08A34F',
    location: 'Colombo, Western Province',
    price: 'Rs. 12,000',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    tags: ['Student Boarding', 'Meals Included'],
    specs: [
      { label: 'Shared', icon: 'Users' }
    ],
    isSaved: false
  },

  // Vehicles
  {
    id: 'rent-veh-1',
    title: 'Toyota KDH Super GL Van',
    category: 'Vehicles',
    categoryType: 'VEHICLE',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Galle, Southern Province',
    price: 'Rs. 12,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    tags: ['12 Seats', 'Dual AC', 'Self Drive'],
    specs: [
      { label: '12 Seats', icon: 'Users' },
      { label: 'AC', icon: 'Snowflake' }
    ],
    isSaved: false
  },

  // Event Rentals
  {
    id: 'rent-event-1',
    title: 'JBL Professional Sound System & DJ Gear',
    category: 'Event Rentals',
    categoryType: 'EVENT HALL',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Colombo, Western Province',
    price: 'Rs. 28,000',
    pricePeriod: '/ Event',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    tags: ['Speakers', 'Microphones', 'DJ Mixer'],
    specs: [
      { label: '1000W', icon: 'Cpu' }
    ],
    isSaved: false
  },

  // Equipment
  {
    id: 'rent-eq-1',
    title: 'Bosch Rotary Hammer Drill & Concrete Cutter',
    category: 'Equipment',
    categoryType: 'EQUIPMENT',
    badgeType: 'POPULAR',
    badgeColor: '#08A34F',
    location: 'Kandy, Central Province',
    price: 'Rs. 1,800',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    tags: ['Power Tools', 'Heavy Duty'],
    specs: [
      { label: '800W', icon: 'Cpu' }
    ],
    isSaved: false
  },

  // Electronics
  {
    id: 'rent-elec-1',
    title: 'Apple MacBook Pro M2 (16GB RAM / 512GB SSD)',
    category: 'Electronics',
    categoryType: 'CAMERA',
    badgeType: 'FEATURED',
    badgeColor: '#1464F4',
    location: 'Colombo, Western Province',
    price: 'Rs. 3,500',
    pricePeriod: '/ Day',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    tags: ['M2 Chip', 'Video Editing'],
    specs: [
      { label: '16GB RAM', icon: 'Cpu' }
    ],
    isSaved: false
  },

  // Furniture
  {
    id: 'rent-furn-1',
    title: '3-Seater Recliner Leather Sofa Set',
    category: 'Furniture',
    categoryType: 'EQUIPMENT',
    badgeType: 'VERIFIED',
    badgeColor: '#1464F4',
    location: 'Colombo, Western Province',
    price: 'Rs. 8,500',
    pricePeriod: '/ Month',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    tags: ['Leather', 'Living Room'],
    specs: [
      { label: '3 Seater', icon: 'Users' }
    ],
    isSaved: false
  }
];

// Master list of all temporary test rental listings
export const ALL_RENTAL_TEST_LISTINGS: FeaturedListingItem[] = [
  ...FEATURED_RENTALS,
  ...NEAR_YOU_RENTALS,
  ...ADDITIONAL_RENTAL_TEST_LISTINGS
];
