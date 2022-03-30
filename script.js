const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let particleArray =[];

let mouse = {
    x: null,
    y: null,
    radius: 200
}
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x 
        mouse.y = event.y 

});

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0,0,imageWidth,imageHeight);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    class Particle {
        constructor(x,y,color,size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random()* 10) + 2;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;
        
            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            //max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force<0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);
            
            if (distance < mouse.radius + this.size){
                this.x -=directionX;
                this.y -=directionY;
            } else{
                if(this.x !==this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if(this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -=dy/20;
                }
            }
            this.draw();

        }
    }
    function init(){
        particleArray = [];

        for (let y=0, y2 = data.height; y<y2; y++){
            for(let x=0, x2 = data.width; x<x2; x++){
                if (data.data[(y*4*data.width)+(x*4)+3]>128){
                    let positionX = x;
                    let positionY =y;
                    let color = "rgb("+ data.data[(y*4*data.width)+(x*4)]+","+
                                        data.data[(y*4*data.width)+(x*4)+1]+","+
                                        data.data[(y*4*data.width)+(x*4)+2]+")";
                    particleArray.push(new Particle(positionX*4,positionY*4,color));
                }
            }
        }
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05)';
        ctx.fillRect(0,0,innerWidth,innerHeight);

        for(let i=0; i<particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
}

const png = new Image();
png.src ="data:image/jpeg;base64,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";

window.addEventListener('load', (event) =>{
    console.log('page has loaded');
    ctx.drawImage(png,0,0);
    drawImage();
});

