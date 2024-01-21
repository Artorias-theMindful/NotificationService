declare var require: any
import WebSocket from 'ws';
import path from 'path';
import express, { Request, Response, json} from "express";
import { User, UserOptions, UserProps } from "./entities/user";
import {Notification, NotificationOptions, NotificationProps} from "./entities/notification";
import { config as dotenvConfig } from 'dotenv';
import { WebSocketServer } from 'ws';
dotenvConfig({ path: path.resolve(__dirname, '../.env') });
const app = express()
const cors = require('cors');
const http = require('http')
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
app.use(express.json())
const userOptions = new UserOptions()
const notificationOptions = new NotificationOptions()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
const clients = new Map<number, WebSocket>();
wss.on('connection', (ws: WebSocket) => {
  let a: number
  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);
    const clientId = parsedMessage.clientId;
    clients.set(clientId, ws);
  })
  ws.on('close', () =>{
    const clientIdToDelete = Array.from(clients.entries())
      .find(([_, value]) => value === ws)?.[0];

    if (clientIdToDelete) {
      clients.delete(clientIdToDelete);
    }
  })
})
app
  .route('/users')
  .get(async (req: Request, res: Response) => {
    const data = await userOptions.getAllUsers()
      res.status(200).json({
        user: data
      })
  })
  .post((req: Request, res: Response) => {
    userOptions.createUser(req.body)
    res.sendStatus(200)
})
app
  .route('/users/:id')
  .get(async (req: Request, res: Response) => {
      const data = await userOptions.readUser(Number(req.params.id))
      res.status(200).json({
        user: data 
      })
  })
app
  .route('/users/:id/notifications')

  .post(async (req: Request, res: Response) => {
      await notificationOptions.createNotification(req.body)
      const ws = clients.get(req.body.sent_to);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: "UPDATE" }));
      }
      res.sendStatus(200)

      })
  

  .get(async (req: Request, res: Response) => {
      const data = await userOptions.getAllNotifications(Number(req.params.id))
      res.status(200).json({
        notifications: data 
      })
  })

app
  .route('/users/:userId/notifications/:notificationId')
  .post(async (req: Request, res: Response) => {
    notificationOptions.markAsRead(Number(req.params.notificationId))
    res.sendStatus(200)
  })
app
  .route('/users/:id/notifications/notRead')

  .get(async (req: Request, res: Response) =>{
      const data = await userOptions.getUnreadNotifications(Number(req.params.id))
      res.status(200).json({
        notifications: data 
      })
  })
  app
  .route('/users/:id/usersExceptChosen')
  .get(async (req : Request, res: Response) =>{
      const data = await userOptions.getUsersExceptChosen(Number(req.params.id))
      const user = await userOptions.readUser(Number(req.params.id))
      res.status(200).json({
        chosenUser: user,
        otherUsers: data 
      })
  })
if (typeof process.env.PORT === 'string'){
  app.listen(Number(process.env.PORT), () => {
    console.log(`listening ${Number(process.env.PORT)}`)
  })
  server.listen(Number(process.env.PORT) + 1, () => {
    console.log(`websocket ${Number(process.env.PORT) + 1}`)
  })
}

