import React from 'react';
import { useRef, useEffect } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);

    const fillCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = canvas.width;
        let height = canvas.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    }

    useEffect(() => {
        fillCanvas();
    }, []);

  return (
    <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
  );
}

export default GameBoard;