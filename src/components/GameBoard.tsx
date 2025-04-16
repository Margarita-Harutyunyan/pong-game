import { useRef, useEffect } from 'react';
import { CONFIG } from '../utils/consts';
import { checkPaddleCollision } from '../utils/collision';

export const GameBoard = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let ballPosition = useRef<{x: number, y: number}>({x: 0, y: 0});
    
    let xSpeed = useRef<number>(0);
    let ySpeed = useRef<number>(0);

    let leftPaddleTop = useRef<number>(10);
    let rightPaddleTop = useRef<number>(30);

    let leftScore = useRef<number>(0);
    let rightScore = useRef<number>(0);
    let gameOver = useRef<boolean>(false);

    const initBall = () => {
        ballPosition.current = {x: 20, y: 30};
        xSpeed.current = 4;
        ySpeed.current = 2;
    };

    const fillCanvas = (ctx:CanvasRenderingContext2D) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    };

    const drawBall = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "white";
        ctx.fillRect(ballPosition.current.x, ballPosition.current.y, CONFIG.BALL_SIZE, CONFIG.BALL_SIZE);
    };

    const drawPaddles = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "white";

        // left paddle
        ctx.fillRect(CONFIG.PADDLE_OFFSET, leftPaddleTop.current, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);

        // right paddle
        ctx.fillRect(CONFIG.WIDTH - CONFIG.PADDLE_OFFSET - CONFIG.PADDLE_WIDTH, rightPaddleTop.current, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);
    };

    const drawScores = (ctx: CanvasRenderingContext2D) => {
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

    const adjustAngle = (distanceFromTop: number, distanceFromBottom: number) => {
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

    const draw = (ctx: CanvasRenderingContext2D) => {
        fillCanvas(ctx);
        drawBall(ctx);
        drawPaddles(ctx);
        drawScores(ctx);
    };
      
    const update = () => {
        updateCanvas();
        checkCollision();
    };

    const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let position = e.clientY - canvas.getBoundingClientRect().top;
        if (position < 0) {
            position = 0;
        }
        else if (position > CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT) {
            position = CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT;
        }
        rightPaddleTop.current = position;
    };

    const drawGameOver = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "white";
        ctx.font = "42px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CONFIG.WIDTH/2, CONFIG.HEIGHT/2);
    }

    const gameLoop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
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