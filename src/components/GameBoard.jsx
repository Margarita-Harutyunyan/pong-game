import React from 'react';
import { useRef, useEffect } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);

    const width = 500;
    const height = 500;

    const BALL_SIZE = 7;
    let ballPosition = useRef({x: 20, y: 30});
    
    let xSpeed = useRef(4);
    let ySpeed = useRef(2);

    const fillCanvas = (ctx) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    };

    const drawBall = (ctx) => {
        ctx.fillStyle = "white";
        ctx.fillRect(ballPosition.current.x, ballPosition.current.y, BALL_SIZE, BALL_SIZE);
    };

    const updateCanvas = () => {
        ballPosition.current.x += xSpeed.current;
        ballPosition.current.y += ySpeed.current;

    };

    const checkCollision = () => {
        let ball = {
            left: ballPosition.current.x,
            right: ballPosition.current.x + BALL_SIZE,
            top: ballPosition.current.y,
            bottom: ballPosition.current.y + BALL_SIZE,
        };

        if (ball.left < 0 || ball.right > width) {
            xSpeed.current = -xSpeed.current;
        }

        if (ball.top < 0 || ball.bottom > height) {
            ySpeed.current = -ySpeed.current;
        }
    }

    const gameLoop = () => {
        console.log('drawing')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        fillCanvas(ctx);
        drawBall(ctx);
        updateCanvas();
        checkCollision();

        requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        gameLoop();
    }, []);

  return (
    <canvas ref={canvasRef} id="canvas" width={width} height={height}></canvas>
  );
}

export default GameBoard;