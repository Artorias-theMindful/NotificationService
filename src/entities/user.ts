import express, { Request, Response } from "express";
import { Notification } from "./notification";
import { db } from './db'
export type User = {
    id: number,
    username: string
}
export type UserProps = {
    username: string
}
export class UserOptions
{
    async getAllUsers(){
        const user : User[] = await db.select('id', 'username')
                .from('users')
            return user
    }
    async createUser(props: UserProps){
        db('users')
            .insert(props)
            .then(() => {
                console.log('Inserted user');
            })
            .catch(() => {
                console.error('Error inserting user');
            })
    }

    async getAllNotifications(id: number): Promise<Notification[]> {
            const notifications : Notification[] = await db.select('id', 'created_by', 'created_at', 'is_read', 'text')
                .from('notifications')
                .where('notifications.sent_to', id)

            return notifications;
    }

    async getUnreadNotifications(id: number): Promise<Notification[]> {
            const notifications : Notification[] = await db.select('id', 'created_by', 'created_at', 'text')
                .from('notifications')
                .where({ sent_to: id, is_read: false })
            return notifications;
    }

    async readUser(id: number) {
            const user : User = await db.select('id', 'username')
                .from('users')
                .where('id', id)
            return user
        
    }

    async getUsersExceptChosen(id: number) {
        const users : User [] = await db.select('id', 'username')
            .from('users')
            .whereNot('id', id)
        return users
    }
}
