import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      userName: string;
      password: string;
      dob?: string;
      phone?: string;
      address?: string;
      city?: string;
      country?: string;
      postalCode?: string;
      bio?: string;
    },
  ) {
    return this.authService.signup(
      body.name,
      body.email,
      body.userName,
      body.password,
      body.dob,
      body.phone,
      body.address,
      body.city,
      body.country,
      body.postalCode,
      body.bio,
    );
  }

  @Post('login')
  async login(@Body() body: { emailOrUsername: string; password: string }) {
    return this.authService.login(body.emailOrUsername, body.password);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('validate')
  async validate(@Query('token') token: string) {
    return this.authService.validate(token);
  }
}
