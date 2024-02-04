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