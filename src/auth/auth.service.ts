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

  async signUser(user: SanitizedUser): Promise<string> {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.authConstants.jwt.secret,
      expiresIn: this.authConstants.jwt.expiresIn,
    });
  }

  async login(user: SanitizedUser): Promise<{ access_token: string }> {
    const access_token = await this.signUser(user);

    return { access_token };
  }
}
