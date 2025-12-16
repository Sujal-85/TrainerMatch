import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Uncomment when Auth is fully ready if needed
// import { RolesGuard } from '../auth/roles.guard';

@Controller('dashboard')
// @UseGuards(JwtAuthGuard) // validation disabled for initial integration test
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    async getStats() {
        return this.dashboardService.getStats();
    }

    @Get('analytics')
    async getAnalytics() {
        return this.dashboardService.getAnalytics();
    }
    @Get('admin-stats')
    async getAdminStats() {
        return this.dashboardService.getAdminStats();
    }
}
