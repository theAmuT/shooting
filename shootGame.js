let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true이면 게임이 끝남.
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2-30;
let spaceshipY = canvas.height - 80;

let bulletList = [];  //총알들을 저장하는 리스트
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 16;
        this.y = spaceshipY-7;
        this.alive = true; //true면 살아있는 총알, false면 죽은 총알
        bulletList.push(this);
    }
    this.update = function(){
        this.y -= 10;
    }
    this.checkHit = function(){
        for(let i = 0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <=enemyList[i].x+48){
                score++;
                this.alive = false; //죽은 총알
                enemyList.splice(i,1);
            };
        }
    }
}
function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random() * (max-min+1)) + min;
    return randomNum;
}
let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width - 48);
        enemyList.push(this);
    }
    this.update = function(){
        this.y += 3;
        if(this.y >= canvas.height - 48){
            gameOver = true;
            console.log("game over");
        };
    }
} 

function loadImage(){   // 게임에서 사용할 이미지를 미리 로드한다.
    backgroundImage = new Image();
    backgroundImage.src = "images/bg04.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship03.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet01.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy03.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        // console.log("무슨 키가 눌렸어?", event.keyCode);
        keysDown[event.keyCode] = true;
        console.log("키다운객체에 들어간 값은?", keysDown);
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
        // console.log("버튼 클릭후", keysDown);
        if(event.keyCode == 32){
            createBullet(); //총알 생성
        }
    });
}

function createBullet(){
    console.log("총알 생성!");
    let b = new Bullet();
    b.init();
    console.log("새로운 총알 리스트",bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000)
}

function update(){
    if(39 in keysDown ){  //right     
        spaceshipX += 5;
    }
    if(37 in keysDown){
        spaceshipX -= 5;  //left
    }

    //캔버스 안에서만 우주선 움직이기
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-60){
        spaceshipX = canvas.width-60;
    }

//총알의 y좌표 업데이트하는 함수 호출
    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    for(let i = 0; i < enemyList.length; i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    //canvas에 배경 이미지와 우주선 이미지를 그려낸다.
    ctx.fillText(`Score:${score}` , 15, 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }        
    }

    for(let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}   


function main(){    //애니메이션 루프를 생성하여 render함수를 반복 호출한다.
    if(!gameOver){  //게임오버 = false이면(게임이 끝나지 않았으면)
        update(); //좌표값을 업데이트하고
        render(); //그려주고 
        // console.log("animation calls main function");
        requestAnimationFrame(main); //매프레임마다 main함수를 호출한다.
    }else{
        ctx.drawImage(gameOverImage, 20, 200, 350, 156);
    }
    
}   

loadImage();
setupKeyboardListener();
createEnemy();
main();

//방향키를 누르면
//우주선의 xy좌표가 바뀌고
//다시 render 그려준다


//총알만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사한다? 총알의 y값이 --; 
//   총알의 X값은 스페이스바를 누른 순간의 우주선의 X좌표
//3. 발사된 총알들은 총알 배열에 저장한다.
//4. 총알들은 x,y 좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다.

//적군 만들기
//0. 귀엽다
//1. 적군은 위치가 랜덤하다.
//2. 적군은 밑으로 내려온다.
//3. 1초마다 하나씩 적군이 나온다.
//4. 적군의 우주선이 바닥에 닿으면 게임 오버
//5. 적군과 총알이 만나면 우주선이 사라진다, 점수 1점 획득

//총알.y <= 적군.y &&    //총알의 y값이 적군의 y값보다 작아지면 총알이 통과=닿았다 ,
//총알.x >= 적군.x && 총알.x <= 적군.x + 적군의 넓이
// -> 닿았다
// -> 총알이 죽게되고, 적군의 우주선이 없어지고, 점수 획득