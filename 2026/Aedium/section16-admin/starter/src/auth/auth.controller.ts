import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { type Request } from "express";

import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  @Public()
  signUp(@Body() signInDto: SignUpDto) {
    return this.authService.signUp(signInDto.email, signInDto.password);
  }

  @Get("refresh")
  @Public()
  refreshToken(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @Get("logout")
  signout(@Req() req: any) {
    return this.authService.signOut(req.user);
  }
}
