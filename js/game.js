'use strict';
window.requestAnimationFrame = 
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame;

const FPS = 1000 / 30;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;

const CANV_W = 490;
const CANV_H = 550;
const PLAYER_SIZE_X = 60;
const PLAYER_SIZE_Y = 92;

const GRAVITY = 3;

const bgc_color = 'white';
const win_color = 'forestgreen';
const lose_color = 'crimson';

const img0 = new Image();
img0.src = '/images/fdbay.jpg';
const img1 = new Image();
img1.src = '/sprites/sprites2.png';
const HTML = new Image();
HTML.src = '/stack/html.png';
const CSS = new Image();
CSS.src = '/stack/css.png';
const AEF = new Image();
AEF.src = '/stack/aeffects.png';
const ANG = new Image();
ANG.src = '/stack/angular.png';
const BOO = new Image();
BOO.src = '/stack/bootstrap.png';
const ILL = new Image();
ILL.src = '/stack/illustrator.png';
const JAV = new Image();
JAV.src = '/stack/js.png';
const NOD = new Image();
NOD.src = '/stack/node.png';
const PHO = new Image();
PHO.src = '/stack/photoshop.png';
const MUS = new Image();
MUS.src = '/images/mus.png';

var canv, ctx, game;

var pickupHTML = {
    x: 50, y: 150, w: 20, h: 20, t: 'HTML',
    isPicked: false, img: HTML
}
var pickupCSS = {
    x: 162, y: 120, w: 20, h: 20, t: 'CSS',
    isPicked: false, img: CSS
}
var pickupJS = {
    x: 364, y: 90, w: 20, h: 20, t: 'Javascript',
    isPicked: false, img: JAV
}
var pickupAg = {
    x: 314, y: 10, w: 20, h: 20, t: 'Angular',
    isPicked: false, img: ANG
}
var pickupNd = {
    x: 214, y: 50, w: 20, h: 20, t: 'Nodejs',
    isPicked: false, img: NOD
}
var pickupPs = {
    x: 114, y: 50, w: 20, h: 20, t: 'Photoshop',
    isPicked: false, img: PHO
}
var pickupAe = {
    x: 134, y: 200, w: 20, h: 20, t: 'After Effect',
    isPicked: false, img: AEF
}
var pickupIl = {
    x: 280, y: 120, w: 20, h: 20, t: 'Illustrator',
    isPicked: false, img: ILL
}
var pickupBo = {
    x: 414, y: 180, w: 20, h: 20, t: 'Bootstrap',
    isPicked: false, img: BOO
}
var pickupBug1 = {
    x: 314, y: 180, w: 30, h: 30, t: 'Plus de Ricard',
    isPicked: false, img: MUS
}
var pickupBug2 = {
    x: 214, y: 280, w: 30, h: 30, t: 'Machine à bière en panne',
    isPicked: false, img: MUS
}
var pickupBug3 = {
    x: 20, y: 210, w: 30, h: 30, t: 'Plus de jambon',
    isPicked: false, img: MUS
}
var pickupBug4 = {
    x: 45, y: 80, w: 30, h: 30, t: 'Privé de sortie',
    isPicked: false, img: MUS
}
var pickupBug5 = {
    x: 450, y: 90, w: 30, h: 30, t: 'La belle mère débarque',
    isPicked: false, img: MUS
}
var player = {
    sx: 0, sy: 0, sLargeur: 500, sHauteur: 800,
    x: CANV_W / 2, y: CANV_H, w: PLAYER_SIZE_X, h: PLAYER_SIZE_Y,
    isOnGround: false,
    imgStatic: img1, isOnGround: false,
}
var input = {
    left: false,
    up: false,
    right: false,
}
var compTab = [pickupHTML, pickupCSS, pickupJS, pickupAg, pickupNd, pickupPs, pickupAe, pickupIl, pickupBo];
var decompTab = [pickupBug1, pickupBug2, pickupBug3, pickupBug4, pickupBug5];

var ctr = compTab.length;
var score = 0.

var audioCourse = new Audio('sons/Courir.mp3');
var audioYoupi = new Audio('sons/ole.mp3')
var audioEnd = new Audio('sons/wow.mp3')
var audioPara = new Audio('sons/Flap.mp3')
var audioPaq = new Audio('sons/paquito.mp3')
var audioMeuh = new Audio('sons/meuh.mp3')
var audioWin = new Audio('sons/bravo.mp3')

window.addEventListener('DOMContentLoaded', preloader);

function preloader() {

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    //on créé le canva et on assigne son contexte à une var
    canv = window.document.createElement('canvas');
    canv.width = CANV_W;
    canv.height = CANV_H;
    ctx = canv.getContext('2d');
    window.document.body.appendChild(canv);
    let buttonCV_elem = window.document.createElement('a');
    window.document.body.appendChild(buttonCV_elem);
    game = window.setInterval(loop, FPS);
    window.console.log('Preloader done');
    music();
}

function loop() {
        if (!ctr) gameEnd();
         draw();        
         move();
         detectCollisions();
         drawScore();
        }
function clearGame() {
    audioPaq.pause();
    if (score === 9) {
        audioWin.play();
        let ok = confirm('GAGNÉ ! Vous avez trouvé toutes les stacks !!! On refait une partie ?');
        if(ok == true) {
            reload();
        } else {
            document.location.href = 'cv.html';
        }
    } else {
        audioEnd.play();
        let ok = confirm('PERDU ! Vous n\'avez pas trouvé toutes les stacks !!! On réessaie ?');
            if(ok == true) {
                reload();
            } else {
                document.location.href = 'cv.html';
            }
        }
    }
    function music() {
        audioPaq.play();
        document.getElementById("btn3").addEventListener("click", function(){
            audioPaq.play();
            console.log('on');
          });
          document.getElementById("btn4").addEventListener("click", function(){
            audioPaq.pause();
            console.log('off');
          });
    }
function gameEnd() {
    window.clearInterval(game);
    window.setTimeout(clearGame, FPS)
    audioPaq.pause();
}
function player_isTouching(obj) {
    if (player.x <= obj.x + obj.w && player.x + player.w >= obj.x)
    if (player.y <= obj.y + obj.h && player.y + player.h >= obj.y)
    return true;
    return false;
}

function object_pickedUp(obj) {
    obj.isPicked = true;
    ctr--;
    let pickupHTML = window.document.createElement('stack');
    pickupHTML.innerHTML = obj.t;
    window.document.body.appendChild(pickupHTML);
}

function detectCollisions() {
    for (let i = 0; i < compTab.length; i++) {
        if (!compTab[i].isPicked && player_isTouching(compTab[i]))
        {
        object_pickedUp(compTab[i]);     
        score++;
        audioYoupi.play(); 
    }
}
    for (let i = 0; i < decompTab.length; i++) {
        if (!decompTab[i].isPicked && player_isTouching(decompTab[i]))
        {
        object_pickedUp(decompTab[i]);
        score--;
        audioMeuh.play();
    }
}
}
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = 'crimson';
    ctx.fillText('Score : '+score, 10, 25);
}
function drawObject(obj) {    
    if (obj.img) {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.w, obj.h);
    } 
    else{
    ctx.fillStyle = obj.c;
    ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
    }
}
function drawObjects() {
    drawPlayer();
    for (let i = 0; i < compTab.length; i++) {
        if (compTab[i].isPicked === false) 
        drawObject(compTab[i]);
    }
    for (let i = 0; i < decompTab.length; i++) {
        if (decompTab[i].isPicked === false) 
        drawObject(decompTab[i]);
    }
}
 player = {
    sx: 0, sy: 0, sLargeur: 500, sHauteur: 800,
    x: CANV_W / 2, y: CANV_H, w: PLAYER_SIZE_X, h: PLAYER_SIZE_Y,
    isOnGround: false,
    imgStatic: img1, isOnGround: false,
}
function drawPlayer() {
    let sx, sy, sl, sh, dx, dy, dl, dh;
    sx=player.sx;
    sy=player.sy;
    sl=player.sLargeur;
    sh=player.sHauteur;
    dx=player.x;
    dy=player.y;
    dl=PLAYER_SIZE_X;
    dh=PLAYER_SIZE_Y;
    ctx.drawImage(player.imgStatic, sx, sy, sl, sh, dx, dy, dl, dh);
}

function draw() {
    ctx.fillStyle = bgc_color;
    ctx.fillRect(0,0,CANV_W,CANV_H);
    ctx.fillStyle = player.c;
    ctx.fillRect(0,CANV_H - 2,CANV_W, 2);
    drawObjects();
}
function inputManager() {
    if(input.left){
           player.x -= 10; 
    }
    if (input.left && player.isOnGround) {
        player.sx += 500;
        player.sy = 1600;
        if (player.sx >= 1501) {
            player.sx = 0;
        }
    }
    if(input.right){
        player.x += 10;
    }
    if (input.right && player.isOnGround) {
        player.sx += 500;
        player.sy = 800;
        if (player.sx >= 1062) {
            player.sx = 0;
        }
    }
    if (input.up && player.isOnGround) {
            player.y -= 20;
            player.sx = 1500;
            player.sy = 0;
        } 
    if (input.up) {
        player.y -= 15;
        player.sx = 1500;
        player.sy = 0;
    } 
    if (input.up && input.right) {
        player.sx = 1000;
        player.sy = 0;
    }
    if (input.up && input.left) {
        player.sx = 500;
        player.sy = 0;
    }
    if (!input.up && !player.isOnGround) {
        player.sx = 500;
        player.sy = 2400;
    }
    if (!input.up && input.left && !player.isOnGround) {
        player.sx = 1000;
        player.sy = 2400;
    }
    if (!input.up && input.right && !player.isOnGround) {
        player.sx = 1500;
        player.sy = 2400;
    }
}
function move() {
    inputManager();
    if (pickupBug1.x < 0) {
        pickupBug1.x += GRAVITY;
    }
    if (player.x < 0) {
        player.x = CANV_W;
    }
    if (player.x > CANV_W) {
        player.x = 0;
    }
    if (player.y < 0) {
        player.isFalling = true;        
    }
    if (input.up && !player.isOnGround && !player.isFalling) {
        player.isFalling = false;
        player.y -= GRAVITY;
        
    } else {player.y += GRAVITY
        input.isFalling = true;
    }

    player.isOnGround = false;
    if (player.y + player.h >= canv.height) {
        player.y = canv.height - player.h;
        player.isOnGround = true;
        player.isFalling = false;
        if(!input.left && !input.right){
            player.sx = 0;
            player.sy = 0;
        }
    }
}
function reload() {
    document.location.reload();
}

function keyDown(event) {
    switch (event.keyCode) {
        case LEFT_KEY:
            input.left = true;
            if (!player.isOnGround) {
                audioCourse.pause()
            } else {
               audioCourse.play();   
            }                  
            break;
        case RIGHT_KEY:
            input.right = true;
            if (!player.isOnGround) {
                audioCourse.pause()
            } else {
               audioCourse.play();   
            }              
            break;
        case UP_KEY:
            input.up = true;
            audioCourse.pause();
            break;
    }
}
function keyUp(event) {
    switch (event.keyCode) {
        case LEFT_KEY:
            input.left = false;
            player.sx = 0;
            player.sy = 0;
            audioCourse.pause();
            break;
        case RIGHT_KEY:
            input.right = false;
            player.sx = 0;
            player.sy = 0;
            audioCourse.pause();
            break;            
        case UP_KEY:
            input.up = false;
            audioPara.play();
            break;
    }
}

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })