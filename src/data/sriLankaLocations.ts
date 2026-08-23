import { LocationType } from '../services/locationService';

export interface RawLocationSeed {
  code: string;
  name: string;
  type: LocationType;
  districtCode: string; // reference code to parent district
  cityCode?: string;     // for areas: reference code to parent city
  postalCode?: string;
  name_si?: string;
  name_ta?: string;
  latitude?: number;
  longitude?: number;
  sortOrder?: number;
}

export interface CitySeed {
  code: string;
  name: string;
  districtCode: string;
  postalCode?: string;
  areas: {
    code: string;
    name: string;
    postalCode?: string;
  }[];
}

export const CANONICAL_CITIES_AND_AREAS: CitySeed[] = [
  // ==========================================
  // CENTRAL PROVINCE (HIGH PRIORITY FOCUS)
  // ==========================================
  // Kandy District
  {
    code: 'kandy-city',
    name: 'Kandy City',
    districtCode: 'kandy',
    postalCode: '20000',
    areas: [
      { code: 'kandy-town', name: 'Kandy Town Center', postalCode: '20000' },
      { code: 'peradeniya-road', name: 'Peradeniya Road', postalCode: '20000' },
      { code: 'katugastota-road', name: 'Katugastota Road', postalCode: '20000' },
      { code: 'ampitiya', name: 'Ampitiya', postalCode: '20000' },
      { code: 'tennekumbura', name: 'Tennekumbura', postalCode: '20000' },
      { code: 'aruppola', name: 'Aruppola', postalCode: '20000' },
      { code: 'asgiriya', name: 'Asgiriya', postalCode: '20000' },
      { code: 'mulgampola', name: 'Mulgampola', postalCode: '20000' },
      { code: 'hanthana', name: 'Hanthana', postalCode: '20000' },
      { code: 'suduhumpola', name: 'Suduhumpola', postalCode: '20000' },
      { code: 'watapuluwa', name: 'Watapuluwa', postalCode: '20000' }
    ]
  },
  {
    code: 'peradeniya',
    name: 'Peradeniya',
    districtCode: 'kandy',
    postalCode: '20400',
    areas: [
      { code: 'university-campus', name: 'University Campus Area', postalCode: '20400' },
      { code: 'hindagala', name: 'Hindagala', postalCode: '20400' },
      { code: 'sarasaviya', name: 'Sarasaviya Gardens', postalCode: '20400' },
      { code: 'gelioya', name: 'Gelioya Junction', postalCode: '20400' },
      { code: 'kiribathkumbura', name: 'Kiribathkumbura', postalCode: '20400' }
    ]
  },
  {
    code: 'katugastota',
    name: 'Katugastota',
    districtCode: 'kandy',
    postalCode: '20110',
    areas: [
      { code: 'mahaiyawa', name: 'Mahaiyawa', postalCode: '20110' },
      { code: 'gohagoda', name: 'Gohagoda', postalCode: '20110' },
      { code: 'kondadeniya', name: 'Kondadeniya', postalCode: '20110' },
      { code: 'yatiwawala', name: 'Yatiwawala', postalCode: '20110' }
    ]
  },
  {
    code: 'gampola',
    name: 'Gampola',
    districtCode: 'kandy',
    postalCode: '20500',
    areas: [
      { code: 'gampola-town', name: 'Gampola Town', postalCode: '20500' },
      { code: 'ethgala', name: 'Ethgala', postalCode: '20500' },
      { code: 'kahatapitiya', name: 'Kahatapitiya', postalCode: '20500' },
      { code: 'ulapane', name: 'Ulapane', postalCode: '20500' }
    ]
  },
  {
    code: 'nawalapitiya',
    name: 'Nawalapitiya',
    districtCode: 'kandy',
    postalCode: '20600',
    areas: [
      { code: 'nawalapitiya-town', name: 'Nawalapitiya Town', postalCode: '20600' },
      { code: 'kadiyanlena', name: 'Kadiyanlena', postalCode: '20600' },
      { code: 'rosella', name: 'Rosella', postalCode: '20600' }
    ]
  },
  {
    code: 'kundasale',
    name: 'Kundasale',
    districtCode: 'kandy',
    postalCode: '20070',
    areas: [
      { code: 'pallekele', name: 'Pallekele', postalCode: '20070' },
      { code: 'digana', name: 'Digana', postalCode: '20070' },
      { code: 'balagolla', name: 'Balagolla', postalCode: '20070' },
      { code: 'nattarampotha', name: 'Nattarampotha', postalCode: '20070' }
    ]
  },
  {
    code: 'teldeniya',
    name: 'Teldeniya',
    districtCode: 'kandy',
    postalCode: '20900',
    areas: [
      { code: 'teldeniya-town', name: 'Teldeniya Town', postalCode: '20900' },
      { code: 'karalliyadda', name: 'Karalliyadda', postalCode: '20900' },
      { code: 'rangala', name: 'Rangala', postalCode: '20900' }
    ]
  },
  {
    code: 'kadugannawa',
    name: 'Kadugannawa',
    districtCode: 'kandy',
    postalCode: '20300',
    areas: [
      { code: 'kadugannawa-town', name: 'Kadugannawa Town', postalCode: '20300' },
      { code: 'pilimathalawa', name: 'Pilimathalawa', postalCode: '20300' },
      { code: 'henawala', name: 'Henawala', postalCode: '20300' },
      { code: 'danture', name: 'Danture', postalCode: '20300' }
    ]
  },
  {
    code: 'akurana',
    name: 'Akurana',
    districtCode: 'kandy',
    postalCode: '20850',
    areas: [
      { code: 'akurana-town', name: 'Akurana Town', postalCode: '20850' },
      { code: 'bulugohatenna', name: 'Bulugohatenna', postalCode: '20850' },
      { code: 'neerawella', name: 'Neerawella', postalCode: '20850' }
    ]
  },
  {
    code: 'wattegama',
    name: 'Wattegama',
    districtCode: 'kandy',
    postalCode: '20810',
    areas: [
      { code: 'wattegama-town', name: 'Wattegama Town', postalCode: '20810' },
      { code: 'panwila', name: 'Panwila', postalCode: '20810' },
      { code: 'yatawara', name: 'Yatawara', postalCode: '20810' }
    ]
  },

  // Matale District
  {
    code: 'matale-city',
    name: 'Matale City',
    districtCode: 'matale',
    postalCode: '21000',
    areas: [
      { code: 'matale-town', name: 'Matale Town', postalCode: '21000' },
      { code: 'mandandawela', name: 'Mandandawela', postalCode: '21000' },
      { code: 'gongawela', name: 'Gongawela', postalCode: '21000' },
      { code: 'kaludewala', name: 'Kaludewala', postalCode: '21000' },
      { code: 'kawdawela', name: 'Kawdawela', postalCode: '21000' }
    ]
  },
  {
    code: 'dambulla',
    name: 'Dambulla',
    districtCode: 'matale',
    postalCode: '21100',
    areas: [
      { code: 'dambulla-town', name: 'Dambulla Town', postalCode: '21100' },
      { code: 'kandalama', name: 'Kandalama', postalCode: '21100' },
      { code: 'pelwehera', name: 'Pelwehera', postalCode: '21100' },
      { code: 'inamaluwa', name: 'Inamaluwa', postalCode: '21100' }
    ]
  },
  {
    code: 'sigiriya',
    name: 'Sigiriya',
    districtCode: 'matale',
    postalCode: '21120',
    areas: [
      { code: 'sigiriya-village', name: 'Sigiriya Village', postalCode: '21120' },
      { code: 'pidurangala', name: 'Pidurangala', postalCode: '21120' },
      { code: 'habarana-road', name: 'Habarana Road', postalCode: '21120' }
    ]
  },
  {
    code: 'galewela',
    name: 'Galewela',
    districtCode: 'matale',
    postalCode: '21200',
    areas: [
      { code: 'galewela-town', name: 'Galewela Town', postalCode: '21200' },
      { code: 'dewahuwa', name: 'Dewahuwa', postalCode: '21200' },
      { code: 'makulagaswewa', name: 'Makulagaswewa', postalCode: '21200' }
    ]
  },
  {
    code: 'rattota',
    name: 'Rattota',
    districtCode: 'matale',
    postalCode: '21400',
    areas: [
      { code: 'rattota-town', name: 'Rattota Town', postalCode: '21400' },
      { code: 'riverston', name: 'Riverston', postalCode: '21400' },
      { code: 'kaikawala', name: 'Kaikawala', postalCode: '21400' }
    ]
  },

  // Nuwara Eliya District
  {
    code: 'nuwara-eliya-town',
    name: 'Nuwara Eliya Town',
    districtCode: 'nuwara-eliya',
    postalCode: '22200',
    areas: [
      { code: 'city-centre-ne', name: 'City Centre', postalCode: '22200' },
      { code: 'hawa-eliya', name: 'Hawa Eliya', postalCode: '22200' },
      { code: 'pedro', name: 'Pedro Estate Area', postalCode: '22200' },
      { code: 'gregory-lake', name: 'Gregory Lake Front', postalCode: '22200' },
      { code: 'single-tree', name: 'Single Tree Hill', postalCode: '22200' },
      { code: 'moon-plains', name: 'Moon Plains', postalCode: '22200' }
    ]
  },
  {
    code: 'hatton',
    name: 'Hatton',
    districtCode: 'nuwara-eliya',
    postalCode: '22000',
    areas: [
      { code: 'hatton-town', name: 'Hatton Town', postalCode: '22000' },
      { code: 'dickoya', name: 'Dickoya', postalCode: '22000' },
      { code: 'norwood', name: 'Norwood', postalCode: '22000' },
      { code: 'maskeliya', name: 'Maskeliya', postalCode: '22000' },
      { code: 'nallathanniya', name: 'Nallathanniya (Sri Pada)', postalCode: '22000' }
    ]
  },
  {
    code: 'kotagala',
    name: 'Kotagala',
    districtCode: 'nuwara-eliya',
    postalCode: '22080',
    areas: [
      { code: 'kotagala-town', name: 'Kotagala Town', postalCode: '22080' },
      { code: 'bogawantalawa', name: 'Bogawantalawa', postalCode: '22080' }
    ]
  },
  {
    code: 'talawakele',
    name: 'Talawakele',
    districtCode: 'nuwara-eliya',
    postalCode: '22100',
    areas: [
      { code: 'talawakele-town', name: 'Talawakele Town', postalCode: '22100' },
      { code: 'lindula', name: 'Lindula', postalCode: '22100' },
      { code: 'nanu-oya', name: 'Nanu Oya Junction', postalCode: '22100' }
    ]
  },
  {
    code: 'ginigathena',
    name: 'Ginigathena',
    districtCode: 'nuwara-eliya',
    postalCode: '20640',
    areas: [
      { code: 'ginigathena-town', name: 'Ginigathena Town', postalCode: '20640' },
      { code: 'kitulgala', name: 'Kitulgala', postalCode: '20640' },
      { code: 'norton-bridge', name: 'Norton Bridge', postalCode: '20640' }
    ]
  },

  // ==========================================
  // WESTERN PROVINCE
  // ==========================================
  // Colombo District
  {
    code: 'colombo-01',
    name: 'Colombo Fort (Colombo 01)',
    districtCode: 'colombo',
    postalCode: '00100',
    areas: [
      { code: 'echelon-square', name: 'Echelon Square', postalCode: '00100' },
      { code: 'bank-of-ceylon-mawatha', name: 'BOC Mawatha', postalCode: '00100' },
      { code: 'chatham-street', name: 'Chatham Street', postalCode: '00100' }
    ]
  },
  {
    code: 'colombo-pettah',
    name: 'Pettah (Colombo 11)',
    districtCode: 'colombo',
    postalCode: '01100',
    areas: [
      { code: 'main-street-pettah', name: 'Main Street Bazaar', postalCode: '01100' },
      { code: 'sea-street', name: 'Sea Street', postalCode: '01100' },
      { code: 'cross-streets', name: 'Cross Streets Zone', postalCode: '01100' }
    ]
  },
  {
    code: 'colombo-03',
    name: 'Kollupitiya (Colombo 03)',
    districtCode: 'colombo',
    postalCode: '00300',
    areas: [
      { code: 'galle-road-col-3', name: 'Galle Road Kollupitiya', postalCode: '00300' },
      { code: 'liberty-plaza-area', name: 'Liberty Plaza Area', postalCode: '00300' },
      { code: 'duplication-road-col-3', name: 'Duplication Road North', postalCode: '00300' }
    ]
  },
  {
    code: 'colombo-04',
    name: 'Bambalapitiya (Colombo 04)',
    districtCode: 'colombo',
    postalCode: '00400',
    areas: [
      { code: 'marine-drive-col-4', name: 'Marine Drive Bambalapitiya', postalCode: '00400' },
      { code: 'majestic-city-area', name: 'Majestic City Area', postalCode: '00400' },
      { code: 'lauries-road', name: 'Laurie\'s Road', postalCode: '00400' }
    ]
  },
  {
    code: 'colombo-wellawatte',
    name: 'Wellawatte (Colombo 06)',
    districtCode: 'colombo',
    postalCode: '00600',
    areas: [
      { code: 'ramakrishna-road', name: 'Ramakrishna Road', postalCode: '00600' },
      { code: 'savoy-area', name: 'Savoy Area', postalCode: '00600' },
      { code: 'pamankada', name: 'Pamankada', postalCode: '00600' }
    ]
  },
  {
    code: 'colombo-07',
    name: 'Cinnamon Gardens (Colombo 07)',
    districtCode: 'colombo',
    postalCode: '00700',
    areas: [
      { code: 'ward-place', name: 'Ward Place', postalCode: '00700' },
      { code: 'horton-place', name: 'Horton Place', postalCode: '00700' },
      { code: 'torrington', name: 'Torrington Square', postalCode: '00700' },
      { code: 'gregorys-road', name: 'Gregory\'s Road', postalCode: '00700' }
    ]
  },
  {
    code: 'dehiwala',
    name: 'Dehiwala',
    districtCode: 'colombo',
    postalCode: '10350',
    areas: [
      { code: 'dehiwala-junction', name: 'Dehiwala Junction', postalCode: '10350' },
      { code: 'zoo-road', name: 'National Zoo Road Area', postalCode: '10350' },
      { code: 'kalubowila', name: 'Kalubowila', postalCode: '10350' },
      { code: 'nedimala', name: 'Nedimala', postalCode: '10350' }
    ]
  },
  {
    code: 'mount-lavinia',
    name: 'Mount Lavinia',
    districtCode: 'colombo',
    postalCode: '10370',
    areas: [
      { code: 'hotel-road', name: 'Hotel Road Beach Zone', postalCode: '10370' },
      { code: 'templers-road', name: 'Templers Road', postalCode: '10370' },
      { code: 'attidiya', name: 'Attidiya', postalCode: '10370' }
    ]
  },
  {
    code: 'nugegoda',
    name: 'Nugegoda',
    districtCode: 'colombo',
    postalCode: '10250',
    areas: [
      { code: 'nugegoda-flyover', name: 'Nugegoda Junction', postalCode: '10250' },
      { code: 'gangodawila', name: 'Gangodawila', postalCode: '10250' },
      { code: 'jubilee-post', name: 'Jubilee Post', postalCode: '10250' },
      { code: 'kohuwala', name: 'Kohuwala', postalCode: '10250' }
    ]
  },
  {
    code: 'maharagama',
    name: 'Maharagama',
    districtCode: 'colombo',
    postalCode: '10280',
    areas: [
      { code: 'pamunuwa', name: 'Pamunuwa Shopping Street', postalCode: '10280' },
      { code: 'navinna', name: 'Navinna', postalCode: '10280' },
      { code: 'high-level-maharagama', name: 'High Level Road Maharagama', postalCode: '10280' }
    ]
  },
  {
    code: 'rajagiriya',
    name: 'Rajagiriya',
    districtCode: 'colombo',
    postalCode: '10107',
    areas: [
      { code: 'welikada', name: 'Welikada Junction', postalCode: '10107' },
      { code: 'kalapaluwawa', name: 'Kalapaluwawa', postalCode: '10107' },
      { code: 'obeysokarapura', name: 'Obeysekarapura', postalCode: '10107' }
    ]
  },
  {
    code: 'battaramulla',
    name: 'Battaramulla',
    districtCode: 'colombo',
    postalCode: '10120',
    areas: [
      { code: 'pelawatte', name: 'Pelawatte', postalCode: '10120' },
      { code: 'koswatta', name: 'Koswatta', postalCode: '10120' },
      { code: 'thalangama', name: 'Thalangama', postalCode: '10120' },
      { code: 'hokandara', name: 'Hokandara', postalCode: '10120' }
    ]
  },
  {
    code: 'malabe',
    name: 'Malabe',
    districtCode: 'colombo',
    postalCode: '10115',
    areas: [
      { code: 'sliit-campus-area', name: 'SLIIT Campus Area', postalCode: '10115' },
      { code: 'pittugala', name: 'Pittugala', postalCode: '10115' },
      { code: 'thalahena', name: 'Thalahena', postalCode: '10115' }
    ]
  },
  {
    code: 'homagama',
    name: 'Homagama',
    districtCode: 'colombo',
    postalCode: '10200',
    areas: [
      { code: 'homagama-town', name: 'Homagama Town', postalCode: '10200' },
      { code: 'pitipana', name: 'Pitipana Tech City', postalCode: '10200' },
      { code: 'meegoda', name: 'Meegoda', postalCode: '10200' },
      { code: 'godagama', name: 'Godagama Junction', postalCode: '10200' }
    ]
  },
  {
    code: 'piliyandala',
    name: 'Piliyandala',
    districtCode: 'colombo',
    postalCode: '10300',
    areas: [
      { code: 'piliyandala-bypass', name: 'Piliyandala Town', postalCode: '10300' },
      { code: 'kesbewa', name: 'Kesbewa', postalCode: '10300' },
      { code: 'suwarapola', name: 'Suwarapola', postalCode: '10300' },
      { code: 'madapatha', name: 'Madapatha', postalCode: '10300' }
    ]
  },
  {
    code: 'moratuwa',
    name: 'Moratuwa',
    districtCode: 'colombo',
    postalCode: '10400',
    areas: [
      { code: 'katubedda', name: 'Katubedda (University Zone)', postalCode: '10400' },
      { code: 'rawatawatte', name: 'Rawatawatte', postalCode: '10400' },
      { code: 'egoda-uyana', name: 'Egoda Uyana', postalCode: '10400' },
      { code: 'lunawa', name: 'Lunawa', postalCode: '10400' }
    ]
  },

  // Gampaha District
  {
    code: 'gampaha-town',
    name: 'Gampaha Town',
    districtCode: 'gampaha',
    postalCode: '11000',
    areas: [
      { code: 'gampaha-central', name: 'Gampaha Central', postalCode: '11000' },
      { code: 'asgiriya-gampaha', name: 'Asgiriya Gampaha', postalCode: '11000' },
      { code: 'yakkala', name: 'Yakkala', postalCode: '11000' },
      { code: 'miriswatta', name: 'Miriswatta Junction', postalCode: '11000' }
    ]
  },
  {
    code: 'negombo',
    name: 'Negombo',
    districtCode: 'gampaha',
    postalCode: '11500',
    areas: [
      { code: 'negombo-town', name: 'Negombo Town', postalCode: '11500' },
      { code: 'kudapaduwa', name: 'Kudapaduwa Beach Zone', postalCode: '11500' },
      { code: 'kochchikade', name: 'Kochchikade', postalCode: '11500' },
      { code: 'periyamulla', name: 'Periyamulla', postalCode: '11500' }
    ]
  },
  {
    code: 'katunayake',
    name: 'Katunayake',
    districtCode: 'gampaha',
    postalCode: '11450',
    areas: [
      { code: 'ftz-katunayake', name: 'Free Trade Zone Area', postalCode: '11450' },
      { code: 'airport-road-katunayake', name: 'Airport Access Road', postalCode: '11450' },
      { code: 'seeduwa', name: 'Seeduwa', postalCode: '11450' }
    ]
  },
  {
    code: 'ja-ela',
    name: 'Ja-Ela',
    districtCode: 'gampaha',
    postalCode: '11350',
    areas: [
      { code: 'ja-ela-town', name: 'Ja-Ela Town', postalCode: '11350' },
      { code: 'ekala', name: 'Ekala Industrial Area', postalCode: '11350' },
      { code: 'tudella', name: 'Tudella', postalCode: '11350' }
    ]
  },
  {
    code: 'wattala',
    name: 'Wattala',
    districtCode: 'gampaha',
    postalCode: '11300',
    areas: [
      { code: 'wattala-junction', name: 'Wattala Junction', postalCode: '11300' },
      { code: 'mabole', name: 'Mabole', postalCode: '11300' },
      { code: 'hendala', name: 'Hendala', postalCode: '11300' },
      { code: 'elakanda', name: 'Elakanda', postalCode: '11300' }
    ]
  },
  {
    code: 'kiribathgoda',
    name: 'Kiribathgoda',
    districtCode: 'gampaha',
    postalCode: '11600',
    areas: [
      { code: 'kiribathgoda-junction', name: 'Kiribathgoda Junction', postalCode: '11600' },
      { code: 'makola', name: 'Makola', postalCode: '11600' },
      { code: 'dalugama', name: 'Dalugama (University Area)', postalCode: '11600' }
    ]
  },
  {
    code: 'kadawatha',
    name: 'Kadawatha',
    districtCode: 'gampaha',
    postalCode: '11850',
    areas: [
      { code: 'highway-interchange', name: 'Highway Interchange Area', postalCode: '11850' },
      { code: 'mahara', name: 'Mahara', postalCode: '11850' },
      { code: 'eldeniya', name: 'Eldeniya', postalCode: '11850' }
    ]
  },

  // Kalutara District
  {
    code: 'kalutara-town',
    name: 'Kalutara Town',
    districtCode: 'kalutara',
    postalCode: '12000',
    areas: [
      { code: 'kalutara-north', name: 'Kalutara North', postalCode: '12000' },
      { code: 'kalutara-south', name: 'Kalutara South', postalCode: '12000' },
      { code: 'nagoda-kalutara', name: 'Nagoda Hospital Area', postalCode: '12000' },
      { code: 'katukurunda', name: 'Katukurunda', postalCode: '12000' }
    ]
  },
  {
    code: 'panadura',
    name: 'Panadura',
    districtCode: 'kalutara',
    postalCode: '12500',
    areas: [
      { code: 'panadura-town', name: 'Panadura Town', postalCode: '12500' },
      { code: 'gorakana', name: 'Gorakana', postalCode: '12500' },
      { code: 'walana', name: 'Walana', postalCode: '12500' },
      { code: 'hirana', name: 'Hirana', postalCode: '12500' }
    ]
  },
  {
    code: 'horana',
    name: 'Horana',
    districtCode: 'kalutara',
    postalCode: '12400',
    areas: [
      { code: 'horana-town', name: 'Horana Town', postalCode: '12400' },
      { code: 'pokunuwita', name: 'Pokunuwita', postalCode: '12400' },
      { code: 'poruwadanda', name: 'Poruwadanda', postalCode: '12400' }
    ]
  },
  {
    code: 'beruwala',
    name: 'Beruwala',
    districtCode: 'kalutara',
    postalCode: '12070',
    areas: [
      { code: 'beruwala-town', name: 'Beruwala Town', postalCode: '12070' },
      { code: 'china-fort', name: 'China Fort Gem Market', postalCode: '12070' },
      { code: 'aluthgama', name: 'Aluthgama', postalCode: '12070' }
    ]
  },

  // ==========================================
  // SOUTHERN PROVINCE
  // ==========================================
  // Galle District
  {
    code: 'galle-city',
    name: 'Galle City',
    districtCode: 'galle',
    postalCode: '80000',
    areas: [
      { code: 'galle-fort', name: 'Galle Fort Historic Zone', postalCode: '80000' },
      { code: 'pettigalawatte', name: 'Pettigalawatte', postalCode: '80000' },
      { code: 'karapitiya', name: 'Karapitiya Hospital Zone', postalCode: '80000' },
      { code: 'richmond-hill', name: 'Richmond Hill Area', postalCode: '80000' },
      { code: 'dadalla', name: 'Dadalla', postalCode: '80000' }
    ]
  },
  {
    code: 'unawatuna',
    name: 'Unawatuna',
    districtCode: 'galle',
    postalCode: '80600',
    areas: [
      { code: 'yaddehimulla', name: 'Yaddehimulla Beach Road', postalCode: '80600' },
      { code: 'rumassala', name: 'Rumassala Sanctuary Area', postalCode: '80600' },
      { code: 'thalpe', name: 'Thalpe Coastal Zone', postalCode: '80600' }
    ]
  },
  {
    code: 'hikkaduwa',
    name: 'Hikkaduwa',
    districtCode: 'galle',
    postalCode: '80240',
    areas: [
      { code: 'coral-gardens', name: 'Coral Gardens Zone', postalCode: '80240' },
      { code: 'narigama', name: 'Narigama Beach Area', postalCode: '80240' },
      { code: 'thiranagama', name: 'Thiranagama', postalCode: '80240' }
    ]
  },
  {
    code: 'ambalangoda',
    name: 'Ambalangoda',
    districtCode: 'galle',
    postalCode: '80300',
    areas: [
      { code: 'ambalangoda-town', name: 'Ambalangoda Town', postalCode: '80300' },
      { code: 'randombe', name: 'Randombe', postalCode: '80300' },
      { code: 'batapola', name: 'Batapola', postalCode: '80300' }
    ]
  },
  {
    code: 'ahangama',
    name: 'Ahangama',
    districtCode: 'galle',
    postalCode: '80650',
    areas: [
      { code: 'ahangama-town', name: 'Ahangama Town', postalCode: '80650' },
      { code: 'midigama-galle', name: 'Midigama Surf Point', postalCode: '80650' },
      { code: 'kabalana', name: 'Kabalana Beach', postalCode: '80650' }
    ]
  },

  // Matara District
  {
    code: 'matara-city',
    name: 'Matara City',
    districtCode: 'matara',
    postalCode: '81000',
    areas: [
      { code: 'matara-town', name: 'Matara Fort & Town', postalCode: '81000' },
      { code: 'nupe', name: 'Nupe Junction', postalCode: '81000' },
      { code: 'kotuwegoda', name: 'Kotuwegoda', postalCode: '81000' },
      { code: 'rahula-road', name: 'Rahula Road Area', postalCode: '81000' },
      { code: 'walgama', name: 'Walgama', postalCode: '81000' }
    ]
  },
  {
    code: 'mirissa',
    name: 'Mirissa',
    districtCode: 'matara',
    postalCode: '81740',
    areas: [
      { code: 'mirissa-beach', name: 'Mirissa Beach Point', postalCode: '81740' },
      { code: 'mirissa-harbour', name: 'Mirissa Harbour Area', postalCode: '81740' },
      { code: 'thalaramba', name: 'Thalaramba', postalCode: '81740' }
    ]
  },
  {
    code: 'weligama',
    name: 'Weligama',
    districtCode: 'matara',
    postalCode: '81700',
    areas: [
      { code: 'weligama-town', name: 'Weligama Town', postalCode: '81700' },
      { code: 'kapparatota', name: 'Kapparatota', postalCode: '81700' },
      { code: 'gurubebila', name: 'Gurubebila', postalCode: '81700' }
    ]
  },
  {
    code: 'dikwella',
    name: 'Dikwella',
    districtCode: 'matara',
    postalCode: '81200',
    areas: [
      { code: 'hiriketiya-beach', name: 'Hiriketiya Beach Bay', postalCode: '81200' },
      { code: 'dikwella-town', name: 'Dikwella Town', postalCode: '81200' },
      { code: 'nilwella', name: 'Nilwella Cove', postalCode: '81200' }
    ]
  },

  // Hambantota District
  {
    code: 'hambantota-town',
    name: 'Hambantota Town',
    districtCode: 'hambantota',
    postalCode: '82000',
    areas: [
      { code: 'siribopura', name: 'Siribopura Administrative Complex', postalCode: '82000' },
      { code: 'mirijjawila', name: 'Mirijjawila Industrial Zone', postalCode: '82000' },
      { code: 'port-city-hambantota', name: 'Port City Hambantota', postalCode: '82000' }
    ]
  },
  {
    code: 'tangalle',
    name: 'Tangalle',
    districtCode: 'hambantota',
    postalCode: '82200',
    areas: [
      { code: 'medaketiya', name: 'Medaketiya Beach Road', postalCode: '82200' },
      { code: 'goyambokka', name: 'Goyambokka Cove', postalCode: '82200' },
      { code: 'mawella', name: 'Mawella Beach', postalCode: '82200' }
    ]
  },
  {
    code: 'tissamaharama',
    name: 'Tissamaharama',
    districtCode: 'hambantota',
    postalCode: '82600',
    areas: [
      { code: 'tissa-town', name: 'Tissa Town & Tank Area', postalCode: '82600' },
      { code: 'debarawewa', name: 'Debarawewa', postalCode: '82600' },
      { code: 'kirinda', name: 'Kirinda Coastal Village', postalCode: '82600' }
    ]
  },

  // ==========================================
  // NORTHERN PROVINCE
  // ==========================================
  // Jaffna District
  {
    code: 'jaffna-city',
    name: 'Jaffna City',
    districtCode: 'jaffna',
    postalCode: '40000',
    areas: [
      { code: 'nallur-temple-area', name: 'Nallur Temple Zone', postalCode: '40000' },
      { code: 'chundikuli', name: 'Chundikuli', postalCode: '40000' },
      { code: 'kokuvil', name: 'Kokuvil', postalCode: '40000' },
      { code: 'thirunelvely', name: 'Thirunelvely (University Area)', postalCode: '40000' },
      { code: 'gurunagar', name: 'Gurunagar Coastal Area', postalCode: '40000' }
    ]
  },
  {
    code: 'chavakachcheri',
    name: 'Chavakachcheri',
    districtCode: 'jaffna',
    postalCode: '40500',
    areas: [
      { code: 'chavakachcheri-town', name: 'Chavakachcheri Town', postalCode: '40500' },
      { code: 'kodikamam', name: 'Kodikamam', postalCode: '40500' },
      { code: 'meesalai', name: 'Meesalai', postalCode: '40500' }
    ]
  },
  {
    code: 'point-pedro',
    name: 'Point Pedro',
    districtCode: 'jaffna',
    postalCode: '40800',
    areas: [
      { code: 'point-pedro-town', name: 'Point Pedro Town', postalCode: '40800' },
      { code: 'valvettithurai', name: 'Valvettithurai', postalCode: '40800' },
      { code: 'karaveddy', name: 'Karaveddy', postalCode: '40800' }
    ]
  },

  // Kilinochchi District
  {
    code: 'kilinochchi-town',
    name: 'Kilinochchi Town',
    districtCode: 'kilinochchi',
    postalCode: '44000',
    areas: [
      { code: 'kilinochchi-center', name: 'Kilinochchi A9 Center', postalCode: '44000' },
      { code: 'paranthan', name: 'Paranthan Junction', postalCode: '44000' },
      { code: 'kanakapuram', name: 'Kanakapuram', postalCode: '44000' }
    ]
  },

  // Mannar District
  {
    code: 'mannar-town',
    name: 'Mannar Town',
    districtCode: 'mannar',
    postalCode: '41000',
    areas: [
      { code: 'mannar-bazaar', name: 'Mannar Island Bazaar', postalCode: '41000' },
      { code: 'pesalai', name: 'Pesalai Coastal Village', postalCode: '41000' },
      { code: 'talaimannar', name: 'Talaimannar Pier Area', postalCode: '41000' }
    ]
  },

  // Mullaitivu District
  {
    code: 'mullaitivu-town',
    name: 'Mullaitivu Town',
    districtCode: 'mullaitivu',
    postalCode: '42000',
    areas: [
      { code: 'mullaitivu-front', name: 'Mullaitivu Coastal Zone', postalCode: '42000' },
      { code: 'puthukkudiyiruppu', name: 'Puthukkudiyiruppu', postalCode: '42000' },
      { code: 'oddusuddan', name: 'Oddusuddan', postalCode: '42000' }
    ]
  },

  // Vavuniya District
  {
    code: 'vavuniya-town',
    name: 'Vavuniya Town',
    districtCode: 'vavuniya',
    postalCode: '43000',
    areas: [
      { code: 'vavuniya-station-road', name: 'Station Road Area', postalCode: '43000' },
      { code: 'omanthai', name: 'Omanthai A9 Gate', postalCode: '43000' },
      { code: 'rambaikulam', name: 'Rambaikulam', postalCode: '43000' }
    ]
  },

  // ==========================================
  // EASTERN PROVINCE
  // ==========================================
  // Trincomalee District
  {
    code: 'trincomalee-town',
    name: 'Trincomalee Town',
    districtCode: 'trincomalee',
    postalCode: '31000',
    areas: [
      { code: 'uppuveli', name: 'Uppuveli Beach Front', postalCode: '31000' },
      { code: 'fort-frederick-area', name: 'Fort Frederick Zone', postalCode: '31000' },
      { code: 'china-bay', name: 'China Bay Airport Area', postalCode: '31000' },
      { code: 'kanniya', name: 'Kanniya Hot Springs Area', postalCode: '31000' }
    ]
  },
  {
    code: 'nilaveli',
    name: 'Nilaveli',
    districtCode: 'trincomalee',
    postalCode: '31010',
    areas: [
      { code: 'nilaveli-beach-zone', name: 'Nilaveli Resort Beach', postalCode: '31010' },
      { code: 'pigeon-island-access', name: 'Pigeon Island Access Point', postalCode: '31010' }
    ]
  },
  {
    code: 'kinniya',
    name: 'Kinniya',
    districtCode: 'trincomalee',
    postalCode: '31200',
    areas: [
      { code: 'kinniya-bridge-area', name: 'Kinniya Bridge Area', postalCode: '31200' },
      { code: 'kurinchakerny', name: 'Kurinchakerny', postalCode: '31200' }
    ]
  },

  // Batticaloa District
  {
    code: 'batticaloa-town',
    name: 'Batticaloa Town',
    districtCode: 'batticaloa',
    postalCode: '30000',
    areas: [
      { code: 'kallady-beach', name: 'Kallady Beach Road', postalCode: '30000' },
      { code: 'puliyanthivu', name: 'Puliyanthivu Island Zone', postalCode: '30000' },
      { code: 'koddaimunai', name: 'Koddaimunai', postalCode: '30000' },
      { code: 'urani', name: 'Urani', postalCode: '30000' }
    ]
  },
  {
    code: 'kattankudy',
    name: 'Kattankudy',
    districtCode: 'batticaloa',
    postalCode: '30100',
    areas: [
      { code: 'central-bazaar-kattankudy', name: 'Central Bazaar Kattankudy', postalCode: '30100' },
      { code: 'beach-road-kattankudy', name: 'Beach Road Kattankudy', postalCode: '30100' }
    ]
  },
  {
    code: 'pasikudah',
    name: 'Pasikudah',
    districtCode: 'batticaloa',
    postalCode: '30410',
    areas: [
      { code: 'pasikudah-bay-resorts', name: 'Pasikudah Bay Resort Zone', postalCode: '30410' },
      { code: 'kalkudah-beach', name: 'Kalkudah Beach', postalCode: '30410' },
      { code: 'valaichchenai-town', name: 'Valaichchenai Town', postalCode: '30410' }
    ]
  },

  // Ampara District
  {
    code: 'ampara-town',
    name: 'Ampara Town',
    districtCode: 'ampara',
    postalCode: '32000',
    areas: [
      { code: 'ampara-central', name: 'Ampara Central Bazaar', postalCode: '32000' },
      { code: 'inginiyagala', name: 'Inginiyagala Tank Area', postalCode: '32000' },
      { code: 'uhana', name: 'Uhana', postalCode: '32000' }
    ]
  },
  {
    code: 'kalmunai',
    name: 'Kalmunai',
    districtCode: 'ampara',
    postalCode: '32300',
    areas: [
      { code: 'kalmunai-town', name: 'Kalmunai Town', postalCode: '32300' },
      { code: 'sainthamaruthu', name: 'Sainthamaruthu', postalCode: '32300' },
      { code: 'pandiruppu', name: 'Pandiruppu', postalCode: '32300' }
    ]
  },
  {
    code: 'arugam-bay',
    name: 'Arugam Bay / Pottuvil',
    districtCode: 'ampara',
    postalCode: '32500',
    areas: [
      { code: 'arugam-bay-main-point', name: 'Arugam Bay Main Surf Point', postalCode: '32500' },
      { code: 'pottuvil-town', name: 'Pottuvil Town', postalCode: '32500' },
      { code: 'panama-ampara', name: 'Panama Coastal Village', postalCode: '32500' }
    ]
  },

  // ==========================================
  // NORTH WESTERN PROVINCE
  // ==========================================
  // Kurunegala District
  {
    code: 'kurunegala-city',
    name: 'Kurunegala City',
    districtCode: 'kurunegala',
    postalCode: '60000',
    areas: [
      { code: 'lake-round-kurunegala', name: 'Lake Round Promenade', postalCode: '60000' },
      { code: 'clock-tower-kurunegala', name: 'Clock Tower Town Center', postalCode: '60000' },
      { code: 'malkaduwawa', name: 'Malkaduwawa', postalCode: '60000' },
      { code: 'gettuwana', name: 'Gettuwana', postalCode: '60000' }
    ]
  },
  {
    code: 'kuliyapitiya',
    name: 'Kuliyapitiya',
    districtCode: 'kurunegala',
    postalCode: '60200',
    areas: [
      { code: 'kuliyapitiya-town', name: 'Kuliyapitiya Town', postalCode: '60200' },
      { code: 'university-area-kuliyapitiya', name: 'Wayamba University Area', postalCode: '60200' },
      { code: 'pannala-road', name: 'Pannala Road', postalCode: '60200' }
    ]
  },
  {
    code: 'narammala',
    name: 'Narammala',
    districtCode: 'kurunegala',
    postalCode: '60100',
    areas: [
      { code: 'narammala-town', name: 'Narammala Town', postalCode: '60100' },
      { code: 'alawwa', name: 'Alawwa', postalCode: '60100' }
    ]
  },

  // Puttalam District
  {
    code: 'puttalam-town',
    name: 'Puttalam Town',
    districtCode: 'puttalam',
    postalCode: '61300',
    areas: [
      { code: 'puttalam-lagoon-front', name: 'Puttalam Lagoon Front', postalCode: '61300' },
      { code: 'salt-pans-zone', name: 'Salt Pans Zone', postalCode: '61300' },
      { code: 'palavi', name: 'Palavi Junction', postalCode: '61300' }
    ]
  },
  {
    code: 'chilaw',
    name: 'Chilaw',
    districtCode: 'puttalam',
    postalCode: '61000',
    areas: [
      { code: 'chilaw-town', name: 'Chilaw Town', postalCode: '61000' },
      { code: 'munneswaram', name: 'Munneswaram Temple Zone', postalCode: '61000' },
      { code: 'bangadeniya', name: 'Bangadeniya', postalCode: '61000' }
    ]
  },
  {
    code: 'kalpitiya',
    name: 'Kalpitiya',
    districtCode: 'puttalam',
    postalCode: '61360',
    areas: [
      { code: 'kudawa-kite-beach', name: 'Kudawa Kite Lagoon Beach', postalCode: '61360' },
      { code: 'kalpitiya-fort-area', name: 'Kalpitiya Dutch Fort Zone', postalCode: '61360' },
      { code: 'talawila', name: 'Talawila Church Area', postalCode: '61360' }
    ]
  },

  // ==========================================
  // NORTH CENTRAL PROVINCE
  // ==========================================
  // Anuradhapura District
  {
    code: 'anuradhapura-city',
    name: 'Anuradhapura City',
    districtCode: 'anuradhapura',
    postalCode: '50000',
    areas: [
      { code: 'new-town-anuradhapura', name: 'New Town Commercial Hub', postalCode: '50000' },
      { code: 'sacred-city-zone', name: 'Sacred City Temple Zone', postalCode: '50000' },
      { code: 'stage-1-anuradhapura', name: 'Stage 1', postalCode: '50000' },
      { code: 'stage-2-anuradhapura', name: 'Stage 2', postalCode: '50000' }
    ]
  },
  {
    code: 'kekirawa',
    name: 'Kekirawa',
    districtCode: 'anuradhapura',
    postalCode: '50100',
    areas: [
      { code: 'kekirawa-town', name: 'Kekirawa Town', postalCode: '50100' },
      { code: 'maradankadawala', name: 'Maradankadawala', postalCode: '50100' },
      { code: 'kalawewa', name: 'Kalawewa Reservoir Area', postalCode: '50100' }
    ]
  },

  // Polonnaruwa District
  {
    code: 'polonnaruwa-city',
    name: 'Polonnaruwa City',
    districtCode: 'polonnaruwa',
    postalCode: '51000',
    areas: [
      { code: 'kaduruwela-bazaar', name: 'Kaduruwela Commercial Bazaar', postalCode: '51000' },
      { code: 'new-town-polonnaruwa', name: 'New Town Administration Zone', postalCode: '51000' },
      { code: 'ancient-city-zone', name: 'Ancient Ruins Ruins Zone', postalCode: '51000' }
    ]
  },
  {
    code: 'hingurakgoda',
    name: 'Hingurakgoda',
    districtCode: 'polonnaruwa',
    postalCode: '51400',
    areas: [
      { code: 'hingurakgoda-town', name: 'Hingurakgoda Town', postalCode: '51400' },
      { code: 'minneriya', name: 'Minneriya Park Entrance', postalCode: '51400' }
    ]
  },

  // ==========================================
  // UVA PROVINCE
  // ==========================================
  // Badulla District
  {
    code: 'badulla-city',
    name: 'Badulla City',
    districtCode: 'badulla',
    postalCode: '90000',
    areas: [
      { code: 'badulla-town', name: 'Badulla Town Bazaar', postalCode: '90000' },
      { code: 'kailagoda', name: 'Kailagoda', postalCode: '90000' },
      { code: 'hindagoda-badulla', name: 'Hindagoda', postalCode: '90000' },
      { code: 'hali-ela', name: 'Hali-Ela', postalCode: '90000' }
    ]
  },
  {
    code: 'ella',
    name: 'Ella',
    districtCode: 'badulla',
    postalCode: '90090',
    areas: [
      { code: 'ella-town-center', name: 'Ella Town Center', postalCode: '90090' },
      { code: 'nine-arches-area', name: 'Nine Arches Bridge Zone', postalCode: '90090' },
      { code: 'kithalella', name: 'Kithalella', postalCode: '90090' },
      { code: 'demodara', name: 'Demodara Loop Area', postalCode: '90090' }
    ]
  },
  {
    code: 'bandarawela',
    name: 'Bandarawela',
    districtCode: 'badulla',
    postalCode: '90100',
    areas: [
      { code: 'bandarawela-town', name: 'Bandarawela Town', postalCode: '90100' },
      { code: 'diyatalawa-junction', name: 'Diyatalawa Station Junction', postalCode: '90100' },
      { code: 'bindunuwewa', name: 'Bindunuwewa', postalCode: '90100' }
    ]
  },
  {
    code: 'haputale',
    name: 'Haputale',
    districtCode: 'badulla',
    postalCode: '90160',
    areas: [
      { code: 'haputale-town', name: 'Haputale Town', postalCode: '90160' },
      { code: 'liptons-seat-road', name: 'Lipton\'s Seat Road', postalCode: '90160' },
      { code: 'beragala', name: 'Beragala Gap', postalCode: '90160' }
    ]
  },

  // Monaragala District
  {
    code: 'monaragala-town',
    name: 'Monaragala Town',
    districtCode: 'monaragala',
    postalCode: '91000',
    areas: [
      { code: 'monaragala-central', name: 'Monaragala Central', postalCode: '91000' },
      { code: 'kumbukkana', name: 'Kumbukkana', postalCode: '91000' }
    ]
  },
  {
    code: 'kataragama',
    name: 'Kataragama',
    districtCode: 'monaragala',
    postalCode: '91400',
    areas: [
      { code: 'sacred-city-kataragama', name: 'Sacred City Temple Zone', postalCode: '91400' },
      { code: 'sella-kataragama', name: 'Sella Kataragama', postalCode: '91400' },
      { code: 'detagamuwa', name: 'Detagamuwa', postalCode: '91400' }
    ]
  },

  // ==========================================
  // SABARAGAMUWA PROVINCE
  // ==========================================
  // Ratnapura District
  {
    code: 'ratnapura-city',
    name: 'Ratnapura City',
    districtCode: 'ratnapura',
    postalCode: '70000',
    areas: [
      { code: 'gem-bazaar-ratnapura', name: 'Gem Market Bazaar', postalCode: '70000' },
      { code: 'new-town-ratnapura', name: 'New Town Administrative Zone', postalCode: '70000' },
      { code: 'mudduwa', name: 'Mudduwa', postalCode: '70000' },
      { code: 'weralupa', name: 'Weralupa Junction', postalCode: '70000' }
    ]
  },
  {
    code: 'embilipitiya',
    name: 'Embilipitiya',
    districtCode: 'ratnapura',
    postalCode: '70200',
    areas: [
      { code: 'embilipitiya-town', name: 'Embilipitiya Town', postalCode: '70200' },
      { code: 'udawalawe-gate', name: 'Udawalawe Park Entrance', postalCode: '70200' },
      { code: 'chandrika-wewa', name: 'Chandrika Wewa Area', postalCode: '70200' }
    ]
  },

  // Kegalle District
  {
    code: 'kegalle-city',
    name: 'Kegalle City',
    districtCode: 'kegalle',
    postalCode: '71000',
    areas: [
      { code: 'kegalle-town', name: 'Kegalle Town Bazaar', postalCode: '71000' },
      { code: 'ranwala', name: 'Ranwala', postalCode: '71000' },
      { code: 'meepitiya', name: 'Meepitiya', postalCode: '71000' }
    ]
  },
  {
    code: 'mawanella',
    name: 'Mawanella',
    districtCode: 'kegalle',
    postalCode: '71500',
    areas: [
      { code: 'mawanella-town', name: 'Mawanella Town', postalCode: '71500' },
      { code: 'utuwankanda', name: 'Utuwankanda (Saradiel Rock Area)', postalCode: '71500' },
      { code: 'hingula', name: 'Hingula', postalCode: '71500' }
    ]
  },
  {
    code: 'pinnawala',
    name: 'Pinnawala / Rambukkana',
    districtCode: 'kegalle',
    postalCode: '71100',
    areas: [
      { code: 'elephant-orphanage-zone', name: 'Elephant Orphanage Zone', postalCode: '71100' },
      { code: 'rambukkana-town', name: 'Rambukkana Station Area', postalCode: '71100' }
    ]
  }
];

export interface LegacyArea {
  id: string;
  name: string;
  postalCode?: string;
}

export interface LegacyCity {
  id: string;
  name: string;
  postalCode?: string;
  areas?: LegacyArea[];
}

export interface LegacyDistrict {
  id: string;
  name: string;
  cities: LegacyCity[];
}

export interface LegacyProvince {
  id: string;
  name: string;
  districts: LegacyDistrict[];
}

// Map canonical dataset to legacy SRI_LANKA_PROVINCES structure
const RAW_PROVINCE_DEFINITIONS = [
  {
    id: 'western',
    name: 'Western Province',
    districts: [
      { id: 'colombo', name: 'Colombo' },
      { id: 'gampaha', name: 'Gampaha' },
      { id: 'kalutara', name: 'Kalutara' }
    ]
  },
  {
    id: 'central',
    name: 'Central Province',
    districts: [
      { id: 'kandy', name: 'Kandy' },
      { id: 'matale', name: 'Matale' },
      { id: 'nuwara-eliya', name: 'Nuwara Eliya' }
    ]
  },
  {
    id: 'southern',
    name: 'Southern Province',
    districts: [
      { id: 'galle', name: 'Galle' },
      { id: 'matara', name: 'Matara' },
      { id: 'hambantota', name: 'Hambantota' }
    ]
  },
  {
    id: 'northern',
    name: 'Northern Province',
    districts: [
      { id: 'jaffna', name: 'Jaffna' },
      { id: 'kilinochchi', name: 'Kilinochchi' },
      { id: 'mannar', name: 'Mannar' },
      { id: 'vavuniya', name: 'Vavuniya' },
      { id: 'mullaitivu', name: 'Mullaitivu' }
    ]
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    districts: [
      { id: 'batticaloa', name: 'Batticaloa' },
      { id: 'ampara', name: 'Ampara' },
      { id: 'trincomalee', name: 'Trincomalee' }
    ]
  },
  {
    id: 'north_western',
    name: 'North Western Province',
    districts: [
      { id: 'kurunegala', name: 'Kurunegala' },
      { id: 'puttalam', name: 'Puttalam' }
    ]
  },
  {
    id: 'north_central',
    name: 'North Central Province',
    districts: [
      { id: 'anuradhapura', name: 'Anuradhapura' },
      { id: 'polonnaruwa', name: 'Polonnaruwa' }
    ]
  },
  {
    id: 'uva',
    name: 'Uva Province',
    districts: [
      { id: 'badulla', name: 'Badulla' },
      { id: 'monaragala', name: 'Monaragala' }
    ]
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa Province',
    districts: [
      { id: 'ratnapura', name: 'Ratnapura' },
      { id: 'kegalle', name: 'Kegalle' }
    ]
  }
];

export const SRI_LANKA_PROVINCES: LegacyProvince[] = RAW_PROVINCE_DEFINITIONS.map(p => ({
  id: p.id,
  name: p.name,
  districts: p.districts.map(d => ({
    id: d.id,
    name: d.name,
    cities: CANONICAL_CITIES_AND_AREAS
      .filter(c => c.districtCode === d.id || c.districtCode === d.id.replace(/-/g, '_') || c.districtCode === d.id.replace(/_/g, '-'))
      .map(c => ({
        id: c.code,
        name: c.name,
        postalCode: c.postalCode,
        areas: c.areas.map(a => ({
          id: a.code,
          name: a.name,
          postalCode: a.postalCode || c.postalCode
        }))
      }))
  }))
}));

