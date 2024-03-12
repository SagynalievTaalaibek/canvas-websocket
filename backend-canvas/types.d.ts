import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface CanvasDraw {
    x: string;
    y: string;
}

export interface IncomingMessage {
    type: string;
    payload: CanvasDraw;
}