import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { SanitizedUser } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(authConfig.KEY)
    private readonly authConstants: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<SanitizedUser> {
    const { email, password } = validateUserDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await compare(password, user.password_hash);

    if (!passwordMatches) {
      return null;
    }

    const { password_hash, ...result } = user;
    return result;
  }

  async login(user: SanitizedUser): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.authConstants.jwt.secret,
      expiresIn: '1d',
    });

    return { access_token };
  }
}
