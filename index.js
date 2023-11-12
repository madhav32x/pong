const canvas = document.getElementById("game");
const context = canva.getElementById("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 8,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 40,
    netWidth = 5,
    netColor = "WHITE";

// draw net on canvas
function drawNet(){
    for(let i=0; i<=canvas.height; i+=15){
        drawRect(canvas.width / 2 - netWidth / 2, i,
        netWidt, 10, netColor )
    }
}

//Draw Rectangle on Canvas

function drawRect(x, y, width, height, color){
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Draw a circle on canvas
function drawCircle(x, y, radius, color){
    context.fillStyle = color;
    context.begainPath();
    context.arc(x, y, radius, 0, Math.PI * 2., false);
    context.closePath();
    context.fill();
}


//Draw text on canvas

function drawText(text, x, y, color, fontSize = 60,
    fontWeight = 'bold', font = 'Courier New'){
        context.fillStyle = color;
        context.font = '${FontWeight} ${fontSize}px ${font}';
        context.textAlign = "center";
        context.fillText(text, x, y);
    }

    //Create paddle object

    function createPaddle(x, y, width, height, color){
        return { x, y , width, height, color, score: 0};
    }

    //create a ball object

    function createBall(x, y, radius, velocityX, velocityY,
        color){
            return { x, y, radius, velocityX, velocityY, color, 
                speed: initialBallSpeed };
            }

            // define user and computer paddle objecta

            const user = createPaddle(0, canvasHeight / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

            const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2, paddleWidth, paddleHeight, "WHITE");

            // define ball objext

            const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, "WHITE");

            //update user paddle position based on mouse movement

            canvas.addEventListener('mousemove', movePaddle);

            function movePaddle(event){
                const rect = canvas.getBoundingClientRect();
                user.y = event.clientY - rect.top - user.height / 2;
            }

            //Check for collision between ball and paddle 

            function collision(b, p) {
                return (
                    b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height
                );
            }


// reset ball postion and velocity

function resetBall(){
    ball.x = canva.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}

// update game logic

function update(){
    //check for score and reset ball if needed
    if(ball.x = ball.radius < 0){
        con.score++;
        resetBall();
    }
    else if (ball.x * ball.radius > canvas.width){
        user.score++;
        resetBall();
    }

    //update ball postion

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //update the computer paddle position on ball postion

    com.y += (ball.y - (con.y + con.height / 2)) * 0.1;

    //top and bottom walls

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }

    //determine which paddle is begain hit by the ball and handle collsion

    let player = ball.x + ball.radius < canvas.width / 2 ? user:con;
    if (collision(ball, player)){
        const collidePoint = ball.y - (player.y + player.height / 2);
        const collisionAngle = (Math.pi / 4) * (collidePoint / (player.height / 2));
        const direction = ball.x + ball.radius < canvas.width / 2 ? -1:
        ball.velocityX = direction * ball.speed + Math.cos(collisionAngle);
        ball.velocityY = ball.speed * Math.sin(collisionAngle);

        //Increase the ball speed and limit to max speed

        ball.speed += 0.2;
        if(ball.speed > maxBallSpeed){
            ball.speed = maxBallSpeed;
        }
    }
}

//Render game on canvas

function render(){
    //clear canvas with black screen
    drawRect(0, 0 , canvas.width, canvas.height, "BLACK");
    drawNet();

    //Draw Scores
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GREY", 120, 'bold');
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GREY", 120, 'bold');; 

    //draw paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//run game loop

function gameloop(){
    update();
    render();
}

//set gameloop to run at 60 frames per second

const framePerSec = 60;
setInterval(gameloop, 1000 / framePerSec);