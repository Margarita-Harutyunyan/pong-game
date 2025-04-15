import React from 'react';
import { useRef, useEffect } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);

    const width = 500;
    const height = 500;

    const BALL_SIZE = 7;
    let ballPosition = useRef({x: 0, y: 0});
    
    let xSpeed = useRef(0);
    let ySpeed = useRef(0);

    const PADDLE_WIDTH = 7;
    const PADDLE_HEIGHT = 50;
    const PADDLE_OFFSET = 10;

    let leftPaddleTop = 10;
    let rightPaddleTop = 30;

    let leftScore = 0;
    let rightScore = 0;
    let gameOver = false;

    const MAX_COMPUTER_SPEED = 2;

    const initBall = () => {
        ballPosition.current = {x: 20, y: 30};
        xSpeed.current = 4;
        ySpeed.current = 2;
    };

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
    };

    const drawScores = (ctx) => {
        ctx.font = "42px monospace";
        ctx.textAlign = "left";
        ctx.fillText(leftScore.toString(), 66, 80);
        ctx.textAlign = "right";
        ctx.fillText(rightScore.toString(), width -66, 80);
    };

    const followBall = () => {
        let ball = {
            top: ballPosition.current.y,
            bottom: ballPosition.current.y + BALL_SIZE,
        };

        let leftPaddle = {
            top: leftPaddleTop,
            bottom: leftPaddleTop + PADDLE_HEIGHT,
        };

        if (ball.top < leftPaddle.top) {
            leftPaddleTop -= MAX_COMPUTER_SPEED;
        } else if (ball.bottom < leftPaddle.bottom) {
            leftPaddleTop += MAX_COMPUTER_SPEED;
        }
    };

    const updateCanvas = () => {
        ballPosition.current.x += xSpeed.current;
        ballPosition.current.y += ySpeed.current;
        followBall();
    };

    const checkPaddleCollision = (ball, paddle) => {
        return (
            ball.left < paddle.right &&
            ball.right > paddle.left &&
            ball.top < paddle.bottom &&
            ball.bottom > paddle.top
        );
    };

    const adjustAngle = (distanceFromTop, distanceFromBottom) => {
        if (distanceFromTop < 0) {
            ySpeed.current -= 0.5;
        } else if (distanceFromBottom < 0) {
            ySpeed.current += 0.5;
        }
    };

    const checkCollision = () => {
        let ball = {
            left: ballPosition.current.x,
            right: ballPosition.current.x + BALL_SIZE,
            top: ballPosition.current.y,
            bottom: ballPosition.current.y + BALL_SIZE,
        };

        let leftPaddle = {
            left: PADDLE_OFFSET,
            right: PADDLE_OFFSET + PADDLE_WIDTH,
            top: leftPaddleTop,
            bottom: leftPaddleTop + PADDLE_HEIGHT,
        };

        let rightPaddle = {
            left: width - (PADDLE_WIDTH + PADDLE_OFFSET),
            right: width - PADDLE_OFFSET,
            top: rightPaddleTop,
            bottom: rightPaddleTop + PADDLE_HEIGHT,
        };

        if (checkPaddleCollision(ball, leftPaddle)) {
            let distanceFromTop = ball.top - leftPaddle.top;
            let distanceFromBottom = leftPaddle.bottom - ball.bottom;
            adjustAngle(distanceFromTop, distanceFromBottom);
            xSpeed.current = Math.abs(xSpeed.current);
        }

        if (checkPaddleCollision(ball, rightPaddle)) {
            let distanceFromTop = ball.top - rightPaddle.top;
            let distanceFromBottom = rightPaddle.bottom - ball.bottom;
            adjustAngle(distanceFromTop, distanceFromBottom);
            xSpeed.current = -Math.abs(xSpeed.current);
        }

        if (ball.left < 0) {
            rightScore++;
            initBall();
        } else if (ball.right > width) {
            leftScore++;
            initBall();
        }

        if (leftScore > 9 || rightScore > 9) {
            gameOver = true;
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
    };

    const drawGameOver = (ctx) => {
        ctx.fillStyle = "white";
        ctx.font = "42px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width/2, height/2);
    }

    const gameLoop = () => {
        console.log('drawing')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        fillCanvas(ctx);
        drawBall(ctx);
        drawPaddles(ctx);
        drawScores(ctx);
        updateCanvas();
        checkCollision();

        if (gameOver) {
            fillCanvas(ctx);
            drawBall(ctx);
            drawPaddles(ctx);
            drawScores(ctx);
            drawGameOver(ctx); 
        } else {
            requestAnimationFrame(gameLoop);
        }
    };

    useEffect(() => {
        initBall();
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