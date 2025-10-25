import { Controller, Get, Query, Param } from '@nestjs/common';
import { InsuranceService, InsurancePackage } from './insurance.service.js';

@Controller('api/insurance')
export class InsuranceController {
  constructor(private insuranceService: InsuranceService) {}

  @Get()
  async getInsuranceRecommendations(
    @Query('country') country: string,
    @Query('city') city?: string
  ): Promise<InsurancePackage[]> {
    if (!country) {
      throw new Error('Country parameter is required');
    }

    return this.insuranceService.getInsuranceRecommendations(country, city);
  }

  @Get('countries')
  async getAllCountries(): Promise<string[]> {
    return this.insuranceService.getAllCountries();
  }

  @Get(':id')
  async getPackageById(@Param('id') id: string): Promise<InsurancePackage | null> {
    return this.insuranceService.getPackageById(id);
  }
}
