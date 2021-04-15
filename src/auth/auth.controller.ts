import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return req.user;
  }
}
