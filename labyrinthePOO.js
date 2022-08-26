import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

const k = kaboom({ // le contexte
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [158 ,158, 158]
})

loadSprite("bottomRight", "donjon/Tilset_DB.png");
loadSprite("topRight", "donjon/Tilset_DH.png");
loadSprite("middleRight", "donjon/Tilset_DM.png");
loadSprite("bottomLeft", "donjon/Tilset_GB.png");
loadSprite("topLeft", "donjon/Tilset_GH.png");
loadSprite("middleLeft", "donjon/Tilset_GM.png");
loadSprite("middleBottom", "donjon/Tilset_MB.png");
loadSprite("middleTop", "donjon/Tilset_MH.png");

loadSprite("leftDoor","donjon/openDoorLeft.png");
loadSprite("rightDoor","donjon/openDoorRight.png");
loadSprite("topDoor","donjon/openDoorTop.png");
loadSprite("botDoor","donjon/openDoorBot.png");

loadSprite("closeLeftDoor","donjon/closedDoorLeft.png");
loadSprite("closeTopDoor","donjon/closeTopDoor.png");
loadSprite("closeRightDoor","donjon/closeRightDoor.png");
loadSprite("closeBotDoor","donjon/closeBotDoor.png");

loadSprite("leftExit","donjon/openExitLeft.png");
loadSprite("rightExit","donjon/openExitRight.png");
loadSprite("topExit","donjon/openExitTop.png");
loadSprite("botExit","donjon/openExitBot.png");

loadSprite("chest","donjon/openChest.png");
loadSprite("ground","donjon/ground.png");

loadSprite("playerBack", "donjon/player.png");
loadSprite("playerFront", "donjon/playerFront.png");
loadSprite("playerLeft", "donjon/playerLeft.png");

loadSprite("player", "perso.png");

loadSprite("bat", "donjon/bat.png");



let labyrinthe = [];
let compteurSortie = 0;
let rand = Math.floor(Math.random() * 24)
let sortie;
let tabMouvement = [-7,-1,1,7];
let starting = 24;
let newPos;

class Room{
    level = "";
    idScene = "";
    topDoor = false;
    bottomDoor = false;
    leftDoor = false;
    rightDoor = false;

    hasEnemy = 0;
    hasVisited = false;
    hasDoorModified = false;
    isExit = false;

    constructor(_level){
        this.level = _level;
    }
}

const speed = 240;

let level = [
    "(ttttttttttt)",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "[wwwwwwwwwww]",
];
let startLevel = [
    "(ttttthttttt)",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "g     é     D",
    "|           l",
    "|           l",
    "|           l",
    "|           l",
    "[wwwwwbwwwww]",
];

for(let i = 0; i<49; i++){
    if(i == 24){
        labyrinthe[i] = new Room(startLevel);
        labyrinthe[i].idScene = "main";
        labyrinthe[i].leftDoor = true;
        labyrinthe[i].topDoor = true;
        labyrinthe[i].rightDoor = true;
        labyrinthe[i].bottomDoor = true;
    }
    else if((i/7 < 1 || i%7 < 1 || i%7 == 6 || i/7 > 6)){
        if(rand == compteurSortie){
            labyrinthe[i] = new Room(level);
            labyrinthe[i].isExit = true;
            labyrinthe[i].idScene = "Exit";
            sortie = i;
        }
        else{
            labyrinthe[i] = new Room(level);
            labyrinthe[i].idScene = "scene" + i;
        }
        compteurSortie += 1;
    }
    else{
        labyrinthe[i] = new Room(level);
        labyrinthe[i].idScene = "scene" + i;
    }
}

function createdSortie(newSortie,labyrinthe){
    let ranndom = Math.floor(Math.random() * tabMouvement.length)
    let movement = tabMouvement[ranndom];
      if(newSortie -7 != starting && newSortie-1 != starting
        && newSortie+1 != starting && newSortie+7 != starting){
        if(movement < 0){
            if(movement == -1){
                if(newSortie%7 != 0){
                    labyrinthe[newSortie].leftDoor = true;
                    labyrinthe[newSortie + movement].rightDoor = true;
                    labyrinthe[newSortie].hasDoorModified = true;
                    return createdSortie(newSortie-1,labyrinthe);
                }
                else{
                    return createdSortie(newSortie,labyrinthe);
                }
            }
            else{
                if(newSortie/7 > 1){
                labyrinthe[newSortie].topDoor = true;
                labyrinthe[newSortie + movement].bottomDoor = true;
                labyrinthe[newSortie].hasDoorModified = true;
                return createdSortie(newSortie-7,labyrinthe);
                }
                else{
                    return createdSortie(newSortie,labyrinthe);
                }
            }
        }
        else if(movement == 1){
            if(newSortie%7 != 6){
            labyrinthe[newSortie].rightDoor = true;
            labyrinthe[newSortie + movement].leftDoor = true;
            labyrinthe[newSortie].hasDoorModified = true;
            return createdSortie(newSortie+1,labyrinthe);
            }
            else{
                return createdSortie(newSortie,labyrinthe);
            }
        }
        else{
            if(newSortie/7 < 6){
            labyrinthe[newSortie].bottomDoor = true;
            labyrinthe[newSortie + movement].topDoor = true;
            labyrinthe[newSortie].hasDoorModified = true;
            return createdSortie(newSortie+7,labyrinthe);
            }
            else{
                return createdSortie(newSortie,labyrinthe);
            }
        }
      }
      else{
        if(newSortie-7 == starting){
            console.log("Par là" + " : " + newSortie);
            labyrinthe[newSortie].topDoor = true;
        }
        else if(newSortie-1 == starting){
            console.log("Par là" + " : " + newSortie);
            labyrinthe[newSortie].rightDoor = true;
        }
        else if(newSortie+1 == starting){
            console.log("Par là" + " : " + newSortie);
            labyrinthe[newSortie].leftDoor = true;
        }
        else{
            console.log("Par là" + " : " + newSortie);
            labyrinthe[newSortie].bottomDoor = true;
        }
      }
      return;
    }

    function addRandomDoor(labyrinthe){
        let proba;
        let door;
        for(let i = 0;i<labyrinthe.length;i++){
            if(labyrinthe[i].isExit){
                if(i/7 < 1){
                    labyrinthe[i].topDoor = "exit";
                    //console.log(i);
                }
                else if(i%7 == 0){
                    labyrinthe[i].leftDoor = "exit";
                    //console.log(i);
                }
                else if(i%7 == 6){
                    labyrinthe[i].rightDoor = "exit";
                    //console.log(i);
                }
                else{
                    labyrinthe[i].bottomDoor = "exit";
                    //console.log(i);
                }
            }
            else{
                proba = randi(0,4);
                if(proba < 3){
                    door = randi(0,3);
                    switch(door){
                        case 0: if(!labyrinthe[i].leftDoor && i != 0){
                            if(labyrinthe[i-1].rightDoor != "exit"){
                                labyrinthe[i].leftDoor = true;
                                labyrinthe[i-1].rightDoor = true;
                            }
                        }
                        break;
                        case 1: if(!labyrinthe[i].topDoor && i > 6){
                            labyrinthe[i].topDoor = true;
                            labyrinthe[i-7].bottomDoor = true;
                        }
                        break;
                        case 2: if(!labyrinthe[i].rightDoor && i < 48){
                            if(labyrinthe[i].rightDoor != "exit"){
                                labyrinthe[i].rightDoor = true;
                                labyrinthe[i+1].leftDoor = true;
                            }
                        }
                        break;
                        case 3: if(!labyrinthe[i].bottomDoor && i < 42){
                            labyrinthe[i].bottomDoor = true;
                            labyrinthe[i+7].topDoor = true;
                        }
                    }
                }
                if(proba < 2){
                    door = randi(0,3);
                    switch(door){
                        case 0: if(!labyrinthe[i].leftDoor && i != 0){
                            if(labyrinthe[i-1].rightDoor != "exit"){
                                labyrinthe[i].leftDoor = true;
                                labyrinthe[i-1].rightDoor = true;
                            }
                        }
                        break;
                        case 1: if(!labyrinthe[i].topDoor && i > 6){
                            labyrinthe[i].topDoor = true;
                            labyrinthe[i-7].bottomDoor = true;
                        }
                        break;
                        case 2: if(!labyrinthe[i].rightDoor && i < 48){
                            if(labyrinthe[i].rightDoor != "exit"){
                                labyrinthe[i].rightDoor = true;
                                labyrinthe[i+1].leftDoor = true;
                            }
                        }
                        break;
                        case 3: if(!labyrinthe[i].bottomDoor && i < 42){
                            labyrinthe[i].bottomDoor = true;
                            labyrinthe[i+7].topDoor = true;
                        }
                    }
                }
                if(proba < 1){
                    door = randi(0,3);
                    switch(door){
                        case 0: if(!labyrinthe[i].leftDoor && i != 0){
                            if(labyrinthe[i-1].rightDoor != "exit"){
                                labyrinthe[i].leftDoor = true;
                                labyrinthe[i-1].rightDoor = true;
                            }
                        }
                        break;
                        case 1: if(!labyrinthe[i].topDoor && i > 6){
                            labyrinthe[i].topDoor = true;
                            labyrinthe[i-7].bottomDoor = true;
                        }
                        break;
                        case 2: if(!labyrinthe[i].rightDoor && i < 48){
                            if(labyrinthe[i].rightDoor != "exit"){
                                labyrinthe[i].rightDoor = true;
                                labyrinthe[i+1].leftDoor = true;
                            }
                        }
                        break;
                        case 3: if(!labyrinthe[i].bottomDoor && i < 42){
                            labyrinthe[i].bottomDoor = true;
                            labyrinthe[i+7].topDoor = true;
                        }
                    }
                }
            }
            proba = randi(0,100);
            if(proba < 50){
                labyrinthe[i].hasEnemy = 1;
            }
            if(proba < 20){
                labyrinthe[i].hasEnemy = 2;
            }
            if(proba < 10){
                labyrinthe[i].hasEnemy = 3;
            }
            if(proba == 1){
                labyrinthe[i].hasEnemy = 10;
            }
            if(i == 24){
                labyrinthe[i].hasEnemy = 0;
            }
        }

        for(let j = 0;j<labyrinthe.length;j++){
            if(!labyrinthe[j].isExit){
                if(j/7 < 1){
                    labyrinthe[j].topDoor = false;
                }
                if(j/7 > 6){
                    labyrinthe[j].bottomDoor = false;
                }
                if(j%7 == 0){
                    labyrinthe[j].leftDoor = false;
                }
                if(j%7 == 6){
                    labyrinthe[j].rightDoor = false;
                }
            }
        }
        labyrinthe[17].bottomDoor = true;
        labyrinthe[23].rightDoor = true;
        labyrinthe[25].leftDoor = true;
        labyrinthe[31].topDoor = true;
    }

let compteur = 0;
let enemyCount = 0;
let tempDoor = 0;

function drawDoor(newPos,newCase){
    console.log(newPos);
    if(labyrinthe[newPos].isExit){
        labyrinthe[newPos].level[4] = "|     $     l"
    }
    else{
        labyrinthe[newPos].level[4] = "|           l"
    }
    switch(newCase){
        case 1: if(labyrinthe[newPos].leftDoor){
            if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "&          èD";
            }
            else{
                labyrinthe[newPos].level[5] = "g          èD";
            }
        }
        else{
            labyrinthe[newPos].level[5] = "|          èD";
        }
        if(labyrinthe[newPos].topDoor){
            if(labyrinthe[newPos].topDoor == "exit"){
                labyrinthe[newPos].level[0] = "(ttttt?ttttt)";
            }
            else{
                labyrinthe[newPos].level[0] = "(ttttthttttt)";
            }
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
        if(labyrinthe[newPos].bottomDoor){
            if(labyrinthe[newPos].bottomDoor == "exit"){
                labyrinthe[newPos].level[10] = "[wwwww!wwwww]";
            }
            else{
                labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
            }
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]"
        }
        labyrinthe[newPos].level[9] = "|           l"
        labyrinthe[newPos].level[1] = "|           l"
        break;

        case 2:
        if(labyrinthe[newPos].leftDoor && labyrinthe[newPos].rightDoor){
            if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "&           D";
            }
            else if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "g           s";
            }
            else{
                labyrinthe[newPos].level[5] = "g           D";
            }
        }
        else if(labyrinthe[newPos].leftDoor){
            if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "&           l";
            }
            else{
                labyrinthe[newPos].level[5] = "g           l";
            }
        }
        else if(labyrinthe[newPos].rightDoor){
            if(labyrinthe[newPos].rightDoor == "exit"){
                labyrinthe[newPos].level[5] = "|           s";
            }
            else{
                labyrinthe[newPos].level[5] = "|           D";
            }
        }
        else{
            labyrinthe[newPos].level[5] = "|           l";
        }
        if(labyrinthe[newPos].topDoor){
            if(labyrinthe[newPos].topDoor == "exit"){
                labyrinthe[newPos].level[0] = "(ttttt?ttttt)";
            }
            else{
                labyrinthe[newPos].level[0] = "(ttttthttttt)";
            }
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
            labyrinthe[newPos].level[9] = "|     @     l"
            labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
            labyrinthe[newPos].level[1] = "|           l"
        break;
        
        case 3:if(labyrinthe[newPos].rightDoor){
            if(labyrinthe[newPos].rightDoor == "exit"){
                labyrinthe[newPos].level[5] = "gé          s";
            }
            else{
                labyrinthe[newPos].level[5] = "gé          D";
            }
        }
        else{
            labyrinthe[newPos].level[5] = "gé          l";
        }
        if(labyrinthe[newPos].topDoor){
            if(labyrinthe[newPos].topDoor == "exit"){
                labyrinthe[newPos].level[0] = "(ttttt?ttttt)";
            }
            else{
                labyrinthe[newPos].level[0] = "(ttttthttttt)";
            }
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
        if(labyrinthe[newPos].bottomDoor){
            if(labyrinthe[newPos].bottomDoor == "exit"){
                labyrinthe[newPos].level[10] = "[wwwww!wwwww]";
            }
            else{
                labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
            }
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]"
        }
        labyrinthe[newPos].level[9] = "|           l"
        labyrinthe[newPos].level[1] = "|           l"
        break;

        case 4: if(labyrinthe[newPos].leftDoor && labyrinthe[newPos].rightDoor){
            if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "&           D";
            }
            else if(labyrinthe[newPos].rightDoor == "exit"){
                labyrinthe[newPos].level[5] = "g           s";
            }
            else{
                labyrinthe[newPos].level[5] = "g           D";
            }
        }
        else if(labyrinthe[newPos].leftDoor){
            if(labyrinthe[newPos].leftDoor == "exit"){
                labyrinthe[newPos].level[5] = "&           l";
            }
            else{
                labyrinthe[newPos].level[5] = "g           l";
            }
        }
        else if(labyrinthe[newPos].rightDoor){
            if(labyrinthe[newPos].rightDoor == "exit"){
                labyrinthe[newPos].level[5] = "|           s";
            }
            else{
                labyrinthe[newPos].level[5] = "|           D";
            }
        }
        else{
            labyrinthe[newPos].level[5] = "|           l";
        }
        if(labyrinthe[newPos].bottomDoor){
            if(labyrinthe[newPos].bottomDoor == "exit"){
                labyrinthe[newPos].level[10] = "[wwwww!wwwww]";
            }
            else{
                labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
            }
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]";
        }
            labyrinthe[newPos].level[9] = "|           l"
            labyrinthe[newPos].level[1] = "|     é     l"
            labyrinthe[newPos].level[0] = "(ttttthttttt)";
        break;
    }
}

function createdScene(idScene,position,labyrinthe){
    scene(idScene, (levelIdx) => {
        k.add([k.sprite('ground', {width: 832, height: 704, tiled: false}), k.pos(k.vec2(64,64))])
        if(compteur == 0){
            levelIdx = position;
            compteur = compteur+1;
        }
        if(!labyrinthe[levelIdx].hasVisited){
            for(let i = 0; i<labyrinthe[levelIdx].hasEnemy ;i++){
                let randomX = randi(0,11);
                if(randomX == 0 || randomX == 10){
                    randomX = 5;
                }
                let randomY = randi(0,9)
                if(randomY == 0 || randomY == 8){
                    randomX = 4;
                }
                const x = randomX*64+128;
                const y = randomY*64+128;
        
                add([
                    sprite("bat"),
                    pos(x, y),
                    area(),
                    "bat",
                ])
                }
                tempDoor = 1;
        }

        if(labyrinthe[levelIdx].hasEnemy == 0){
            tempDoor = 0;
        }
        addLevel(labyrinthe[levelIdx].level, {
            width: 64,
            height: 64,
            pos: vec2(64, 64),
            "w": () => [
                sprite("middleBottom"),
                area(),
                solid(),
            ],
            "D": () => [
                sprite("rightDoor"),
                area(),
                solid(),
                "rightDoor",
            ],
            "@": () => [
                sprite("playerBack"),
                area(),
                solid(),
                "player",
            ],
            "t": () => [
                sprite("middleTop"),
                area(),
                solid(),
            ],
            "|": () => [
                sprite("middleLeft"),
                area(),
                solid(),
            ],
            "l": () => [
                sprite("middleRight"),
                area(),
                solid(),
            ],
            ")": () => [
                sprite("topRight"),
                area(),
                solid(),
            ],
            "(": () => [
                sprite("topLeft"),
                area(),
                solid(),
            ],
            "[": () => [
                sprite("bottomLeft"),
                area(),
                solid(),
            ],
            "]": () => [
                sprite("bottomRight"),
                area(),
                solid(),
            ],
            "$": () => [
                sprite("chest"),
                area(),
                solid(),
            ],
            "h": () => [
                sprite("topDoor"),
                area(),
                solid(),
                "topDoor",
            ],
            "b": () => [
                sprite("botDoor"),
                area(),
                solid(),
                "botDoor",
            ],
            "g": () => [
                sprite("leftDoor"),
                area(),
                solid(),
                "leftDoor",
            ],
            "&": () => [
                sprite("leftExit"),
                area(),
                solid(),
                "leftExit",
            ],
            "s": () => [
                sprite("rightExit"),
                area(),
                solid(),
                "rightExit",
            ],
            "?": () => [
                sprite("topExit"),
                area(),
                solid(),
                "topExit",
            ],
            "!": () => [
                sprite("botExit"),
                area(),
                solid(),
                "botExit",
            ],
            "f": () => [
                sprite("closeLeftDoor"),
                area(),
                solid(),
                "closeLeftDoor",
            ],
            "é": () => [
                sprite("playerFront"),
                area(),
               solid(),
                "player",
            ],
            "è": () => [
                sprite("playerLeft"),
                area(),
                solid(),
                "player",
            ],
        })
        let player = get("player")[0];

        if(labyrinthe[levelIdx].hasEnemy != 0){
            if(labyrinthe[levelIdx].leftDoor){
                add([
                    sprite("closeLeftDoor"),
                    pos(64,6*64),
                    area(),
                    solid(),
                    "closeLeftDoor",
                ])
            }
            if(labyrinthe[levelIdx].topDoor){
                add([
                    sprite("closeTopDoor"),
                    pos(7*64,64),
                    area(),
                    solid(),
                    "closeTopDoor",
                ])
            }
            if(labyrinthe[levelIdx].rightDoor){
                add([
                    sprite("closeRightDoor"),
                    pos(13*64,6*64),
                    area(),
                    solid(),
                    "closeRightDoor",
                ])
            }
            if(labyrinthe[levelIdx].bottomDoor){
                add([
                    sprite("closeBotDoor"),
                    pos(7*64,11*64),
                    area(),
                    solid(),
                    "closeBotDoor",
                ])
            }
        }


        player.onCollide("bat",(bat) => {
            destroy(bat)
            enemyCount += 1;
            if(enemyCount == labyrinthe[levelIdx].hasEnemy){
                tempDoor = 0;
                enemyCount = 0;
                labyrinthe[levelIdx].hasVisited = true;
                labyrinthe[levelIdx].hasEnemy = 0;
                destroyAll("closeLeftDoor");
                destroyAll("closeTopDoor");
                destroyAll("closeRightDoor");
                destroyAll("closeBotDoor");
            }
        })

        player.onCollide("leftExit",() => {
            console.log('Win');
            go("win");
        })

        player.onCollide("rightExit",() => {
            console.log('Win');
            go("win");
        })

        player.onCollide("botExit",() => {
            console.log('Win');
            go("win");
        })

        player.onCollide("topExit",() => {
            console.log('Win');
            go("win");
        })

        player.onCollide("leftDoor", () => {
                newPos = levelIdx-1;
                drawDoor(newPos,1);

           if(tempDoor == 0){
            tempDoor = 1;
            go("main",newPos);
           }
       });

       player.onCollide("topDoor", () => {
        
        newPos = levelIdx-7;
        drawDoor(newPos,2);

        if(tempDoor == 0){
            tempDoor = 1;
            go("main",newPos);
            }
        });

       player.onCollide("rightDoor", () => {
        newPos = levelIdx+1;
        drawDoor(newPos,3);

        if(tempDoor == 0){
         tempDoor = 1;
         go("main",newPos);
            }
        });

        player.onCollide("botDoor", () => { 
            newPos = levelIdx+7;
            drawDoor(newPos,4);

            if(tempDoor == 0){
                tempDoor = 1;
                go("main",newPos);
            }
        });

        const dirs = {
            "left": LEFT,
            "right": RIGHT,
            "up": UP,
            "down": DOWN,
        }
        
        for (const dir in dirs) {
            onKeyPress(dir, () => {
            })
            onKeyDown(dir, () => {
                player.move(dirs[dir].scale(speed))
            })
        }
    })
}

function start(idScene,position) {
    go(idScene, position) 
}

function startGame(){
    console.log("La sortie est là : " + sortie);
    createdSortie(sortie,labyrinthe);
    addRandomDoor(labyrinthe);
    console.log(labyrinthe);

    createdScene(labyrinthe[24].idScene,24,labyrinthe);
    start("main",24);
};

startGame();