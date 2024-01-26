import WebSocket from 'ws';
import path from 'path';
import express, { Request, Response} from "express";
import { config as dotenvConfig } from 'dotenv';
import { NotificationService } from './service/notificationService';
import { UserService } from './service/userService';
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
const userService = new UserService()
const notificationService = new NotificationService()
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
    const data = await userService.getAllUsers()
      res.status(200).json({
        user: data
      })
  })
  .post((req: Request, res: Response) => {
    userService.createUser(req.body).then(() => res.sendStatus(200))
})
app
  .route('/users/:id')
  .get(async (req: Request, res: Response) => {
      const data = await userService.readUser(Number(req.params.id))
      res.status(200).json({
        user: data 
      })
  })
app
  .route('/users/:id/notifications')

  .post(async (req: Request, res: Response) => {
      await notificationService.createNotification(req.body)
      const ws = clients.get(req.body.sent_to);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: "UPDATE" }));
      }
      res.sendStatus(200)

      })
  

  .get(async (req: Request, res: Response) => {
      const data = await userService.getAllNotifications(Number(req.params.id))
      res.status(200).json({
        notifications: data 
      })
  })

app
  .route('/notifications/:notificationId')
  .post(async (req: Request, res: Response) => {
    
    await notificationService.markAsRead(Number(req.params.notificationId))
    res.sendStatus(200)
  })
app
  .route('/users/:id/notifications/notRead')

  .get(async (req: Request, res: Response) =>{
      const data = await userService.getUnreadNotifications(Number(req.params.id))
      res.status(200).json({
        notifications: data 
      })
  })
  app
  .route('/users/:id/usersExceptChosen')
  .get(async (req : Request, res: Response) =>{
      const chosenUser = await userService.readUser(Number(req.params.id))
      const otherUsers = await userService.getUsersExceptChosen(Number(req.params.id))
      res.status(200).json({
        chosenUser: chosenUser,
        otherUsers: otherUsers
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

