import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
    secret: 'kodekliring',
    signOptions: {
        expiresIn: 3600 * 1000,
    },
}

export const refrestTokenConfig: JwtSignOptions = {
    expiresIn: 720 * 3600 * 1000,
}