import { User, UserProps } from "../entities/user";
import { db } from '../entities/db';
export class UserRepository {
    async getAll(){
        const users : User[] = await db.select('id', 'username')
                .from('users')
            return users
    }
    
    async getById(id: number){
        const user : User = await db.select('id', 'username')
                .from('users')
                .where('id', id)
            return user
    }
    
    create(props: UserProps){
        db('users').insert(props)
    }
}