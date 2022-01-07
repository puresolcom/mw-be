import { LocalAuthGuard } from './../guards/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  // get current logged in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() request) {
    return request.user;
  }
}
