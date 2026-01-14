const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

canvas.setAttribute('style','display:block; margin:auto; background-color:#f2fffa');
 

document.body.appendChild(canvas);

const ball = {
  x:0,
  y:0,
  width:5,
  height:5,
  speed:4,
  dx:null,
  dy:null,

  update:function(){
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.fill();

    this.x += this.dx;
    this.y += this.dy;

    if(this.x<0 || this.x > canvas.width) {
      this.dx *= -1; // 壁に当たったら反転
    }
    if( this.y > canvas.height){
      this.dy *= -1;// 壁に当たったら反転
    }

    if ( this.y > canvas.height) {
      gameOver = true;
      //gameStarted = false;
    }
  }
}
const paddle = {
  x:null, 
  y:null,
  width:100,
  height:15,
  speed:0,

  update:function(){
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.fill();

    this.x += this.speed;
  }
}
const block = {
  width:null,
  height:20,
  data:[],

  update:function(){
    ctx.lineWidth = 2;
    this.data.forEach(brick =>{
      ctx.strokeRect(brick.x,brick.y,brick.width,brick.height);
      ctx.fillStyle = brick.color;
      ctx.strokeStyle ='black';
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    })
  }
}

const level = [
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1]
]

const colors = ["#ffb6c1", "#ffe4e1", "#fffacd", "#e6e6fa", "#d8bfd8"];

let score = 0;

let gameStarted = false;
let gameOver = false;

const restartGame = () => {

  score = 0;
  gameStarted = true;
  gameOver = false;
  block.data =[];

  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - paddle.height;

  ball.x =canvas.width / 2;
  ball.y = canvas.height / 2 + 30;
  ball.dx = ball.speed;
  ball.dy = ball.speed;

  block.width = canvas.width / level[0].length;

  for(let i =0; i<level.length; i++){ //iは縦の行番号(y方向)
    for(let j =0; j<level[i].length; j++){　//ｊは横の列番号（x方向）
      if(level[i][j]===1){ //ブロックがある場合
        block.data.push({
          x:block.width * j,
          y:block.height * i,
          width:block.width,
          height:block.height,
          color:colors[i % colors.length]
        });
      }
    }
  }
}
const collide = (obj1,obj2) => {
  return obj1.x < obj2.x + obj2.width && //obj1の左端 < obj2の右端
         obj2.x < obj1.x + obj1.width && //obj2の左端 < obj1の右端
         obj1.y < obj2.y + obj2.height && //obj1の上端 < obj2の下端
         obj2.y < obj1.y + obj1.height;  //obj2の上端 < obj1の下端
} //当たり判定

const loop = () => {
  if (!gameStarted ) {
    ctx.font = "22px 'Poppins'"
    ctx.fillStyle = "black";
    ctx.fillText("Press SPACE to Start", canvas.width / 2 -100, canvas.height / 2);
    window.requestAnimationFrame(loop);
    return;
  }

  /*
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "28px 'Poppins'"
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    return;
  }
  */

  if (gameOver) {
    // ゲームオーバー後の画面（止めた状態）
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paddle.update();
    block.update();
    ctx.font = "16px sans-serif"; 
    ctx.fillStyle = 'black';
    ctx.fillText("Score: " + score, 10, 20);
    //window.requestAnimationFrame(loop);
    return;

  }
    
  
  ctx.clearRect(0,0,canvas.width,canvas.height);

  paddle.update();
  ball.update();
  block.update();

  if(collide(ball,paddle)){
    ball.dy *= -1;
    ball.y = paddle.y - ball.height
  }

  block.data.forEach((brick,index) => {
    if (collide(ball,brick)) {
      ball.dy *= -1;
      block.data.splice(index,1); //block.data の中から、index番目のブロックを1つ削除するという意味
      score +=10;
    }else{
      block.update();
    }

  
  })

  ctx.font = "16px sans-serif"; 
  ctx.fillStyle = 'black';
  ctx.fillText("Score: " + score, 10, 20);

  window.requestAnimationFrame(loop);

} 

//init();
//restartGame();
loop();

document.addEventListener('keydown',e => {
  if(e.key === 'ArrowLeft')paddle.speed = -6;
  if(e.key === 'ArrowRight')paddle.speed =6;

  if (e.code === 'Space') {
    if (!gameStarted || gameOver) {
      restartGame(); // スタートまたはリトライ
    }
  }
});



document.addEventListener('keyup',e => {
  paddle.speed = 0;
});



