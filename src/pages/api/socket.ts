import { Server } from 'socket.io';
import cors from 'cors';

const corsMiddleware = cors();

// export default function handler(req: any, res: any) {
//     let chat: any = [];
//     if (res?.socket?.server?.io) {
//         console.log('Socket is already running')
//         res?.socket?.server?.io.send(chat)
//     } else {
//         console.log('Socket is initializing')
//         const io = new Server(res.socket.server)
//         res.socket.server.io = io;

//         io.on('connection', socket => {
//             console.log('connect with backend')
//             console.log('actual chat: ', chat)
//             socket.send(chat)
//             socket.on('new-message', msg => {
//                 console.log('nova mensagem no back', msg)
//                 chat.push(msg);
//                 socket.broadcast.emit('update-chat', chat);
//             })
//         })

        

//     }
//     res.end()
// }

export default function SocketHandler(req: any, res: any) {
    let chat: any = [];

    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
    }

    const io = new Server(res.socket.server);

    // Event handler for client connections
    io.on('connection', (socket) => {
        const clientId = socket.id;
        console.log('A client connected');
        console.log(`A client connected. ID: ${clientId}`);
        socket.emit('update-chat', chat);

        // Event handler for receiving messages from the client
        socket.on('new-message', (data) => {
            console.log('Received message:', data);
            chat.push(data);
            io.emit('update-chat', chat)
        });

        // Event handler for client disconnections
        socket.on('disconnect', () => {
            console.log('A client disconnected.');
        });
    });

    // Apply the CORS middleware to the request and response
    corsMiddleware(req, res, () => {
        res.socket.server.io = io;
        res.end();
    });
}