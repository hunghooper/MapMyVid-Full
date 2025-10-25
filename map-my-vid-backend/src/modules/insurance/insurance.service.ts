import { Injectable } from '@nestjs/common';

export interface InsurancePackage {
  id: string;
  name: string;
  provider: string;
  coverage: string[];
  price: {
    daily: number;
    weekly: number;
    monthly: number;
    currency: string;
  };
  rating: number;
  features: string[];
  description: string;
  coverageLimit: string;
  deductible: string;
  emergencyContact: string;
  claimProcess: string;
  exclusions: string[];
  recommendedFor: string[];
}

@Injectable()
export class InsuranceService {
  private insuranceData: Record<string, InsurancePackage[]> = {
    // Vietnam
    'vietnam': [
      {
        id: 'vietnam_basic',
        name: 'Vietnam Travel Basic',
        provider: 'Bao Viet Insurance',
        coverage: ['Medical expenses up to $50,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 8, weekly: 45, monthly: 150, currency: 'USD' },
        rating: 4.2,
        features: ['24/7 emergency support', 'Vietnamese language support', 'Local hospital network'],
        description: 'Comprehensive travel insurance designed specifically for Vietnam with local support.',
        coverageLimit: '$50,000',
        deductible: '$100',
        emergencyContact: '+84-24-3824-0123',
        claimProcess: 'Online claim submission within 48 hours',
        exclusions: ['Pre-existing conditions', 'Extreme sports', 'War zones'],
        recommendedFor: ['Budget travelers', 'Short-term visits', 'City exploration']
      },
      {
        id: 'vietnam_premium',
        name: 'Vietnam Travel Premium',
        provider: 'Prudential Vietnam',
        coverage: ['Medical expenses up to $100,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation', 'Adventure sports'],
        price: { daily: 15, weekly: 85, monthly: 280, currency: 'USD' },
        rating: 4.6,
        features: ['24/7 emergency support', 'Adventure sports coverage', 'VIP hospital access', 'Trip interruption'],
        description: 'Premium travel insurance with comprehensive coverage for all types of travelers.',
        coverageLimit: '$100,000',
        deductible: '$50',
        emergencyContact: '+84-28-3824-0123',
        claimProcess: 'Priority claim processing within 24 hours',
        exclusions: ['War zones', 'Illegal activities'],
        recommendedFor: ['Adventure travelers', 'Long-term stays', 'Business travelers']
      }
    ],
    // Thailand
    'thailand': [
      {
        id: 'thailand_basic',
        name: 'Thailand Travel Basic',
        provider: 'AIA Thailand',
        coverage: ['Medical expenses up to $75,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 12, weekly: 70, monthly: 220, currency: 'USD' },
        rating: 4.3,
        features: ['24/7 emergency support', 'Thai language support', 'Bangkok hospital network'],
        description: 'Essential travel insurance for Thailand with comprehensive medical coverage.',
        coverageLimit: '$75,000',
        deductible: '$150',
        emergencyContact: '+66-2-123-4567',
        claimProcess: 'Online claim submission with Thai language support',
        exclusions: ['Pre-existing conditions', 'Motorcycle accidents without helmet'],
        recommendedFor: ['First-time visitors', 'Beach destinations', 'Cultural tours']
      },
      {
        id: 'thailand_premium',
        name: 'Thailand Travel Premium',
        provider: 'Allianz Thailand',
        coverage: ['Medical expenses up to $150,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation', 'Adventure activities'],
        price: { daily: 20, weekly: 120, monthly: 380, currency: 'USD' },
        rating: 4.7,
        features: ['24/7 emergency support', 'Adventure sports coverage', 'VIP medical services', 'Trip delay coverage'],
        description: 'Premium coverage for all types of travel in Thailand including adventure activities.',
        coverageLimit: '$150,000',
        deductible: '$100',
        emergencyContact: '+66-2-987-6543',
        claimProcess: 'Express claim processing with English support',
        exclusions: ['War zones', 'Illegal activities'],
        recommendedFor: ['Adventure travelers', 'Island hopping', 'Luxury travelers']
      }
    ],
    // Japan
    'japan': [
      {
        id: 'japan_basic',
        name: 'Japan Travel Basic',
        provider: 'Tokio Marine',
        coverage: ['Medical expenses up to $100,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 18, weekly: 110, monthly: 350, currency: 'USD' },
        rating: 4.5,
        features: ['24/7 emergency support', 'Japanese language support', 'JR Pass coverage'],
        description: 'Comprehensive travel insurance designed for Japan with local expertise.',
        coverageLimit: '$100,000',
        deductible: '$200',
        emergencyContact: '+81-3-1234-5678',
        claimProcess: 'Online claim with Japanese language support',
        exclusions: ['Pre-existing conditions', 'Natural disasters'],
        recommendedFor: ['City exploration', 'Cultural experiences', 'First-time visitors']
      },
      {
        id: 'japan_premium',
        name: 'Japan Travel Premium',
        provider: 'Sompo Japan',
        coverage: ['Medical expenses up to $200,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation', 'Winter sports'],
        price: { daily: 28, weekly: 170, monthly: 550, currency: 'USD' },
        rating: 4.8,
        features: ['24/7 emergency support', 'Winter sports coverage', 'Shinkansen coverage', 'VIP services'],
        description: 'Premium travel insurance with extensive coverage for all Japan activities.',
        coverageLimit: '$200,000',
        deductible: '$100',
        emergencyContact: '+81-3-9876-5432',
        claimProcess: 'Priority processing with multilingual support',
        exclusions: ['War zones', 'Illegal activities'],
        recommendedFor: ['Winter sports', 'Long-term stays', 'Business travelers']
      }
    ],
    // Singapore
    'singapore': [
      {
        id: 'singapore_basic',
        name: 'Singapore Travel Basic',
        provider: 'Great Eastern',
        coverage: ['Medical expenses up to $80,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 15, weekly: 90, monthly: 280, currency: 'USD' },
        rating: 4.4,
        features: ['24/7 emergency support', 'English language support', 'Singapore hospital network'],
        description: 'Essential travel insurance for Singapore with comprehensive coverage.',
        coverageLimit: '$80,000',
        deductible: '$150',
        emergencyContact: '+65-6123-4567',
        claimProcess: 'Online claim submission with English support',
        exclusions: ['Pre-existing conditions', 'Adventure sports'],
        recommendedFor: ['Business travelers', 'City exploration', 'Short stays']
      }
    ],
    // Malaysia
    'malaysia': [
      {
        id: 'malaysia_basic',
        name: 'Malaysia Travel Basic',
        provider: 'Tune Protect',
        coverage: ['Medical expenses up to $60,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 10, weekly: 60, monthly: 190, currency: 'USD' },
        rating: 4.1,
        features: ['24/7 emergency support', 'Malay language support', 'Local hospital network'],
        description: 'Affordable travel insurance for Malaysia with essential coverage.',
        coverageLimit: '$60,000',
        deductible: '$100',
        emergencyContact: '+60-3-1234-5678',
        claimProcess: 'Online claim submission',
        exclusions: ['Pre-existing conditions', 'Extreme sports'],
        recommendedFor: ['Budget travelers', 'Beach destinations', 'Cultural tours']
      }
    ],
    // Indonesia
    'indonesia': [
      {
        id: 'indonesia_basic',
        name: 'Indonesia Travel Basic',
        provider: 'Allianz Indonesia',
        coverage: ['Medical expenses up to $70,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 12, weekly: 70, monthly: 220, currency: 'USD' },
        rating: 4.2,
        features: ['24/7 emergency support', 'Indonesian language support', 'Island coverage'],
        description: 'Comprehensive travel insurance for Indonesia including island hopping.',
        coverageLimit: '$70,000',
        deductible: '$150',
        emergencyContact: '+62-21-1234-5678',
        claimProcess: 'Online claim with local support',
        exclusions: ['Pre-existing conditions', 'Volcano eruptions'],
        recommendedFor: ['Island hopping', 'Adventure travel', 'Cultural experiences']
      }
    ],
    // Philippines
    'philippines': [
      {
        id: 'philippines_basic',
        name: 'Philippines Travel Basic',
        provider: 'Sun Life Philippines',
        coverage: ['Medical expenses up to $65,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 11, weekly: 65, monthly: 200, currency: 'USD' },
        rating: 4.0,
        features: ['24/7 emergency support', 'English language support', 'Island coverage'],
        description: 'Essential travel insurance for the Philippines with island coverage.',
        coverageLimit: '$65,000',
        deductible: '$125',
        emergencyContact: '+63-2-1234-5678',
        claimProcess: 'Online claim submission',
        exclusions: ['Pre-existing conditions', 'Typhoon-related claims'],
        recommendedFor: ['Island hopping', 'Beach destinations', 'Adventure travel']
      }
    ],
    // Default/Generic
    'default': [
      {
        id: 'global_basic',
        name: 'Global Travel Basic',
        provider: 'World Nomads',
        coverage: ['Medical expenses up to $100,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation'],
        price: { daily: 15, weekly: 90, monthly: 280, currency: 'USD' },
        rating: 4.3,
        features: ['24/7 emergency support', 'Multi-language support', 'Global coverage'],
        description: 'Comprehensive travel insurance for worldwide travel.',
        coverageLimit: '$100,000',
        deductible: '$200',
        emergencyContact: '+1-800-123-4567',
        claimProcess: 'Online claim submission with global support',
        exclusions: ['Pre-existing conditions', 'War zones'],
        recommendedFor: ['World travelers', 'Backpackers', 'Long-term travel']
      },
      {
        id: 'global_premium',
        name: 'Global Travel Premium',
        provider: 'Allianz Global',
        coverage: ['Medical expenses up to $250,000', 'Trip cancellation', 'Baggage loss', 'Emergency evacuation', 'Adventure sports'],
        price: { daily: 25, weekly: 150, monthly: 480, currency: 'USD' },
        rating: 4.6,
        features: ['24/7 emergency support', 'Adventure sports coverage', 'VIP services', 'Global network'],
        description: 'Premium travel insurance with extensive global coverage.',
        coverageLimit: '$250,000',
        deductible: '$100',
        emergencyContact: '+1-800-987-6543',
        claimProcess: 'Priority processing with global support',
        exclusions: ['War zones', 'Illegal activities'],
        recommendedFor: ['Adventure travelers', 'Business travelers', 'Luxury travel']
      }
    ]
  };

  async getInsuranceRecommendations(country: string, city?: string): Promise<InsurancePackage[]> {
    // Normalize country name to lowercase
    const normalizedCountry = country.toLowerCase();
    
    // Get insurance packages for the country
    let packages = this.insuranceData[normalizedCountry] || this.insuranceData['default'];
    
    // If we have specific city data, we could add city-specific logic here
    // For now, we'll return 2-3 packages based on the country
    
    // Sort by rating and return top 2-3 packages
    const sortedPackages = packages.sort((a, b) => b.rating - a.rating);
    
    // Return 2-3 packages (prefer 3 if available, otherwise 2)
    return sortedPackages.slice(0, Math.min(3, sortedPackages.length));
  }

  async getAllCountries(): Promise<string[]> {
    return Object.keys(this.insuranceData).filter(key => key !== 'default');
  }

  async getPackageById(id: string): Promise<InsurancePackage | null> {
    for (const countryPackages of Object.values(this.insuranceData)) {
      const package_ = countryPackages.find(pkg => pkg.id === id);
      if (package_) {
        return package_;
      }
    }
    return null;
  }
}
