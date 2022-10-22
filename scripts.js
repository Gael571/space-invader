//Déclare le monde dans le canvas avec l'id gameboard
const world = document.querySelector('#gameboard');
//Définie le contexte du monde
const c = world.getContext('2d');
//Définie la dimension du mon selon le CSS
world.width = world.clientWidth;
world.height = world.clientHeight;
//Indicateur de la boucle
let frames = 0;
const missiles = [];
//Etat des touches claviers
const keys = {
    ArrowLeft:{ pressed:false },
    ArrowRight:{ pressed:false },
}

class Player{
    constructor(){

        this.width = 32 // Largeur du player
        this.height = 32 // Hauteur du player
        this.velocity={
            x:0, //Vitesse de déplacement sur l'axe des X
            y:0 //Vitesse de déplacement sur l'axe des Y
       }
        this.position={
            x:(world.width-this.width)/2, // position du joueur par default au centre
            y:world.height - this.height // position du joueur par défault en bas
        }
        
    }

    draw(){
        //Le joueur sera un carré blanc
        c.fillStyle = 'white';
        c.fillRect(this.position.x,this.position.y,this.width,this.height);
    }
    shoot(){
        missiles.push(new Missile({
            position:{
                x:this.position.x + this.width/2,
                y:this.position.y
            }
        }))
    }

    update(){
        // A chaque mise à jour on dessine le joueur
        if(keys.ArrowLeft.pressed && this.position.x >= 0){
            this.velocity.x = -5;
            console.log(frames)
        }
        else if(keys.ArrowRight.pressed && this.position.x <= world.width - this.width){
            this.velocity.x = 5;
        }else{
            this.velocity.x = 0;
        }
        this.position.x += this.velocity.x;
        this.draw();
    }
}

class Missile{
    constructor({position}){
        this.position = position;
        this.velocity = {x:0, y:-5};
        this.width = 3;
        this.height = 10;
    }
    draw(){
        c.fillStyle='red';
        c.fillRect(this.position.x,this.position.y,this.width,this.height);

    }
    update(){
        this.position.y += this.velocity.y;
        this.draw();
    }
}
const player = new Player();

//Boucle d'animation
const animationLoop = ()=>{
    requestAnimationFrame(animationLoop);
    c.clearRect(0,0,world.width,world.height);
    player.update();
    missiles.forEach((missile,index)=>{
        if(missile.position.y + missile.height <=0){
            setTimeout(()=>{
                missiles.splice(index,1)}
            ,0)
        }else{
            missile.update();
            }
        })
    frames++;
}
animationLoop();

addEventListener('keydown',({key})=>{

    switch(key){
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            console.log('left');
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            console.log('right');
            break;
    }
})
addEventListener('keyup',({key})=>{

    switch(key){
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            console.log('left');
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            console.log('right');
            break;
        case ' ':
            player.shoot();
            console.log(missiles);
    }
})


 //console.log(frames)