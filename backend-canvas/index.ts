import expressWs from "express-ws";
import express from 'express';
import cors from 'cors';
import {ActiveConnections} from "./types";

const app = express()
const port = 8000;

expressWs(app);
app.use(cors());

const canvasRouter = express.Router();

const activeConnection: ActiveConnections = {};

canvasRouter.ws('/', (ws, req) => {
    const id = crypto.randomUUID();
    console.log(`Client connected id=${id}`);

    activeConnection[id] = ws;
});

app.use('/canvas', canvasRouter);

app.listen(port, () => {
    console.log(`Server on ${port} port!`);
});
