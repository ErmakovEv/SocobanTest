let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = 'player';
const playerInPoint = 'playerInPoint';
const wall = 'wall';
const fild = 'fild';
const box = 'box';
const box_check = 'box_check';
const point = 'point';
let map = [ [fild, fild, wall, wall, wall, wall, wall, fild],
            [wall, wall, wall, fild, fild, fild, wall, fild],
            [wall, point, player, box, fild, fild, wall, fild],
            [wall, wall, wall, fild, box, point, wall, fild],
            [wall, point, wall, wall, box, fild, wall, fild],
            [wall, fild, wall, fild, point, fild, wall, wall],
            [wall, box, fild, box_check, box, box, point, wall],
            [wall, fild, fild, fild, point, fild, fild, wall],
            [wall, wall, wall, wall, wall, wall, wall, wall,]];


function drawPlayer(y, x){
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'MediumPurple';
    ctx.fillStyle = "rgb(51, 25, 102)";
    ctx.arc((100 * y) + 50, (100 * x) + 50, 25, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();  
    ctx.closePath();
 
}

function drawWall(y, x){
    ctx.fillStyle = 'rgb(26, 26, 26)';
    ctx.fillRect(100 * y, 100 * x, 100, 100);
    ctx.clearRect((100 * y) + 25, (100 * x) + 25, 50, 50);
}

function drawFild(y, x){
    ctx.fillStyle = 'rgb(55, 64, 73)';
    ctx.fillRect(100 * y, 100 * x, 100, 100);
}

function drawBox(y, x){
    ctx.fillStyle = 'Chocolate';
    ctx.strokeStyle = 'rgb(112, 56, 16)';
    ctx.fillRect(100 * y, 100 * x, 100, 100);
    ctx.strokeRect((100 * y) + 10, (100 * x) + 10, 80, 80);
}

function drawBoxCheck(y, x){
    ctx.fillStyle = 'rgb(47, 182, 47)';
    ctx.strokeStyle = 'rgb(37, 142, 37)';
    ctx.fillRect(100 * y, 100 * x, 100, 100);
    ctx.strokeRect((100 * y) + 10, (100 * x) + 10, 80, 80);

}

function drawPoint(y, x){
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'IndianRed';
    ctx.fillStyle = "LightCoral";
    ctx.arc((100 * y) + 50, (100 * x) + 50, 10, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();  
    ctx.closePath();
}


function render() {
    let winPtr = 0;
    ctx.clearRect(0, 0, window.innerHeight, window.innerHeight);
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[i].length; ++j) {
            if(map[i][j] === player) {
                drawPlayer(j, i);
            }
            if(map[i][j] === playerInPoint) {
                drawPlayer(j, i);
            }
            if(map[i][j] === wall) {
                drawWall(j, i);
            }
            if(map[i][j] === fild) {
                drawFild(j, i);
            }
            if(map[i][j] === box) {
                drawBox(j, i);
                winPtr++;
            }
            if(map[i][j] === box_check) {
                drawBoxCheck(j, i);
            }
            if(map[i][j] === point) {
                drawPoint(j, i);
            }
        }
    }
    if(!winPtr){
        return 1;
    }
    return 0;
}

function playerOrPlayerInPoint(index){
    if(map[index[0]][index[1]] === playerInPoint) {
        map[index[0]][index[1]] = point;
    }
    else {
        map[index[0]][index[1]] = fild;
    }
}

function findIndex(p) {
    for(let i = 0; i < map.length; ++i) {
        let j = map[i].indexOf(p);
        if(j != -1) {
            return [i, j];
        }
    }
    return 0;
}

function determinateYX(y, x) {
    let index = findIndex(player);
    if(!index) {
        index = findIndex(playerInPoint);
    }
    let hor = 0;
    let ver = 0;
    if(!x) {
        hor = 1;
        ver = 2;
    }
    else{
        hor = 2;
        ver = 1;
    }

    if (map[index[0] + y][index[1] + x] === fild) {
        playerOrPlayerInPoint(index);
        map[index[0] + y][index[1] + x] = player;
    }
    if(map[index[0] + y][index[1] + x] === box) {
        if(map[index[0] + y * ver][index[1] + x * hor] === fild) {
            playerOrPlayerInPoint(index);
            map[index[0] + y][index[1] + x] = player;
            map[index[0] + y * ver][index[1] + x * hor]  = box;
        }
        if(map[index[0] + y * ver][index[1] + x * hor] === point) {
            playerOrPlayerInPoint(index);
            map[index[0] + y][index[1] + x] = player;
            map[index[0] + y * ver][index[1] + x * hor]  = box_check;
        }
    }
    if(map[index[0] + y][index[1] + x] === box_check){
        if(map[index[0] + y * ver][index[1] + x * hor] === fild) {
            playerOrPlayerInPoint(index);
            map[index[0] + y][index[1] + x] = playerInPoint;
            map[index[0] + y * ver][index[1] + x * hor]  = box;
        }

        if(map[index[0] + y * ver][index[1] + x * hor] === point) {
            playerOrPlayerInPoint(index);
            map[index[0] + y][index[1] + x] = playerInPoint;
            map[index[0] + y * ver][index[1] + x * hor]  = box_check;
        }
    }
    if(map[index[0] + y][index[1] + x] === point) {
        playerOrPlayerInPoint(index);
        map[index[0] + y][index[1] + x] = playerInPoint;
    }
}


/*--------Движение--------*/
// 1 отлавливаем событие
// 2 узнаем на какую клавишу нажал пользователь (влево вправо)
// 3 считаем координаты игрока с учетом нажатой клавишы (наверное надо все время хранить переменную с его координатами)
        //3.1 перед игроком филд :
            // изменяем значение переменной коордИгрока
            // изменяем карту
            // рендер
        //3.2 перед игроком стена:
            //ничего не делаем
        //3.3 перед игроком боксом:
            // 3.3.1. перед боксом филд:
                // изменяем значение переменной коордИгрока
                // изменяем карту С УЧЕТОМ ПЕРЕДВИЖЕНИЯ БОКСА
                // рендер
            // 3.3.2 перед боксом стена - см. п. 3.2

render();
document.addEventListener("keydown", event => {
    console.log(map);
    if(event.key === "ArrowLeft") {
        determinateYX(0, -1);
    }
    if(event.key === 'ArrowRight') {
        determinateYX(0, 1);
    }
    if(event.key === 'ArrowUp') {
        determinateYX(-1, 0);
    }
    if(event.key === 'ArrowDown') {
        determinateYX(1, 0);
    }
    let check = render();
    if(check){
        alert("You win!!!")
    }
});
