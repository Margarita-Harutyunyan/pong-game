import React from 'react';
import { useRef, useEffect } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);

    const width = 500;
    const height = 500;

    const BALL_SIZE = 7;
    let ballPosition = {x: 20, y: 30};
    
    let xSpeed = 4;
    let ySpeed = 2;

    const fillCanvas = (ctx) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    };

    const drawBall = (ctx) => {
        ctx.fillStyle = "white";
        ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);
    };

    const updateCanvas = () => {
        ballPosition.x += xSpeed;
        ballPosition.y += ySpeed;
    };

    const checkCollision = () => {
        let ball = {
            left: ballPosition.x,
            right: ballPosition.x + BALL_SIZE,
            top: ballPosition.y,
            bottom: ballPosition.y + BALL_SIZE,
        };

        if (ball.left < 0 || ball.right > width) {
            xSpeed = -xSpeed;
        }

        if (ball.top < 0 || ball.bottom > height) {
            ySpeed = -ySpeed;
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

        setTimeout( gameLoop, 30);
    };

    useEffect(() => {
        gameLoop();
    }, []);

  return (
    <canvas ref={canvasRef} id="canvas" width={width} height={height}></canvas>
  );
}

export default GameBoard;