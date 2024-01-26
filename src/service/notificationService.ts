import { Notification, NotificationProps } from "../entities/notification";
import { NotificationRepository } from "../repos/notificationRepository";
export class NotificationService
{
    notificationRepository: NotificationRepository
    constructor() {
        this.notificationRepository = new NotificationRepository()
    }
    
    async getAllNotifications(){
        return this.notificationRepository.getAll()
    }

    async createNotification(props: NotificationProps){
        await this.notificationRepository.create(props)
    }

    async markAsRead(id: number){
        await this.notificationRepository.markAsRead(id)
    }

    async readNotification(id: number){
        const notification : Notification = await this.notificationRepository.getById(id)
        return notification
    }
}