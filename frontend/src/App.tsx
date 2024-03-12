import React, { useEffect, useRef } from 'react';
import './App.css';
import { CanvasDraw, IncomingMessage } from './types';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef<boolean>(false);

  const ws = useRef<WebSocket | null>(null);

  const startDraw = (data: CanvasDraw[]) => {
    const context = contextRef.current;
    if (!context) return;

    context.save();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    data.forEach(({x, y}) => {
      context.fillRect(x, y, 1, 1);
    });

    context.restore();
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/canvas');

    ws.current.addEventListener('close', () => console.log('ws close!'));

    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'DRAW') {
        startDraw(decodedMessage.payload);
      }

      if (decodedMessage.type === 'WELCOME') {
        startDraw(decodedMessage.payload);
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const {offsetX, offsetY} = getCanvasCoordinates(nativeEvent);

    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    }
    isDrawing.current = true;
  };

  const sendCanvasData = (draw: CanvasDraw) => {
    if (!ws.current) return;

    const data = {type: 'DRAW', payload: draw};
    ws.current.send(JSON.stringify(data));
  };

  const draw = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }

    const {offsetX, offsetY} = getCanvasCoordinates(nativeEvent);

    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

    sendCanvasData({x: offsetX, y: offsetY});
  };

  const getCanvasCoordinates = (event: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      return {offsetX, offsetY};
    }
    return {offsetX: 0, offsetY: 0};
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

  return (
    <>
      <div className="box">
        <canvas
          width={500}
          height={500}
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </div>
    </>
  );
};

export default App;