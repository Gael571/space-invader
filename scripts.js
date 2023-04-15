//Déclare le monde dans le canvas avec l'id gameboard
const world = document.querySelector('#gameboard');
//Définie le contexte du monde
const c = world.getContext('2d');
//Définie la dimension du mon selon le CSS
world.width = world.clientWidth;
world.height = world.clientHeight;
//Indicateur de la boucle
let frames = 0;

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
       //Gére l'image du joueur
        const image = new Image();
        image.src = './space.png';
        image.onload=()=>{
            this.image = image;
            this.width = 48;
            this.height = 48;
            this.position={
                x:world.width/2 - this.width/2, // position du joueur par default au centre
                y:world.height - this.height -10 // position du joueur par défault en bas
            }
        }
        
    }

    draw(){
        c.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            );   
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
        if(this.image){
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
}


class Alien{
    constructor({position}){
        this.velocity={x:0, y:0 }
        const image= new Image();
        image.src = './ghost.png';
        image.onload =()=>{
            this.image = image;
            this.width=32;
            this.height=32  ;
            this.position= {
                x:position.x,
                y:position.y
            }
        }
        
    }
    draw(){
        if(this.image){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height,);       
        }
    }

    update({velocity}){
        if(this.image){
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        if(this.position.y + this.height >= world.height){
            console.log('You loose');
        }
        }
        this.draw();
    }
    
    shoot(alienMissiles){
        if(this.position){
            alienMissiles.push(new alienMissile({
                position:{
                    x:this.position.x,
                    y:this.position.y
                },
                velocity:{
                    x:0,
                    y:3
                }
            }))
        }
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

class Grid{
    constructor(){
        this.position={x:0,y:0};
        this.velocity={x:1,y:0};
        this.invaders = [ ]

        let rows = Math.floor(world.height/34)*(1/3);
        const colums = Math.floor(world.width/34)*(2/3);

        this.height= rows*34;
        this.width = colums*34;
        for(let x=0; x<colums;x++){
            for(let y=0; y<rows; y++){
                this.invaders.push(new Alien({
                    position:{
                        x:x*34,
                        y:y*34
                    }
                }))
            }
        }
    }
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if(this.position.x + this.width >= world.width || this.position.x == 0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 34;
        }
    }
}

class Particule{
    constructor({position,velocity,radius,color}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
    }
    draw(){
        c.save();
        c.globalAlpha = this.opacity;                         
        c.beginPath();
        c.fillStyle=this.color;
        c.arc(this.position.x,this.position.y, this.radius,0,Math.PI *2)
        c.fill()
        c.closePath()
        c.restore();
    }
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.opacity > 0){
            this.opacity -=0.01;
        }
        this.draw()
    }
 }

class alienMissile{
    constructor({position,velocity}){
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }
    draw(){
        c.fillStyle='yellow';
        c.fillRect(this.position.x,this.position.y,this.width,this.height);
        c.fill();
    }
    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
}


const missiles=[];
const alienMissiles = [];
let grids = [new Grid()];

const player = new Player();
let particules=[];

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
    grids.forEach((grid,indexGrid) =>{
        grid.update();
        if(frames %50 === 0 && grid.invaders.length >0){
            grid.invaders[Math.floor(Math.random()*(grid.invaders.length))].shoot(alienMissiles);
            console.log(alienMissiles);
        }
        grid.invaders.forEach((invader,indexI)=>{
            invader.update({velocity:grid.velocity});
            missiles.forEach((missile,indexM)=>{
                if(missile.position.y <= invader.position.y + invader.height &&
                    missile.position.y >= invader.position.y &&
                    missile.position.x + missile.width >= invader.position.x &&
                    missile.position.x - missile.width <= invader.position.x + invader.width){
                        for(let i=0; i <12;i++){
                            particules.push(new Particule({
                                position:{
                                    x:invader.position.x + invader.width/2,
                                    y:invader.position.y + invader.height/2
                                },
                                velocity:{x:(Math.random()-0.5)*2,y:(Math.random()-0.5)*2},
                                radius:Math.random()*5+1,
                                color:'red'
                            }))
                        } 
                    setTimeout(()=>{
                        grid.invaders.splice(indexI,1);
                           
                        missiles.splice(indexM,1)
                        if(grid.invaders.length === 0 && grids.length ==1 ){
                            grids.splice(indexGrid,1);
                            grids.push(new Grid());
                        } 
                    },0)
                    }
                })
            })



        
    })
    alienMissiles.forEach((alienMissile,index) =>{
        if(alienMissile.position.y + alienMissile.height >=world.height){ 
            setTimeout(() =>{
                alienMissiles.splice(index,1)} ,0);
                    
            }
        else{alienMissile.update();}
        if(alienMissile.position.y + alienMissile.height >= player.position.y  && 
            alienMissile.position.y  <= player.position.y +player.height  && 
            alienMissile.position.x  >= player.position.x  && 
            alienMissile.position.x + alienMissile.width <= player.position.x + player.width){
            alienMissiles.splice(index,1);
               for(let i=0; i <22;i++){
                    particules.push(new Particule({
                        position:{
                            x:player.position.x + player.width/2,
                            y:player.position.y + player.height/2
                        },
                        velocity:{x:(Math.random()-0.5)*2,y:(Math.random()-0.5)*2},
                        radius:Math.random()*5,
                        color:'white'
                    }))
                }
             //   lostLife(); 
                 
            }
        }) 

        particules.forEach((particule,index)=>{
            if(particule.opacity <=0){
                particules.splice(index,1)
            }else{
                particule.update();
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