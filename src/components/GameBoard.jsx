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

    const PADDLE_WIDTH = 7;
    const PADDLE_HEIGHT = 28;
    const PADDLE_OFFSET = 10;

    let leftPaddleTop = 10;
    let rightPaddleTop = 30;

    const fillCanvas = (ctx) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
    };

    const drawBall = (ctx) => {
        ctx.fillStyle = "white";
        ctx.fillRect(ballPosition.current.x, ballPosition.current.y, BALL_SIZE, BALL_SIZE);
    };

    const drawPaddles = (ctx) => {
        ctx.fillStyle = "white";

        // left paddle
        ctx.fillRect(PADDLE_OFFSET, leftPaddleTop, PADDLE_WIDTH, PADDLE_HEIGHT);

        // right paddle
        ctx.fillRect(width - PADDLE_OFFSET - PADDLE_WIDTH, rightPaddleTop, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

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
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        let position = e.clientY - canvas.getBoundingClientRect().top;
        if (position < 0) {
            position = 0;
        }
        else if (position > height - PADDLE_HEIGHT) {
            position = height - PADDLE_HEIGHT;
        }
        rightPaddleTop = position;
    }

    const gameLoop = () => {
        console.log('drawing')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        fillCanvas(ctx);
        drawBall(ctx);
        drawPaddles(ctx);
        updateCanvas();
        checkCollision();

        requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        gameLoop();
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

  return (
    <canvas ref={canvasRef} id="canvas" width={width} height={height}></canvas>
  );
}

export default GameBoard;