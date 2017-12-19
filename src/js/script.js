const THREE = require(`three`);
const io = require(`socket.io-client`);

import Colors from './objects/lib/Colors';
import KeyPressed from './objects/lib/KeyPressed';
import Paddle from './objects/Paddle';
import Materials from './objects/lib/Materials';
import Ball from './objects/Ball';
import Ground from './objects/Ground';
import Field from './objects/Field';

let renderer, scene, camera, pointLight, spotLight;

let twoPlayers = false;
let playerOne = true;

let timeleft = 5;

let ballPos = [];
let ballPosCheck = [];

let socket;

// field variables
const fieldWidth = 400, fieldHeight = 200;

// paddle variables
let paddleWidth, paddleHeight, paddleDepth;
let paddle1DirY = 0, paddle2DirY = 0;
let paddle1DirYPrev = 0, paddle2DirYPrev = 0;
const paddleSpeed = 3;

// ball variables
let ball, paddle1, paddle2;
let ballDirX = 1, ballDirY = 1;
const ballSpeed = 2;

// game-related variables
let score1 = 0, score2 = 0;
const maxScore = 7;

// set opponent difficulty
const difficulty = 0.1;

// const socket = io.connect(`http://192.168.0.240:3000`);

// particle variables
const movementSpeed = 20;
const totalObjects = 1000;
//const objectSize = 10;
const sizeRandomness = 40000;
//const colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
const parts = [];
const dirs = [];

// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

const settings = () => {
  const menu = document.querySelector(`.settings`);
  const game = document.querySelector(`.Pong`);
  const button = document.querySelector(`.settingSubmit`);
  document.querySelector(`.countdowntimer`).innerHTML = timeleft;
  game.style.display = `none`;
  const radios = document.getElementsByName(`players`);
  button.addEventListener(`click`, () => {
    for (let i = 0, length = radios.length;i < length;i ++)
    {
      if (radios[i].checked)
     {
        if (radios[i].value === `0`) {
          twoPlayers = false;
          playerOne = true;
          setup(game, menu);
        }
        if (radios[i].value === `1`) {
          twoPlayers = true;
          waitForPlayer(game, menu);
        }
      }
    }
  });

};

const waitForPlayer = (game, menu) => {
  socket = io.connect();
  console.log(twoPlayers);
  console.log(`waiting`);
  document.querySelector(`.waiting`).innerHTML = `waiting for player 2`;
  socket.on(`connect`, () => {
    console.log(`Connected: ${socket.id}`);
  });
  socket.on(`players`, users => {
    for (let i = 0;i < users.length;i ++) {
      if (users[i] === socket.id) {
        if (i === 0) {
          playerOne = true;
          console.log(playerOne);
        }
        else if (i === 1) {
          playerOne = false;
          console.log(playerOne);
        }
        else console.log(`waiting list`);
      }
    }
    setup(game, menu, socket);
  });
};

const countdown = () => {
  const downloadTimer = setInterval(function() {
    timeleft --;
    console.log(timeleft);
    document.querySelector(`.countdowntimer`).innerHTML = timeleft;
    if (timeleft <= 0) {
      document.querySelector(`.countdowntimer`).innerHTML = ``;
      clearInterval(downloadTimer);
      draw();
    }
  }, 1000);
};

const setup = (game, menu) => {
  game.style.display = `block`;
  menu.style.display = `none`;
  // update the board to reflect the max score for match win
  document.querySelector(`.winnerBoard`).innerHTML = `First to ${  maxScore  } wins!`;

  // now reset player and opponent scores
  score1 = 0;
  score2 = 0;

  // set up all the objects in the scene
  createCamera();
  createTable();
  lights();

  countdown();
};

const createCamera = () => {
  const WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

  // set some camera attributes
  const VIEW_ANGLE = 50;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;

  const c = document.querySelector(`.Pong`);

  // create a renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new THREE.Scene();

  //parts.push(new ExplodeAnimation(0, 0));

  // add the camera to the scene
  scene.add(camera);

  // set a default position for the camera
  camera.position.z = 320;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  c.appendChild(renderer.domElement);
};

const createTable = () => {
  // set up the playing surface plane
  const tableWidth = fieldWidth,
    planeHeight = fieldHeight,
    planeQuality = 10;

  const field = new Field(tableWidth, planeHeight, planeQuality);

  scene.add(field);
  field.receiveShadow = true;

  // Create a ball with sphere geometry
  const RADIUS = 5;
  const SEGMENTS = 6;
  const RINGS = 6;

  ball = new Ball(RADIUS, SEGMENTS, RINGS);

  // add the sphere to the scene
  scene.add(ball);

  ball.position.x = 0;
  ball.position.y = 0;
  // set ball above the table surface
  ball.position.z = RADIUS;
  ball.receiveShadow = true;
  ball.castShadow = true;

  // set up the paddle vars
  paddleWidth = 10;
  paddleHeight = 30;
  paddleDepth = 10;

  paddle1 = new Paddle(paddleWidth, paddleHeight, paddleDepth, Materials.paddle1Material());
  paddle2 = new Paddle(paddleWidth, paddleHeight, paddleDepth, Materials.paddle2Material());

  scene.add(paddle1);
  scene.add(paddle2);

  // set paddles on each side of the table
  paddle1.position.x = - fieldWidth / 2 + paddleWidth;
  paddle2.position.x = fieldWidth / 2 - paddleWidth;

  // lift paddles over playing surface
  paddle1.position.z = paddleDepth;
  paddle2.position.z = paddleDepth;

  // finally we finish by adding a ground plane
  // to show off pretty shadows
  const ground = new Ground();
    // set ground to arbitrary z position to best show off shadowing

  scene.add(ground);
};

const lights = () => {
  pointLight = new THREE.PointLight(Colors.yellowLight);

  // set its position
  pointLight.position.x = - 1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  scene.add(pointLight);

  // add a spot light
  // this is important for casting shadows
  spotLight = new THREE.SpotLight(Colors.yellowLight);
  spotLight.position.set(0, 0, 460);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  scene.add(spotLight);

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  renderer.shadowMap.enabled = true;
};

const explodeAnimation = (x, y) => {

  const starsGeometry = new THREE.Geometry();

  for (let i = 0;i < totalObjects;i ++) {
    const star = new THREE.Vector3();
    star.x = x + THREE.Math.randFloatSpread(100);
    star.y = y + THREE.Math.randFloatSpread(100);
    star.z = THREE.Math.randFloatSpread(100);

    starsGeometry.vertices.push(star);
    dirs.push({
      x: (Math.random() * 10) - (10 / 5),
      y: (Math.random() * 10) - (movementSpeed / 5),
      z: (Math.random() * movementSpeed) - (movementSpeed / 5)
    });
  }
  //totalObjects = 1000;

  const starsMaterial = new THREE.PointsMaterial({size: 1, color: 0xffffff, opacity: 1});
  const starField = new THREE.Points(starsGeometry, starsMaterial);

  this.object = starField;
  this.status = true;

  scene.add(this.object);
};

const draw = () => {
  updateStars();
  ballPhysics();
  paddlePhysics();
  player1PaddleMovement();
  if (twoPlayers) {
    player2PaddleMovement();
  } else {
    aiPaddleMovement();
  }

  renderer.render(scene, camera);

  requestAnimationFrame(draw);
};

const updateStars = () => {
  let pCount = 1;
  while (pCount --) {
    if (this.status === true) {
      let pCountO = totalObjects;
      while (pCountO --) {
        const particle = this.object.geometry.vertices[pCountO];
        particle.x += dirs[pCountO].y;
        particle.y += dirs[pCountO].x;
        particle.z += dirs[pCountO].z;
      }

      this.object.geometry.verticesNeedUpdate = true;
    }
  }
};

const ballPhysics = () => {
  // if ball goes off the 'left' side (Player's side)
  if (playerOne) {
    if (ball.position.x <= - fieldWidth / 2)
    {
      // CPU scores
      score2 ++;
      // update scoreboard HTML
      document.querySelector(`.scores`).innerHTML = `${score1}-${score2}`;
      // reset ball to center
      resetBall(2);
    }

    // if ball goes off the 'right' side (CPU's side)
    if (ball.position.x >= fieldWidth / 2)
    {
      // Player scores
      score1 ++;
      // update scoreboard HTML
      document.querySelector(`.scores`).innerHTML = `${score1  }-${  score2}`;
      // reset ball to center
      resetBall(1);
    }

    // if ball goes off the top side (side of table)
    if (ball.position.y <= - fieldHeight / 2)
    {
      ballDirY = - ballDirY;
    }
    // if ball goes off the bottom side (side of table)
    if (ball.position.y >= fieldHeight / 2)
    {
      ballDirY = - ballDirY;
    }

    // update ball position over time
    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;

    // limit ball's y-speed to 2x the x-speed
    // this is so the ball doesn't speed from left to right super fast
    // keeps game playable for humans
    if (ballDirY > ballSpeed * 2) {
      ballDirY = ballSpeed * 2;
    }
    else if (ballDirY < - ballSpeed * 2) {
      ballDirY = - ballSpeed * 2;
    }

    ballPos = [ball.position.x, ball.position.y, score1, score2];

    if (twoPlayers) {
      if (ballPosCheck !== ballPos) {
        ballPosCheck = ballPos;
        socket.emit(`ballPos`, ballPos);
      }
    }

  } else {
    if (twoPlayers) {
      socket.on(`ballPos`, ballPos => {
        if (ballPosCheck !== ballPos) {
          ballPosCheck = ballPos;
          ball.position.x = ballPos[0];
          ball.position.y = ballPos[1];
          document.querySelector(`.scores`).innerHTML = `${ballPos[2]  }-${  ballPos[3]}`;
        }
      });
    }
  }
};

// Handles CPU paddle movement and logic
const aiPaddleMovement = () => {
  // Lerp towards the ball on the y plane
  paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

  // in case the Lerp function produces a value above max paddle speed, we clamp it
  if (Math.abs(paddle2DirY) <= paddleSpeed)
  {
    paddle2.position.y += paddle2DirY;
  }
  // if the lerp value is too high, we have to limit speed to paddleSpeed
  else
  {
    // if paddle is lerping in +ve direction
    if (paddle2DirY > paddleSpeed)
    {
      paddle2.position.y += paddleSpeed;
    }
    // if paddle is lerping in -ve direction
    else if (paddle2DirY < - paddleSpeed)
    {
      paddle2.position.y -= paddleSpeed;
    }
  }
  // We lerp the scale back to 1
  // this is done because we stretch the paddle at some points
  // stretching is done when paddle touches side of table and when paddle hits ball
  // by doing this here, we ensure paddle always comes back to default size
  // paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
};

const player2PaddleMovement = () => {
  if (!playerOne) {
    if (KeyPressed.isDown(KeyPressed.UP)) {
    // if paddle is not touching the side of table
    // we move
      if (paddle2.position.y < fieldHeight * 0.45) {
        paddle2DirY = paddleSpeed * 0.5;
      }
    // else we don't move and stretch the paddle
    // to indicate we can't move
      else {
        paddle2DirY = 0;
        paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
      }
    }
  // move right
    else if (KeyPressed.isDown(KeyPressed.DOWN)) {
    // if paddle is not touching the side of table
    // we move
      if (paddle2.position.y > - fieldHeight * 0.45) {
        paddle2DirY = - paddleSpeed * 0.5;
      }
    // else we don't move and stretch the paddle
    // to indicate we can't move
      else {
        paddle2DirY = 0;
        paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
      }
    }
  // else don't move paddle
    else {
    // stop the paddle
      paddle2DirY = 0;
    }
    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
    paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
    paddle2.position.y += paddle2DirY;
    socket.on(`playerOne`, movement => {
      if (paddle1DirYPrev !== movement) {
        paddle1DirYPrev = movement;
        paddle1.position.y = paddle1DirYPrev;
      }
    });
    if (paddle2DirYPrev !== paddle2.position.y) {
      paddle2DirYPrev = paddle2.position.y;
      socket.emit(`playerTwo`, paddle2DirYPrev);
    }
  }
};

// Handles player's paddle movement
const player1PaddleMovement = () => {
  if (playerOne || !twoPlayers) {
    // move left
    if (KeyPressed.isDown(KeyPressed.UP)) {
    // if paddle is not touching the side of table
    // we move
      if (paddle1.position.y < fieldHeight * 0.45) {
        paddle1DirY = paddleSpeed * 0.5;
      }
    // else we don't move and stretch the paddle
    // to indicate we can't move
      else {
        paddle1DirY = 0;
        paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
      }
    }
  // move right
    else if (KeyPressed.isDown(KeyPressed.DOWN)) {
    // if paddle is not touching the side of table
    // we move
      if (paddle1.position.y > - fieldHeight * 0.45) {
        paddle1DirY = - paddleSpeed * 0.5;
      }
    // else we don't move and stretch the paddle
    // to indicate we can't move
      else {
        paddle1DirY = 0;
        paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
      }
    }
  // else don't move paddle
    else {
    // stop the paddle
      paddle1DirY = 0;
    }
    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1DirY;
    if (twoPlayers) {
      socket.on(`playerTwo`, movement => {
        if (paddle2DirYPrev !== movement) {
          paddle2DirYPrev = movement;
          paddle2.position.y = paddle2DirYPrev;
        }
      });
      if (paddle1DirYPrev !== paddle1.position.y) {
        paddle1DirYPrev = paddle1.position.y;
        socket.emit(`playerOne`, paddle1DirYPrev);
      }
    }
  }
};

// Handles paddle collision logic
const paddlePhysics = () => {
  // PLAYER PADDLE LOGIC

  // if ball is aligned with paddle1 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle1.position.x + paddleWidth
  &&  ball.position.x >= paddle1.position.x)
  {
    // and if ball is aligned with paddle1 on y plane
    if (ball.position.y <= paddle1.position.y + paddleHeight / 2
    &&  ball.position.y >= paddle1.position.y - paddleHeight / 2)
    {
      // and if ball is travelling towards player (-ve direction)
      if (ballDirX < 0)
      {
        // stretch the paddle to indicate a hit
        // paddle1.scale.y = 15;
        // switch direction of ball travel to create bounce
        ballDirX = - ballDirX;
        //explodeAnimation();
        parts.push(new explodeAnimation(ball.position.x, ball.position.y, Math.random(sizeRandomness), Math.random(sizeRandomness)));
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle1DirY * 0.7;
      }
    }
  }

  // OPPONENT PADDLE LOGIC

  // if ball is aligned with paddle2 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle2.position.x + paddleWidth
  &&  ball.position.x >= paddle2.position.x)
  {
    // and if ball is aligned with paddle2 on y plane
    if (ball.position.y <= paddle2.position.y + paddleHeight / 2
    &&  ball.position.y >= paddle2.position.y - paddleHeight / 2)
    {
      // and if ball is travelling towards opponent (+ve direction)
      if (ballDirX > 0)
      {
        // stretch the paddle to indicate a hit
        //paddle2.scale.y = 15;
        // switch direction of ball travel to create bounce
        ballDirX = - ballDirX;
        //explodeAnimation();
        parts.push(new explodeAnimation(ball.position.x, ball.position.y));
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle2DirY * 0.7;
      }
    }
  }
};

const resetBall = loser => {
  // position the ball in the center of the table
  ball.position.x = 0;
  ball.position.y = 0;
  // if player lost the last point, we send the ball to opponent
  if (loser === 1)
  {
    ballDirX = - 1;
  }
  // else if opponent lost, we send ball to player
  else
  {
    ballDirX = 1;
  }
  // set the ball to move +ve in y plane (towards left from the camera)
  ballDirY = 1;
};

window.addEventListener(`keyup`, event => { KeyPressed.onKeyup(event); }, false);
window.addEventListener(`keydown`, event => { KeyPressed.onKeydown(event); }, false);

settings();
