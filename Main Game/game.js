const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const planeImg = new Image();
planeImg.src = 'airplane.webp'; // Make sure to add an image named 'plane.png' in the same directory

const buildingImg = new Image();
buildingImg.src = 'buildings.png'; // Make sure to add an image named 'building.png' in the same directory

let plane = {
    x: 50,
    y: canvas.height / 2,
    width: 60,
    height: 40,
    dy: 0
};

let buildings = [];
const buildingWidth = 70;
const buildingGap = 200;
let buildingSpeed = 2;
let gravity = 0.5;
let lift = -10;
let score = 0;

function drawPlane() {
    ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
}

function drawBuildings() {
    buildings.forEach(building => {
        ctx.drawImage(buildingImg, building.x, building.y, building.width, building.height);
    });
}

function updateBuildings() {
    buildings.forEach(building => {
        building.x -= buildingSpeed;
    });

    if (buildings.length === 0 || buildings[buildings.length - 1].x < canvas.width - buildingGap) {
        let buildingHeight = Math.random() * (canvas.height - 200) + 100;
        buildings.push({
            x: canvas.width,
            y: canvas.height - buildingHeight,
            width: buildingWidth,
            height: buildingHeight
        });
    }

    if (buildings[0].x + buildingWidth < 0) {
        buildings.shift();
        score++;
    }
}

function checkCollision() {
    buildings.forEach(building => {
        if (
            plane.x < building.x + building.width &&
            plane.x + plane.width > building.x &&
            plane.y < building.y + building.height &&
            plane.y + plane.height > building.y
        ) {
            resetGame();
        }
    });
}

function resetGame() {
    buildings = [];
    score = 0;
    plane.y = canvas.height / 2;
    plane.dy = 0;
}

function updatePlane() {
    plane.dy += gravity;
    plane.y += plane.dy;

    if (plane.y + plane.height > canvas.height || plane.y < 0) {
        resetGame();
    }
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    updatePlane();
    drawBuildings();
    updateBuildings();
    checkCollision();
    drawScore();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        plane.dy = lift;
    }
});

planeImg.onload = () => {
    gameLoop();
};