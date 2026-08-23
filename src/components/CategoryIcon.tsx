import React from 'react';
import {
  Home,
  Bed,
  Building2,
  Building,
  MapPin,
  Map,
  Car,
  Calendar,
  Wrench,
  Monitor,
  Shirt,
  Sofa,
  Tent,
  Heart,
  PawPrint,
  LayoutGrid,
  Briefcase,
  Laptop,
  Megaphone,
  Calculator,
  Hotel,
  Truck,
  HardHat,
  Factory,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Shield,
  Globe,
  Smartphone,
  Palette,
  Scale,
  Camera,
  Armchair,
  Tv,
  BookOpen,
  Scissors,
  Folder,
  Tag,
  Package,
  Plane
} from 'lucide-react';

export interface CategoryIconProps {
  iconKey?: string | null;
  slug?: string | null;
  name?: string | null;
  module?: string | null;
  parentIconKey?: string | null;
  parentSlug?: string | null;
  parentName?: string | null;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Resolves any category icon_key, slug, or name to a clean, consistent Lucide icon component.
 * NEVER renders raw text strings and NEVER throws errors.
 */
export const getCategoryIconComponent = ({
  iconKey,
  slug,
  name,
  module,
  parentIconKey,
  parentSlug,
  parentName,
  className = 'w-5 h-5 text-[#1464F4]',
  size,
  strokeWidth = 2,
}: CategoryIconProps): React.ReactElement => {
  const iconProps = {
    className,
    size,
    strokeWidth,
  };

  const cleanKey = (iconKey || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSlug = (slug || '').trim().toLowerCase();
  const cleanName = (name || '').trim().toLowerCase();

  // 1. Direct matching by iconKey
  if (cleanKey) {
    switch (cleanKey) {
      case 'home':
      case 'house':
      case 'property':
      case 'homeservices':
        return <Home {...iconProps} />;
      case 'bed':
      case 'beds':
      case 'room':
      case 'rooms':
        return <Bed {...iconProps} />;
      case 'building':
      case 'building2':
      case 'commercial':
      case 'office':
        return <Building2 {...iconProps} />;
      case 'map':
      case 'mappin':
      case 'land':
      case 'location':
        return <MapPin {...iconProps} />;
      case 'car':
      case 'vehicle':
      case 'vehicles':
      case 'cars':
        return <Car {...iconProps} />;
      case 'calendar':
      case 'calendarheart':
      case 'event':
      case 'events':
      case 'party':
        return <Calendar {...iconProps} />;
      case 'tool':
      case 'tools':
      case 'wrench':
      case 'drill':
      case 'hammer':
      case 'equipment':
      case 'appliancerepair':
        return <Wrench {...iconProps} />;
      case 'monitor':
      case 'tv':
      case 'desktop':
      case 'electronics':
        return <Monitor {...iconProps} />;
      case 'shirt':
      case 'fashion':
      case 'clothes':
        return <Shirt {...iconProps} />;
      case 'sofa':
      case 'armchair':
      case 'furniture':
        return <Sofa {...iconProps} />;
      case 'tent':
      case 'outdoor':
      case 'camp':
        return <Tent {...iconProps} />;
      case 'heart':
      case 'medical':
      case 'babymedical':
      case 'health':
        return <Heart {...iconProps} />;
      case 'paw':
      case 'pawprint':
      case 'pet':
      case 'pets':
      case 'animal':
        return <PawPrint {...iconProps} />;
      case 'grid':
      case 'layoutgrid':
      case 'boxes':
      case 'other':
        return <LayoutGrid {...iconProps} />;
      case 'briefcase':
      case 'job':
      case 'jobs':
      case 'officeadministration':
      case 'businessservices':
        return <Briefcase {...iconProps} />;
      case 'laptop':
      case 'computer':
      case 'tech':
      case 'technology':
      case 'ittechnology':
      case 'code':
        return <Laptop {...iconProps} />;
      case 'megaphone':
      case 'salesmarketing':
      case 'marketing':
        return <Megaphone {...iconProps} />;
      case 'calculator':
      case 'accountingfinance':
      case 'finance':
        return <Calculator {...iconProps} />;
      case 'hotel':
      case 'hospitalitytourism':
      case 'tourism':
        return <Hotel {...iconProps} />;
      case 'truck':
      case 'drivingtransport':
      case 'deliverymoving':
      case 'moving':
        return <Truck {...iconProps} />;
      case 'hardhat':
      case 'construction':
        return <HardHat {...iconProps} />;
      case 'factory':
      case 'factorymanufacturing':
      case 'manufacturing':
        return <Factory {...iconProps} />;
      case 'scissors':
      case 'beautyfashion':
      case 'beautyservices':
        return <Scissors {...iconProps} />;
      case 'shield':
      case 'security':
        return <Shield {...iconProps} />;
      case 'globe':
      case 'freelanceremote':
      case 'digital':
        return <Globe {...iconProps} />;
      case 'smartphone':
      case 'computermobile':
      case 'mobile':
        return <Smartphone {...iconProps} />;
      case 'palette':
      case 'creative':
      case 'art':
        return <Palette {...iconProps} />;
      case 'book':
      case 'bookopen':
      case 'education':
      case 'educationservices':
      case 'graduationcap':
        return <GraduationCap {...iconProps} />;
      case 'scale':
      case 'legalprofessional':
      case 'legal':
        return <Scale {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'heartpulse':
      case 'healthwellness':
      case 'wellness':
        return <HeartPulse {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      case 'plane':
        return <Plane {...iconProps} />;
      case 'folder':
        return <Folder {...iconProps} />;
      case 'tag':
        return <Tag {...iconProps} />;
    }
  }

  // 2. Derive / match by slug if iconKey is not mapped directly
  if (cleanSlug) {
    if (cleanSlug.includes('property') || cleanSlug.includes('home-services') || cleanSlug.includes('house') || cleanSlug.includes('annex') || cleanSlug.includes('apartment') || cleanSlug.includes('flat') || cleanSlug.includes('villa') || cleanSlug.includes('bungalow') || cleanSlug.includes('holiday-home')) {
      return <Home {...iconProps} />;
    }
    if (cleanSlug.includes('room') || cleanSlug.includes('boarding') || cleanSlug.includes('hostel') || cleanSlug.includes('guest-house')) {
      return <Bed {...iconProps} />;
    }
    if (cleanSlug.includes('commercial') || cleanSlug.includes('office') || cleanSlug.includes('shop') || cleanSlug.includes('warehouse') || cleanSlug.includes('restaurant') || cleanSlug.includes('building') || cleanSlug.includes('industrial')) {
      return <Building2 {...iconProps} />;
    }
    if (cleanSlug.includes('land')) {
      return <MapPin {...iconProps} />;
    }
    if (cleanSlug.includes('vehicle') || cleanSlug.includes('car') || cleanSlug.includes('van') || cleanSlug.includes('bus') || cleanSlug.includes('three-wheeler') || cleanSlug.includes('motorcycle') || cleanSlug.includes('bicycle') || cleanSlug.includes('water-transport')) {
      return <Car {...iconProps} />;
    }
    if (cleanSlug.includes('event') || cleanSlug.includes('wedding') || cleanSlug.includes('party') || cleanSlug.includes('conference') || cleanSlug.includes('ground') || cleanSlug.includes('stage') || cleanSlug.includes('sound-dj') || cleanSlug.includes('lighting') || cleanSlug.includes('led-screen')) {
      return <Calendar {...iconProps} />;
    }
    if (cleanSlug.includes('equipment') || cleanSlug.includes('tool') || cleanSlug.includes('appliance-repair') || cleanSlug.includes('wrench')) {
      return <Wrench {...iconProps} />;
    }
    if (cleanSlug.includes('electronic') || cleanSlug.includes('computer-mobile') || cleanSlug.includes('smartphone') || cleanSlug.includes('laptop') || cleanSlug.includes('tv')) {
      return <Smartphone {...iconProps} />;
    }
    if (cleanSlug.includes('fashion') || cleanSlug.includes('cloth') || cleanSlug.includes('shirt')) {
      return <Shirt {...iconProps} />;
    }
    if (cleanSlug.includes('furniture') || cleanSlug.includes('sofa') || cleanSlug.includes('armchair')) {
      return <Sofa {...iconProps} />;
    }
    if (cleanSlug.includes('outdoor') || cleanSlug.includes('camp') || cleanSlug.includes('tent')) {
      return <Tent {...iconProps} />;
    }
    if (cleanSlug.includes('baby') || cleanSlug.includes('medical') || cleanSlug.includes('health') || cleanSlug.includes('wellness')) {
      return <Heart {...iconProps} />;
    }
    if (cleanSlug.includes('pet') || cleanSlug.includes('paw')) {
      return <PawPrint {...iconProps} />;
    }
    if (cleanSlug.includes('office-admin') || cleanSlug.includes('clerk') || cleanSlug.includes('secretary') || cleanSlug.includes('receptionist') || cleanSlug.includes('data-entry') || cleanSlug.includes('customer-service') || cleanSlug.includes('business-services')) {
      return <Briefcase {...iconProps} />;
    }
    if (cleanSlug.includes('it-') || cleanSlug.includes('developer') || cleanSlug.includes('cyber') || cleanSlug.includes('network') || cleanSlug.includes('digital')) {
      return <Laptop {...iconProps} />;
    }
    if (cleanSlug.includes('sales') || cleanSlug.includes('marketing')) {
      return <Megaphone {...iconProps} />;
    }
    if (cleanSlug.includes('accounting') || cleanSlug.includes('finance')) {
      return <Calculator {...iconProps} />;
    }
    if (cleanSlug.includes('hospitality') || cleanSlug.includes('tourism') || cleanSlug.includes('hotel')) {
      return <Hotel {...iconProps} />;
    }
    if (cleanSlug.includes('driving') || cleanSlug.includes('transport') || cleanSlug.includes('truck') || cleanSlug.includes('delivery')) {
      return <Truck {...iconProps} />;
    }
    if (cleanSlug.includes('construction')) {
      return <HardHat {...iconProps} />;
    }
    if (cleanSlug.includes('factory') || cleanSlug.includes('manufacturing')) {
      return <Factory {...iconProps} />;
    }
    if (cleanSlug.includes('education')) {
      return <GraduationCap {...iconProps} />;
    }
    if (cleanSlug.includes('beauty')) {
      return <Scissors {...iconProps} />;
    }
    if (cleanSlug.includes('security')) {
      return <Shield {...iconProps} />;
    }
    if (cleanSlug.includes('freelance') || cleanSlug.includes('remote')) {
      return <Globe {...iconProps} />;
    }
    if (cleanSlug.includes('creative') || cleanSlug.includes('art') || cleanSlug.includes('design')) {
      return <Palette {...iconProps} />;
    }
    if (cleanSlug.includes('legal')) {
      return <Scale {...iconProps} />;
    }
  }

  // 3. Fallback matching by category name
  if (cleanName) {
    if (cleanName.includes('property') || cleanName.includes('home') || cleanName.includes('house')) return <Home {...iconProps} />;
    if (cleanName.includes('room') || cleanName.includes('bed')) return <Bed {...iconProps} />;
    if (cleanName.includes('commercial') || cleanName.includes('building') || cleanName.includes('office')) return <Building2 {...iconProps} />;
    if (cleanName.includes('land')) return <MapPin {...iconProps} />;
    if (cleanName.includes('vehicle') || cleanName.includes('car') || cleanName.includes('truck') || cleanName.includes('transport')) return <Car {...iconProps} />;
    if (cleanName.includes('event') || cleanName.includes('party') || cleanName.includes('wedding')) return <Calendar {...iconProps} />;
    if (cleanName.includes('equipment') || cleanName.includes('tool') || cleanName.includes('repair')) return <Wrench {...iconProps} />;
    if (cleanName.includes('electronic') || cleanName.includes('computer') || cleanName.includes('mobile')) return <Smartphone {...iconProps} />;
    if (cleanName.includes('fashion') || cleanName.includes('cloth')) return <Shirt {...iconProps} />;
    if (cleanName.includes('furniture') || cleanName.includes('sofa')) return <Sofa {...iconProps} />;
    if (cleanName.includes('outdoor') || cleanName.includes('tent')) return <Tent {...iconProps} />;
    if (cleanName.includes('medical') || cleanName.includes('health') || cleanName.includes('wellness')) return <Heart {...iconProps} />;
    if (cleanName.includes('pet') || cleanName.includes('paw')) return <PawPrint {...iconProps} />;
    if (cleanName.includes('admin') || cleanName.includes('business')) return <Briefcase {...iconProps} />;
    if (cleanName.includes('it') || cleanName.includes('tech') || cleanName.includes('digital') || cleanName.includes('developer')) return <Laptop {...iconProps} />;
    if (cleanName.includes('sales') || cleanName.includes('marketing')) return <Megaphone {...iconProps} />;
    if (cleanName.includes('finance') || cleanName.includes('accounting')) return <Calculator {...iconProps} />;
    if (cleanName.includes('hotel') || cleanName.includes('tourism') || cleanName.includes('hospitality')) return <Hotel {...iconProps} />;
    if (cleanName.includes('construction')) return <HardHat {...iconProps} />;
    if (cleanName.includes('factory') || cleanName.includes('manufacturing')) return <Factory {...iconProps} />;
    if (cleanName.includes('education')) return <GraduationCap {...iconProps} />;
    if (cleanName.includes('beauty')) return <Sparkles {...iconProps} />;
    if (cleanName.includes('security')) return <Shield {...iconProps} />;
    if (cleanName.includes('creative') || cleanName.includes('art')) return <Palette {...iconProps} />;
    if (cleanName.includes('legal')) return <Scale {...iconProps} />;
  }

  // 4. Inherit parent icon if child category has parent information
  if (parentIconKey || parentSlug || parentName) {
    return getCategoryIconComponent({
      iconKey: parentIconKey,
      slug: parentSlug,
      name: parentName,
      module,
      className,
      size,
      strokeWidth,
    });
  }

  // 5. Fallback for specific modules
  if (module === 'rental' || module === 'rentals') return <Home {...iconProps} />;
  if (module === 'job' || module === 'jobs') return <Briefcase {...iconProps} />;
  if (module === 'service' || module === 'services') return <Wrench {...iconProps} />;

  // 6. Safe neutral fallback - NEVER raw text, NEVER throw
  return <LayoutGrid {...iconProps} />;
};

export const CategoryIcon: React.FC<CategoryIconProps> = (props) => {
  return getCategoryIconComponent(props);
};
