var cnv;
var score, points = 0;
var lives, x = 0;
var maxLives = 5;
var isPlay = false;
var gravity = 0.1;
var sword;
var fruit = [];
var wojakList = [
    'NPC', 'DoomerStage4', 'pink-neon-wojak-black-eyes', 'doomer-smoking-red-eyes-dusk',
    'wojak-1', 'wojack-4', 'anime_wojak_girl', 'Kobeni_Wojak', 'withered_craig_wojak',
    'rage_death_2', 'rage_2', 'pink_wojak_twisted', 'screaming_wojak', 'DoomerGirl',
    'CryingWojak', 'crying_soyjak_2', 'front_facing_crying_zoomer', 'goth_necklaces_alt_girl_wojak_1',
    'brown_hair_blush_alt_girl_wojak_1', 'acne_alt_girl_wojak_1', 'asian_glasses_alt_girl_wojak_1',
    'TiredMasked', 'RageMasked', 'samurai_boomer_1', 'yellow_teeth_pepe', 'trump_pepe',
    'front_facing_soyjak', 'waow_soyjak', 'elon_musk_wojak', 'Donald_Trump_Chad_Wojak_1'
];
var fruitsList = [...wojakList];
var fruitsImgs = [], wojakImgs = [];
var spliced;
var bgMusic;
var restartButtonX, restartButtonY, restartButtonWidth, restartButtonHeight;
var comicFont;
var endingTriggered = false;
var restartTimer = 0;
var endingButtonEnabled = false;
var endingButtonTimer = 0;

function preload(){
    spliced = loadSound('sounds/splatter.mp3');
    bgMusic = loadSound('bgm/wojak.mp3');

    for(var i=0; i<wojakList.length; i++){
        wojakImgs[i] = loadImage('new/' + wojakList[i] + '.png');
    }
    
    for(var i=0; i<wojakList.length; i++){
        fruitsImgs[i] = wojakImgs[i];
    }
    
    bg = loadImage('newBg/wp8711070.jpg');
    foregroundImg = loadImage('images/home-mask.png');
    scoreImg = loadImage('images/score.png');
    fruitImg = loadImage('images/fruitMode.png');
    gameOverImg = loadImage('images/game-over.png');
}

function setup(){
    
    cnv = createCanvas(1280, 720);
    sword = new Sword(color("#FFFFFF"));
    frameRate(60);
    score = 0;
    lives = maxLives;
    
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.7);
    bgMusic.play();
    
    textAlign(CENTER, CENTER);
}

function drawTitle() {
    push();
    
    textSize(90);
    textStyle(BOLD);
    textFont('Comic Sans MS, cursive, sans-serif');
    
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 4;
        let offsetY = sin(angle) * 4;
        fill(0);
        text("I hate my life", width/2 + offsetX, 120 + offsetY);
    }
    
    for(let i = 0; i < 15; i++) {
        let offsetX = random(-5, 5);
        let offsetY = random(-5, 5);
        fill(180, 180, 180, 150);
        text("I hate my life", width/2 + offsetX, 120 + offsetY);
    }
    
    fill(255);
    text("I hate my life", width/2, 120);
    
    stroke(255);
    strokeWeight(6);
    let textW = textWidth("I hate my life");
    line(width/2 - textW/2, 165, width/2 + textW/2, 165);
    
    strokeWeight(3);
    line(width/2 - textW/2, 173, width/2 + textW/2, 173);
    
    pop();
}

function drawButton(buttonText) {
    push();
    
    restartButtonX = width/2 - 100;
    restartButtonY = height/2 + 80;
    restartButtonWidth = 200;
    restartButtonHeight = 60;
    
    fill(0, 0, 0, 220);
    stroke(255);
    strokeWeight(4);
    rect(restartButtonX, restartButtonY, restartButtonWidth, restartButtonHeight, 15);
    
    textSize(45);
    textStyle(NORMAL);
    textFont('Comic Sans MS, cursive, sans-serif');
    textAlign(CENTER, CENTER);
    
    fill(255);
    text(buttonText, restartButtonX + restartButtonWidth/2, 
         restartButtonY + restartButtonHeight/2);
    
    pop();
}

function drawGameOver() {
    push();
    
    textSize(80);
    textStyle(BOLD);
    textFont('Comic Sans MS, cursive, sans-serif');
    textAlign(CENTER, CENTER);
    
    let centerX = width/2;
    let centerY = height/2 - 25;
    
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 4;
        let offsetY = sin(angle) * 4;
        fill(0);
        text("My life sucks!!!", centerX + offsetX, centerY + offsetY);
    }
    
    for(let i = 0; i < 15; i++) {
        let offsetX = random(-5, 5);
        let offsetY = random(-5, 5);
        fill(180, 180, 180, 150);
        text("My life sucks!!!", centerX + offsetX, centerY + offsetY);
    }
    
    fill(255);
    text("My life sucks!!!", centerX, centerY);
    
    stroke(255);
    strokeWeight(6);
    let textW = textWidth("My life sucks!!!");
    line(centerX - textW/2, centerY + 45, centerX + textW/2, centerY + 45);
    
    strokeWeight(3);
    line(centerX - textW/2, centerY + 53, centerX + textW/2, centerY + 53);
    
    pop();
}

function draw(){
    clear();
    background(bg);

    image(this.foregroundImg, 0, 0, 1280, 350);
    drawTitle();
    
    if (!isPlay) {
        drawButton("Start");
    }
    
    cnv.mouseClicked(check);
    if(isPlay){
        game();
    }
}

function check(){
    if(!isPlay && mouseX > restartButtonX && mouseX < restartButtonX + restartButtonWidth &&
       mouseY > restartButtonY && mouseY < restartButtonY + restartButtonHeight){
        isPlay = true;
    }
}

function game(){
    clear();
    background(bg);
    if(mouseIsPressed){
        sword.swipe(mouseX, mouseY);
    }
    
    if(score >= 1000 && !endingTriggered){
        endingTriggered = true;
        showSpecialEnding();
        return;
    }
    
    let difficultyLevel = Math.floor(score / 50) + 1;
    
    let frameCheckRate = Math.max(5 - Math.floor(difficultyLevel/2), 2);
    let spawnThreshold = Math.max(0.69 - (difficultyLevel * 0.02), 0.45);
    
    if(frameCount % frameCheckRate === 0){
        if(noise(frameCount) > spawnThreshold){
            fruit.push(randomFruit());
            
            if(difficultyLevel >= 4 && random() > 0.75) {
                fruit.push(randomFruit());
            }
            
            if(difficultyLevel >= 7 && random() > 0.85) {
                fruit.push(randomFruit());
            }
        }
    }
    
    points = 0
    for(var i=fruit.length-1; i>=0; i--){
        if(!fruit[i].sliced && !fruit[i].speedAdjusted) {
            fruit[i].ySpeed *= (1 + (difficultyLevel * 0.06));
            fruit[i].speedAdjusted = true;
        }
        
        fruit[i].update();
        fruit[i].draw();
        if(!fruit[i].visible){
            if(!fruit[i].sliced){
                lives--;
                x++;
            }
            if(lives < 1 ){
                gameOver();
            }
            fruit.splice(i,1);
        }else{
            if(sword.checkSlice(fruit[i])){
                spliced.play();
                points++;
                fruit[i].update();
                fruit[i].draw();
            }
        }
    }
    if(frameCount % 2 === 0 ){
        sword.update();
    }
    sword.draw();
    score += points;
    drawScore();
    drawLives();
}

function drawLives(){
    push();
    
    const dotRadius = 12;
    const dotSpacing = 30;
    const startX = width - 40;
    const startY = 30;
    
    for(let i = 0; i < maxLives; i++) {
        let x = startX - (i * dotSpacing);
        
        stroke(0);
        strokeWeight(3);
        fill(0);
        for(let j = 0; j < 8; j++) {
            let angle = j * PI/4;
            let offsetX = cos(angle) * 2;
            let offsetY = sin(angle) * 2;
            ellipse(x + offsetX, startY + offsetY, dotRadius * 2);
        }
        
        noStroke();
        if(i < maxLives - lives) {
            for(let j = 0; j < 8; j++) {
                let offsetX = random(-2, 2);
                let offsetY = random(-2, 2);
                fill(220, 0, 0, 150);
                ellipse(x + offsetX, startY + offsetY, dotRadius * 1.8);
            }
            fill(255, 0, 0);
        } else {
            for(let j = 0; j < 8; j++) {
                let offsetX = random(-2, 2);
                let offsetY = random(-2, 2);
                fill(200, 200, 200, 150);
                ellipse(x + offsetX, startY + offsetY, dotRadius * 1.8);
            }
            fill(255);
        }
        
        ellipse(x, startY, dotRadius * 2);
    }
    
    pop();
}

function drawScore(){
    push();
    
    textAlign(LEFT);
    textSize(50);
    textStyle(BOLD);
    textFont('Comic Sans MS, cursive, sans-serif');
    
    let scoreX = 40;
    let scoreY = 50;
    
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 3;
        let offsetY = sin(angle) * 3;
        fill(0);
        text(score, scoreX + offsetX, scoreY + offsetY);
    }
    
    for(let i = 0; i < 10; i++) {
        let offsetX = random(-3, 3);
        let offsetY = random(-3, 3);
        fill(180, 180, 180, 150);
        text(score, scoreX + offsetX, scoreY + offsetY);
    }
    
    fill(255);
    text(score, scoreX, scoreY);
    
    pop();
}

function gameOver(){
    noLoop();
    clear();
    background(bg);
    drawGameOver();
    drawButton("Restart");
    
    // Add red text message below restart button
    push();
    textSize(24);
    textStyle(BOLD);
    textFont('Comic Sans MS, cursive, sans-serif');
    textAlign(CENTER, CENTER);
    
    // Shadow effect similar to "i hate my life" style
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 2;
        let offsetY = sin(angle) * 2;
        fill(0);
        text("Try to erase 1000 bad memories", width/2 + offsetX, restartButtonY + restartButtonHeight + 40 + offsetY);
    }
    
    // Red text
    fill(255, 0, 0);
    text("Try to erase 1000 bad memories", width/2, restartButtonY + restartButtonHeight + 40);
    pop();
    
    lives = 0;
    console.log("lost");
    
    cnv.mouseClicked(checkRestart);
}

function checkRestart(){
    if(mouseX > restartButtonX && mouseX < restartButtonX + restartButtonWidth &&
       mouseY > restartButtonY && mouseY < restartButtonY + restartButtonHeight){
        resetGame();
    }
}

function resetGame(){
    score = 0;
    lives = maxLives;
    fruit = [];
    isPlay = true;
    
    loop();
    
    cnv.mouseClicked(check);
}

function showSpecialEnding() {
    noLoop();
    clear();
    background(0);
    
    textAlign(CENTER, CENTER);
    textSize(32);
    textStyle(NORMAL);
    textFont('Comic Sans MS, cursive, sans-serif');
    
    drawSpecialText("I never thought you'd actually pull it off.", width/2, height/3 - 40);
    
    drawSpecialText("You've truly done something \"great\" here.", width/2, height/3);
    
    drawSpecialText("Don't you have anything more meaningful to waste your time on?", width/2, height/3 + 40);
    
    drawEndingButton("But I have no friends...", false);
    
    endingButtonTimer = 3;
    endingButtonEnabled = false;
    
    let buttonInterval = setInterval(function() {
        endingButtonTimer--;
        
        clear();
        background(0);
        drawSpecialText("I never thought you'd actually pull it off.", width/2, height/3 - 40);
        drawSpecialText("You've truly done something \"great\" here.", width/2, height/3);
        drawSpecialText("Don't you have anything more meaningful to waste your time on?", width/2, height/3 + 40);
        
        if (endingButtonTimer > 0) {
            drawEndingButton("But I have no friends... (" + endingButtonTimer + "s)", false);
        } else {
            clearInterval(buttonInterval);
            endingButtonEnabled = true;
            drawEndingButton("But I have no friends...", true);
        }
    }, 1000);
    
    cnv.mouseClicked(checkEndingButtonClick);
}

function drawSpecialText(message, x, y) {
    push();
    
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 3;
        let offsetY = sin(angle) * 3;
        fill(0);
        text(message, x + offsetX, y + offsetY);
    }
    
    for(let i = 0; i < 10; i++) {
        let offsetX = random(-3, 3);
        let offsetY = random(-3, 3);
        fill(180, 180, 180, 150);
        text(message, x + offsetX, y + offsetY);
    }
    
    fill(255);
    text(message, x, y);
    
    pop();
}

function drawEndingButton(buttonText, enabled) {
    push();
    
    restartButtonX = width/2 - 160;
    restartButtonY = height/2 + 50;
    restartButtonWidth = 320;
    restartButtonHeight = 60;
    
    if (enabled) {
        fill(60, 60, 60, 220);
        stroke(180, 60, 60);
    } else {
        fill(40, 40, 40, 180);
        stroke(100, 30, 30);
    }
    strokeWeight(3);
    rect(restartButtonX, restartButtonY, restartButtonWidth, restartButtonHeight, 15);
    
    textSize(30);
    textStyle(ITALIC);
    textFont('Comic Sans MS, cursive, sans-serif');
    textAlign(CENTER, CENTER);
    
    for(let i = 0; i < 8; i++) {
        let angle = i * PI/4;
        let offsetX = cos(angle) * 2;
        let offsetY = sin(angle) * 2;
        fill(100, 0, 0);
        text(buttonText, restartButtonX + restartButtonWidth/2 + offsetX, 
             restartButtonY + restartButtonHeight/2 + offsetY);
    }
    
    for(let i = 0; i < 8; i++) {
        let offsetX = random(-2, 2);
        let offsetY = random(-2, 2);
        fill(enabled ? 180 + random(-20, 20) : 120 + random(-20, 20), 
             enabled ? random(20, 40) : random(10, 20), 
             enabled ? random(20, 40) : random(10, 20), 
             150);
        text(buttonText, restartButtonX + restartButtonWidth/2 + offsetX, 
             restartButtonY + restartButtonHeight/2 + offsetY);
    }
    
    fill(enabled ? 220 : 150, enabled ? 0 : 0, enabled ? 0 : 0);
    text(buttonText, restartButtonX + restartButtonWidth/2, 
         restartButtonY + restartButtonHeight/2);
    
    pop();
}

function checkEndingButtonClick() {
    if(endingTriggered && endingButtonEnabled && 
       mouseX > restartButtonX && mouseX < restartButtonX + restartButtonWidth &&
       mouseY > restartButtonY && mouseY < restartButtonY + restartButtonHeight) {
        
        startRestartCountdown();
        
        cnv.mouseClicked(function(){});
    }
}

function startRestartCountdown() {
    push();
    restartTimer = 5;
    
    textAlign(CENTER, CENTER);
    textSize(100);
    textStyle(BOLD);
    fill(255);
    
    clear();
    background(0);
    text(restartTimer, width/2, height/2);
    
    let countdownInterval = setInterval(function() {
        restartTimer--;
        
        clear();
        background(0);
        text(restartTimer, width/2, height/2);
        
        if(restartTimer <= 0) {
            clearInterval(countdownInterval);
            resetGameAfterEnding();
        }
    }, 1000);
    
    pop();
}

function resetGameAfterEnding() {
    score = 0;
    lives = maxLives;
    fruit = [];
    isPlay = true;
    endingTriggered = false;
    
    loop();
    cnv.mouseClicked(check);
}

function Fruit(x,y,speed,color,size,fruit,slicedFruit1,slicedFruit2,name){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;
    this.size = size;
    this.xSpeed = randomXSpeed(x);
    this.ySpeed = random(-10.4, -7.4);
    this.fruit = fruit;
    this.slicedFruit1 = slicedFruit1;
    this.slicedFruit2 = slicedFruit2;
    this.name = name;
    this.sliced = false;
    this.visible = true;
    this.speedAdjusted = false;
}
