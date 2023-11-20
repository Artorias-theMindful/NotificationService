declare var require: any
import path from 'path';
import express, { Request, Response} from "express";
import { User, UserOptions, UserProps } from "./entities/user";
import {Notification, NotificationOptions, NotificationProps} from "./entities/notification";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: path.resolve(__dirname, '../.env') });
const app = express()
app.use(express.json())

const userOptions = new UserOptions()
const notificationOptions = new NotificationOptions()
app
  .route('/users')

  .get(async (req: Request, res: Response) => {
    try {
      const data = await userOptions.readUser(req.body.id)
      res.status(200).json({
        user: data 
      })
    }
    catch(error){
      res.sendStatus(404)
    }
  })

  .post((req: Request, res: Response) => {
    try {
      userOptions.createUser(req.body)
      res.sendStatus(200)
    }
    catch {
      res.sendStatus(404)
    }
  })

app
  .route('/users/notifications')

  .post((req: Request, res: Response) => {
    try {
      notificationOptions.createNotification(req.body)
      res.sendStatus(200)
    }
    catch {
      res.sendStatus(404)
    }
  })

  .get(async (req: Request, res: Response) => {
    
    try {
      const data = await userOptions.getAllNotifications(req.body.id)
      res.status(200).json({
        notifications: data 
      })
    }
    catch {
      res.sendStatus(404)
    }
  })

app
  .route('/notifications/:id')
  
  .get(async (req: Request, res: Response) => {
    try {
      const data = await notificationOptions.readNotification(Number(req.params.id))
      res.status(200).json({
        notification: data 
      })
    }
    catch {
      res.sendStatus(404)
    }
  })

app
  .route('/users/notifications/notRead')

  .get(async (req: Request, res: Response) =>{
    try {
      const data = await userOptions.getUnreadNotifications(req.body.id)
      res.status(200).json({
        notifications: data 
      })
    }
    catch(error) {
      res.sendStatus(404)
    }
  })

if (typeof process.env.PORT === 'string'){
  app.listen(Number(process.env.PORT), () => {
    console.log(`listening ${Number(process.env.PORT)}`)
  })
}
