import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

const k = kaboom({ // le contexte
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [ 86, 28, 16 ]
})

let labyrinthe = [];
let labyrinthe2 = [];

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


let compteurSortie = 0;
let rand = Math.floor(Math.random() * 24)
let start = 24;
let sortie;
let tabMouvement = [-7,-1,1,7];

for(let i = 0 ; i<49;i++){
    if(i/7 < 1 || i%7 < 1 || i%7 == 6 || i/7 > 6){
       if(rand == compteurSortie){
        labyrinthe[i] = new Room("S");
        labyrinthe2[i] = "S"
        sortie = i;
        labyrinthe[i].isExit = true;
        console.log(i);
       }
       else if(i%7 == 6 && i != 0){
            labyrinthe[i] = new Room("b\n");
            labyrinthe2[i] = "b\n"
        }
        else{
            labyrinthe[i] = new Room("b");
            labyrinthe2[i] = "b"
        }
        compteurSortie += 1;
    }
    else if(i == 24){
        labyrinthe[i] = new Room("+");
        labyrinthe2[i] = "+"
    }
    else{
        labyrinthe[i] = new Room("-");
        labyrinthe2[i] = "-"
    }
}


createdSortie(sortie,labyrinthe);
console.log(labyrinthe2);


function createdSortie(newSortie,labyrinthe){
let ranndom = Math.floor(Math.random() * tabMouvement.length)
movement = tabMouvement[ranndom];
  if(newSortie -7 != start && newSortie-1 != start
    && newSortie+1 != start && newSortie+7 != start){
    if(movement < 0){
        if(movement == -1){
            if(newSortie%7 != 0){
                labyrinthe[newSortie].leftDoor = true;
                labyrinthe[newSortie].hasDoorModified = true;
                labyrinthe2[newSortie] = "c";
                console.log('left');
                return createdSortie(newSortie-1,labyrinthe);
            }
            else{
                console.log("here");
                return createdSortie(newSortie,labyrinthe);
            }
        }
        else{
            if(newSortie/7 > 1){
            labyrinthe[newSortie].topDoor = true;
            labyrinthe[newSortie].hasDoorModified = true;
            labyrinthe2[newSortie] = "c";
            console.log('top');
            return createdSortie(newSortie-7,labyrinthe);
            }
            else{
                console.log("here");
                return createdSortie(newSortie,labyrinthe);
            }
        }
    }
    else if(movement == 1){
        if(newSortie%7 != 6){
        labyrinthe[newSortie].rightDoor = true;
        labyrinthe[newSortie].hasDoorModified = true;
        labyrinthe2[newSortie] = "c";
        console.log('right');
        return createdSortie(newSortie+1,labyrinthe);
        }
        else{
            console.log('here');
            return createdSortie(newSortie,labyrinthe);
        }
    }
    else{
        if(newSortie/7 < 6){
        labyrinthe[newSortie].bottomDoor = true;
        labyrinthe[newSortie].hasDoorModified = true;
        labyrinthe2[newSortie] = "c";
        console.log('bot');
        return createdSortie(newSortie+7,labyrinthe);
        }
        else{
            console.log('here');
            return createdSortie(newSortie,labyrinthe);
        }
    }
  }
  else{
    if(newSortie-7 == start){
        labyrinthe2[newSortie] = 'c';
        labyrinthe2[newSortie-7] = '$';
    }
    else if(newSortie-1 == start){
        labyrinthe2[newSortie] = 'c';
        labyrinthe2[newSortie-1] = '$';
    }
    else if(newSortie+1 == start){
        labyrinthe2[newSortie] = 'c';
    }
    else{
        labyrinthe2[newSortie] = 'c';
        labyrinthe2[newSortie+7] = '$';
    }
  }
  console.log(" fin")
  labyrinthe2[sortie] = "S";
  return;
}


console.log(randi(0,5));