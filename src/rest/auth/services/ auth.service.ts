import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserSignInDto } from '../dto/user-sign.in.dto'
import { UserService } from '../../user/services/user.service'
import { AuthMapper } from '../mapper/ auth-mapper'
import { UserSignUpDto } from '../dto/ user-sign.up.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto) {
    this.logger.log(`Sign up ${userSignUpDto.username}`)

    const existingUserByEmail = await this.userService.findByEmail(
      userSignUpDto.email,
    )
    if (existingUserByEmail) {
      throw new BadRequestException('El email ya está en uso')
    }

    const existingUserByUsername = await this.userService.findByUsername(
      userSignUpDto.username,
    )
    if (existingUserByUsername) {
      throw new BadRequestException('El nombre de usuario ya está en uso')
    }

    const user = await this.userService.create(
      this.authMapper.toCreateDto(userSignUpDto),
    )
    return this.getAccessToken(user.id)
  }

  async signIn(userSignInDto: UserSignInDto) {
    this.logger.log(`Sign in ${userSignInDto.username}`)
    const user = await this.userService.findByUsername(userSignInDto.username)
    if (!user) {
      throw new BadRequestException('Nombre de usuario o contraseña inválidos')
    }
    const isValidPassword = await this.userService.validatePassword(
      userSignInDto.password,
      user.password,
    )
    if (!isValidPassword) {
      throw new BadRequestException('Nombre de usuario o contraseña inválidos')
    }
    return this.getAccessToken(user.id)
  }

  async validateUser(id: string) {
    this.logger.log(`Validando usuario ${id}`)
    return await this.userService.findOne(id)
  }

  private getAccessToken(userId: string) {
    this.logger.log(`Obteniendo token de acceso para ${userId}`)
    try {
      const payload = {
        id: userId,
      }
      const access_token = this.jwtService.sign(payload)
      return {
        access_token,
      }
    } catch (error) {
      this.logger.error(error)
      throw new ConflictException('Error al generar el token de acceso')
    }
  }
}