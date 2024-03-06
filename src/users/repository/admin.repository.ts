import { EntityRepository, Repository } from "typeorm";
import { Admin } from "../entity/admin.entity";
import { User } from "../entity/users.entity";

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin>{
    async createAdmin(user: User){
        const Admin = this.create();
        Admin.user = user;

        return await Admin.save();
    }
}