import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/users.entity";
import { AdminIT } from "../entity/adminIt.entity";

@EntityRepository(AdminIT)
export class AdminITRepository extends Repository<AdminIT>{
    async createAdminIT(user: User){
        const AdminIT = this.create();
        AdminIT.user = user;

        return await AdminIT.save();
    }
}