import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

kaboom({ // le contexte
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [ 86, 28, 16 ]
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
loadSprite("chest","donjon/openChest.png");
loadSprite("bean", "https://kaboomjs.com/sprites/bean.png");
loadSprite("grass", "https://kaboomjs.com/sprites/grass.png");

let labyrinthe = [];
let compteurSortie = 0;
let rand = Math.floor(Math.random() * 24)
let sortie;
let tabMouvement = [-7,-1,1,7];
let starting = 24;

class Room{
    level = "";
    idScene = "";
    topDoor = false;
    bottomDoor = false;
    leftDoor = false;
    rightDoor = false;

    hasEnemy = false;
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
    "|     h     l",
    "|           l",
    "g     @     D",
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
        }
        compteurSortie += 1;
    }
    else{
        labyrinthe[i] = new Room(level);
        labyrinthe[i].idScene = "scene" + i;
    }
}
console.log(sortie);
createdSortie(sortie,labyrinthe);

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
            console.log("UN" + " : " + newSortie);
            labyrinthe[newSortie].topDoor = true;
        }
        else if(newSortie-1 == starting){
            console.log("DEUX" + " : " + newSortie);
            labyrinthe[newSortie].rightDoor = true;
        }
        else if(newSortie+1 == starting){
            console.log("TROIS" + " : " + newSortie);
            labyrinthe[newSortie].leftDoor = true;
        }
        else{
            console.log("QUATRE" + " : " + newSortie);
            labyrinthe[newSortie].bottomDoor = true;
        }
      }
      return;
    }

let compteur = 0;
let centerX = 448;
let centerY = 384;
let tempDoor = 0;

function whatDoor(posX,posY){
    if(posX < centerX-2*64){
        return 1;
    }
    else if(posY < centerY-2*64){
        return 2;
    }
    else if(posX > centerX+2*64){
        return 3;
    }
    else{
        return 4;
    }
}

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
            labyrinthe[newPos].level[5] = "g          @D";
        }
        else{
            labyrinthe[newPos].level[5] = "|          @D";
        }
        if(labyrinthe[newPos].topDoor){
            labyrinthe[newPos].level[0] = "(ttttthttttt)";
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
        if(labyrinthe[newPos].bottomDoor){
            labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]"
        }
        labyrinthe[newPos].level[9] = "|           l"
        labyrinthe[newPos].level[1] = "|           l"
        break;

        case 2:
        if(labyrinthe[newPos].leftDoor && labyrinthe[newPos].rightDoor){
            labyrinthe[newPos].level[5] = "g           D";
        }
        else if(labyrinthe[newPos].leftDoor){
            labyrinthe[newPos].level[5] = "g           l";
        }
        else if(labyrinthe[newPos].rightDoor){
            labyrinthe[newPos].level[5] = "|           D";
        }
        else{
            labyrinthe[newPos].level[5] = "|           l";
        }
        if(labyrinthe[newPos].topDoor){
            labyrinthe[newPos].level[0] = "(ttttthttttt)";
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
            labyrinthe[newPos].level[9] = "|     @     l"
            labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
            labyrinthe[newPos].level[1] = "|           l"
        break;
        
        case 3:if(labyrinthe[newPos].leftDoor){
            labyrinthe[newPos].level[5] = "g@          D";
        }
        else{
            labyrinthe[newPos].level[5] = "g@          l";
        }
        if(labyrinthe[newPos].topDoor){
            labyrinthe[newPos].level[0] = "(ttttthttttt)";
        }
        else{
            labyrinthe[newPos].level[0] = "(ttttttttttt)";
        }
        if(labyrinthe[newPos].bottomDoor){
            labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]"
        }
        labyrinthe[newPos].level[9] = "|           l"
        labyrinthe[newPos].level[1] = "|           l"
        break;

        case 4: if(labyrinthe[newPos].leftDoor && labyrinthe[newPos].rightDoor){
            labyrinthe[newPos].level[5] = "D           D";
        }
        else if(labyrinthe[newPos].leftDoor){
            labyrinthe[newPos].level[5] = "D           l";
        }
        else if(labyrinthe[newPos].rightDoor){
            labyrinthe[newPos].level[5] = "|           D";
        }
        else{
            labyrinthe[newPos].level[5] = "|           l";
        }
        if(labyrinthe[newPos].bottomDoor){
            labyrinthe[newPos].level[10] = "[wwwwwbwwwww]";
        }
        else{
            labyrinthe[newPos].level[10] = "[wwwwwwwwwww]";
        }
            labyrinthe[newPos].level[9] = "|           l"
            labyrinthe[newPos].level[1] = "|     @     l"
            labyrinthe[newPos].level[0] = "(ttttthttttt)";
        break;
    }
}

function createdScene(idScene,position,labyrinthe){
    scene(idScene, (levelIdx) => {
        if(compteur == 0){
            levelIdx = position;
            compteur = compteur+1;
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
                "door",
            ],
            "@": () => [
                sprite("bean"),
                area(),
                solid(),
                "bean",
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
            ],
            "b": () => [
                sprite("botDoor"),
                area(),
                solid(),
            ],
            "g": () => [
                sprite("leftDoor"),
                area(),
                solid(),
            ],
        })
        let player = get("bean")[0];
        let newPos;

        wait(0.2,() => {
            tempDoor = 0;
           });


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
            console.log("here");
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

createdScene(labyrinthe[24].idScene,24,labyrinthe);
start("main",24);