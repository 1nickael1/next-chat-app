import { Server } from 'socket.io';
import {NextApiResponse} from 'next'

export default function handler(req: any, res: any) {
    let chat: any = [];
    if (res?.socket?.server?.io) {
        console.log('Socket is already running')
        res?.socket?.server?.io.send(chat)
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io;

        io.on('connection', socket => {
            console.log('connect with backend')
            console.log('actual chat: ', chat)
            socket.send(chat)
            socket.on('new-message', msg => {
                console.log('nova mensagem no back', msg)
                chat.push(msg);
                socket.broadcast.emit('update-chat', chat);
            })
        })

        

    }
    res.end()
}