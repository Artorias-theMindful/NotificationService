import { Notification } from "../entities/notification";
import { User, UserProps } from "../entities/user";
import { UserRepository } from "../repos/userRepository";
import { NotificationService } from "./notificationService"
export class UserService
{
    userRepository: UserRepository
    notificationService: NotificationService
    constructor() {
        this.userRepository = new UserRepository()
        this.notificationService = new NotificationService()
    }
    async getAllUsers(){
        const users: User[] = await this.userRepository.getAll()
        return users
    }
    async createUser(props: UserProps){
        await this.userRepository.create(props)
    }

    async getAllNotifications(id: number) {
        const notifications : Notification[] = await this.notificationService.getAllNotifications()
        return notifications.filter((notification) => notification.sent_to == id);
    }

    async getUnreadNotifications(id: number) {
        const notifications : Notification[] = await this.getAllNotifications(id)
        return notifications.filter((notification) => notification.is_read == false);
    }

    async readUser(id: number) {
        const user: User = await this.userRepository.getById(id)
        return user
    }

    async getUsersExceptChosen(id: number) {
        const users: User[] = await this.userRepository.getAll()
        return users.filter((user) => user.id != id)
    }
}
