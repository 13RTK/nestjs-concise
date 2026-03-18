import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signInDto: SignUpDto) {
    return this.authService.signUp(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  signout(@Body() body: { accessToken: string }) {
    return this.authService.signOut(body.accessToken);
  }
}
