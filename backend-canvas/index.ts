import expressWs from "express-ws";
import express from 'express';
import cors from 'cors';
import {ActiveConnections, CanvasDraw, IncomingMessage} from "./types";

const app = express()
const port = 8000;

expressWs(app);
app.use(cors());

const canvasRouter = express.Router();

const activeConnection: ActiveConnections = {};
let canvasDrawData: CanvasDraw[] = [];

canvasRouter.ws('/', (ws, _req) => {
    const id = crypto.randomUUID();
    console.log(`Client connected id=${id}`);

    activeConnection[id] = ws;
    ws.send(JSON.stringify({type: 'WELCOME', payload: canvasDrawData}));

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        canvasDrawData.push(parsedMessage.payload);

        if (parsedMessage.type === 'DRAW') {
            Object.values(activeConnection).forEach(connection => {
                const outgoingCanvasDraw = {type: 'DRAW', payload: canvasDrawData};
                connection.send(JSON.stringify(outgoingCanvasDraw));
            })
        }
    });

    ws.on('close', () => {
        console.log(`User disconnected id=${id}`);
        delete activeConnection[id];
    });
});

app.use('/canvas', canvasRouter);

app.listen(port, () => {
    console.log(`Server on ${port} port!`);
});
