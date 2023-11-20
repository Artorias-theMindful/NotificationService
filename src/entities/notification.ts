import express, { Request, Response } from "express";
import { db } from './db'
export type Notification = {
    id: number,
    created_by: number,
    sent_to: number,
    created_at: Date,
    is_read: boolean,
    text: string
}

export type NotificationProps = {
    created_by: number,
    sent_to: number,
    text: string
}

export class NotificationOptions
{
    async createNotification(props: NotificationProps){
        db('notifications')
            .insert(props)
            .then(() => {
                console.log('Notification created');
            })
            .catch((error: any) => {
                console.error(error);
            })
    }

    async markAsRead(id: number){
        try {
            await db('notifications')
              .where('notifications.id', id)
              .update({ is_read: true });
          } catch (error) {
            throw error;
          }
    }

    async readNotification(id: number){
        try {
            const notification : Notification = await db.select('id', 'created_by', 'sent_to', 'created_at', 'text')
                .from('notifications')
                .where('id', id)
            this.markAsRead(id)
            return notification
        }
        catch (error) {
            throw error
        }
    }
}