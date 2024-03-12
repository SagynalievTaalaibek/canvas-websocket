import React, { useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef<boolean>(false);

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

  const draw = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }

    const {offsetX, offsetY} = getCanvasCoordinates(nativeEvent);

    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
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