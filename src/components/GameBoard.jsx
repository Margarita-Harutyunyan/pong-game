import React from 'react';
import { useRef, useEffect } from 'react';
import { CONFIG } from '../utils/consts';
import { checkPaddleCollision } from '../utils/collision';

export const GameBoard = () => {
    const canvasRef = useRef(null);

    let ballPosition = useRef({x: 0, y: 0});
    
    let xSpeed = useRef(0);
    let ySpeed = useRef(0);

    let leftPaddleTop = useRef(10);
    let rightPaddleTop = useRef(30);

    let leftScore = useRef(0);
    let rightScore = useRef(0);
    let gameOver = useRef(false);

    const initBall = () => {
        ballPosition.current = {x: 20, y: 30};
        xSpeed.current = 4;
        ySpeed.current = 2;
    };

    const fillCanvas = (ctx) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    };

    const drawBall = (ctx) => {
        ctx.fillStyle = "white";
        ctx.fillRect(ballPosition.current.x, ballPosition.current.y, CONFIG.BALL_SIZE, CONFIG.BALL_SIZE);
    };

    const drawPaddles = (ctx) => {
        ctx.fillStyle = "white";

        // left paddle
        ctx.fillRect(CONFIG.PADDLE_OFFSET, leftPaddleTop.current, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);

        // right paddle
        ctx.fillRect(CONFIG.WIDTH - CONFIG.PADDLE_OFFSET - CONFIG.PADDLE_WIDTH, rightPaddleTop.current, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);
    };

    const drawScores = (ctx) => {
        ctx.font = "42px monospace";
        ctx.textAlign = "left";
        ctx.fillText(leftScore.current.toString(), CONFIG.WIDTH * 0.25, 80);
        ctx.textAlign = "right";
        ctx.fillText(rightScore.current.toString(), CONFIG.WIDTH * 0.75, 80);
    };

    const followBall = () => {
        let ball = {
            top: ballPosition.current.y,
            bottom: ballPosition.current.y + CONFIG.BALL_SIZE,
        };

        let leftPaddle = {
            top: leftPaddleTop.current,
            bottom: leftPaddleTop.current + CONFIG.PADDLE_HEIGHT,
        };

        if (ball.top < leftPaddle.top) {
            leftPaddleTop.current -= CONFIG.MAX_COMPUTER_SPEED;
        } else if (ball.bottom < leftPaddle.bottom) {
            leftPaddleTop.current += CONFIG.MAX_COMPUTER_SPEED;
        }
    };

    const updateCanvas = () => {
        ballPosition.current.x += xSpeed.current;
        ballPosition.current.y += ySpeed.current;
        followBall();
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
            right: ballPosition.current.x + CONFIG.BALL_SIZE,
            top: ballPosition.current.y,
            bottom: ballPosition.current.y + CONFIG.BALL_SIZE,
        };

        let leftPaddle = {
            left: CONFIG.PADDLE_OFFSET,
            right: CONFIG.PADDLE_OFFSET + CONFIG.PADDLE_WIDTH,
            top: leftPaddleTop.current,
            bottom: leftPaddleTop.current + CONFIG.PADDLE_HEIGHT,
        };

        let rightPaddle = {
            left: CONFIG.WIDTH - (CONFIG.PADDLE_WIDTH + CONFIG.PADDLE_OFFSET),
            right: CONFIG.WIDTH - CONFIG.PADDLE_OFFSET,
            top: rightPaddleTop.current,
            bottom: rightPaddleTop.current + CONFIG.PADDLE_HEIGHT,
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
            rightScore.current++;
            initBall();
        } else if (ball.right > CONFIG.WIDTH) {
            leftScore.current++;
            initBall();
        }

        if (leftScore.current > 9 || rightScore.current > 9) {
            gameOver.current = true;
        }

        if (ball.top < 0 || ball.bottom > CONFIG.HEIGHT) {
            ySpeed.current = -ySpeed.current;
        }
    };

    const draw = (ctx) => {
        fillCanvas(ctx);
        drawBall(ctx);
        drawPaddles(ctx);
        drawScores(ctx);
    };
      
    const update = () => {
        updateCanvas();
        checkCollision();
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        let position = e.clientY - canvas.getBoundingClientRect().top;
        if (position < 0) {
            position = 0;
        }
        else if (position > CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT) {
            position = CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT;
        }
        rightPaddleTop.current = position;
    };

    const drawGameOver = (ctx) => {
        ctx.fillStyle = "white";
        ctx.font = "42px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CONFIG.WIDTH/2, CONFIG.HEIGHT/2);
    }

    const gameLoop = () => {
        console.log('drawing')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        draw(ctx);
        update();

        if (gameOver.current) {
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
    <canvas ref={canvasRef} id="canvas" width={CONFIG.WIDTH} height={CONFIG.HEIGHT}></canvas>
  );
}

export default GameBoard;