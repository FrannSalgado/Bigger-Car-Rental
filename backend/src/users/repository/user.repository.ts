import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user.entity";
import {Repository} from "typeorm";
import {FindByQueryDto} from "../dto/find-by-query.dto";

export class  UserRepository {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    async findByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findByQuery({ username, email }: FindByQueryDto) {
        return this.usersRepository.findOne({ where: [{ username }, { email }] });
    }
    async saveUser(user:User){
        const newUser = this.usersRepository.create(user)
        return  this.usersRepository.save(newUser)
    }

}
