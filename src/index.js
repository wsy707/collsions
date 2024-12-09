import Rectangle from "./rectangle";

const canvas = document.getElementById("cnvs");
const context = canvas.getContext("2d");

const gameState = {};

function isColliding(rect1, rect2) {
    // 矩形碰撞检测逻辑
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
    );
}

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick += gameState.tickLength;
        update(gameState.lastTick);
    }
}

function draw() {
    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制所有矩形
    context.fillStyle = "rgb(0, 0, 200)";
    gameState.rects.forEach((figure) => {
        context.fillRect(figure.x, figure.y, figure.w, figure.h);
    });
}

function update() {
    gameState.rects.forEach((figure, index) => {
        // 更新矩形位置
        figure.x += figure.speed.x;
        figure.y += figure.speed.y;

        // 边界检测
        if (figure.x <= 0 || figure.x + figure.w >= canvas.width) {
            figure.speed.x *= -1; // 水平方向反弹
            figure.collisionCount = (figure.collisionCount || 0) + 1; // 增加碰撞计数
        }
        if (figure.y <= 0 || figure.y + figure.h >= canvas.height) {
            figure.speed.y *= -1; // 垂直方向反弹
            figure.collisionCount = (figure.collisionCount || 0) + 1; // 增加碰撞计数
        }

        // 矩形之间的碰撞检测
        for (let i = 0; i < gameState.rects.length; i++) {
            if (i !== index && isColliding(figure, gameState.rects[i])) {
                figure.speed.x *= -1;
                figure.speed.y *= -1;
                figure.collisionCount = (figure.collisionCount || 0) + 1; // 增加碰撞计数

                gameState.rects[i].speed.x *= -1;
                gameState.rects[i].speed.y *= -1;
                gameState.rects[i].collisionCount =
                    (gameState.rects[i].collisionCount || 0) + 1; // 增加碰撞计数
            }
        }
    });

    // 移除碰撞次数达到 3 次的矩形
    gameState.rects = gameState.rects.filter(
        (figure) => figure.collisionCount < 3
    );
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run);

    const nextTick = gameState.lastTick + gameState.tickLength;
    let numTicks = 0;

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick;
        numTicks = Math.floor(timeSinceTick / gameState.tickLength);
    }

    queueUpdates(numTicks);
    draw();
    gameState.lastRender = tFrame;
}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}

function setup() {
    // 设置画布宽高
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 初始化游戏状态
    gameState.lastTick = performance.now();
    gameState.lastRender = gameState.lastTick;
    gameState.tickLength = 15; // 每帧时间（毫秒）

    // 初始化矩形数据
    gameState.rects = [];
    const rectangle1 = new Rectangle(10, 10, 50, 50); // 矩形1
    rectangle1.setSpeed(5, 3); // 设置速度
    rectangle1.collisionCount = 0;
    gameState.rects.push(rectangle1);

    const rectangle2 = new Rectangle(400, 300, 50, 50); // 矩形2
    rectangle2.setSpeed(-4, 2); // 设置速度
    rectangle2.collisionCount = 0;
    gameState.rects.push(rectangle2);

    const rectangle3 = new Rectangle(200, 150, 50, 50); // 矩形3
    rectangle3.setSpeed(3, -3); // 设置速度
    rectangle3.collisionCount = 0;
    gameState.rects.push(rectangle3);
}

// 初始化游戏
setup();
run();
