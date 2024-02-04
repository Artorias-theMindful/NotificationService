import { db } from "../entities/db";
import { Notification, NotificationProps } from "../entities/notification";
export class NotificationRepository{
    async getAll(){
        const notifications : Notification[] = await db.select('id', 'created_by', 'created_at', 'is_read', 'text', 'sent_to')
                .from('notifications')
            return notifications;
    }

    async getById(id: number){
        const notification : Notification = await db.select('id', 'created_by', 'sent_to', 'created_at', 'text')
                .from('notifications')
                .where('id', id)
            return notification
    }

    async create(props: NotificationProps){
        await db('notifications').insert(props)
    }

    async markAsRead(id: number){
        await db('notifications')
              .where('notifications.id', id)
              .update({ is_read: true });
    }
}