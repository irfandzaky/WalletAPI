import { EntityRepository, Repository } from "typeorm";
import { User } from "src/users/entity/users.entity";
import { RefreshToken } from "../entity/refresh-token.entity";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken>{
    async createRefreshToken(user: User, ttl: number): Promise<RefreshToken>{
        const refreshToken = this.create();
        refreshToken.user = user;
        refreshToken.isRevoked = false;
        const expiredAt = new Date();
        expiredAt.setTime(expiredAt.getTime() + 720 * 3600 * 1000);
        refreshToken.expiredAt = expiredAt;

        return await refreshToken.save();
    }
}