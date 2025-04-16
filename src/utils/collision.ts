interface iRectPosition{
    left: number,
    right: number,
    top: number,
    bottom: number,
}

export const checkPaddleCollision = (ball: iRectPosition, paddle: iRectPosition) => {
    return (
        ball.left < paddle.right &&
        ball.right > paddle.left &&
        ball.top < paddle.bottom &&
        ball.bottom > paddle.top
    );
};