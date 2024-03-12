
export interface CanvasDraw {
  x: number;
  y: number;
}

export interface IncomingMessage {
  type: string;
  payload: CanvasDraw[];
}