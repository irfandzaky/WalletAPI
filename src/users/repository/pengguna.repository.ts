import { EntityRepository, Repository } from "typeorm";
import { Pengguna } from "../entity/pengguna.entity";
import { User } from "../entity/users.entity";

@EntityRepository(Pengguna)
export class PenggunaRepository extends Repository<Pengguna>{
    async createPengguna(user: User){
        const pengguna = this.create();
        pengguna.user = user;

        return await pengguna.save()
    }
}