import { Card, Direction, Gem, TILE_HEIGHT, TILE_WIDTH } from "./card";
import { Dude } from "./dude";
import { AudioManager } from "./engine/audio";
import { ButtonEntity } from "./engine/button";
import { Camera } from "./engine/camera";
import { Container } from "./engine/container";
import { Entity, sortByDepth } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector, ZERO } from "./engine/vector";
import { Game } from "./game";
import { Level } from "./level";
import { TextEntity } from "./text";

export const WIDTH = 800;
export const HEIGHT = 600;

const audio = new AudioManager();
audio.prepare();

const boardPos: Vector = {
  x: WIDTH * 0.5 - TILE_WIDTH * 1.5,
  y: HEIGHT * 0.5 - TILE_HEIGHT * 1.75
};

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")

const lifeText = new TextEntity("LIFE: 10", 30, 10, 35, -1, ZERO, { shadow: 4, align: "left" });
const scoreText = new TextEntity("0", 30, WIDTH - 10, 35, -1, ZERO, { shadow: 4, align: "right" });
const title = new TextEntity("CASUAL CRUSADE", 70, WIDTH * 0.5, 110, -1, ZERO, { shadow: 7, align: "center" });
const me = new TextEntity("by Antti Haavikko", 35, WIDTH * 0.5, 155, -1, ZERO, { shadow: 5, align: "center" });
const effects = new Container();
const camera = new Camera();
const level = new Level(boardPos);

const dude = new Dude(level.board[2]);

const mouse: Mouse = { x: 0, y: 0 };
const game = new Game(dude, effects, camera, level, audio);

const p = level.board[2].getPosition();
const startButton = new ButtonEntity("PLAY", WIDTH * 0.5, HEIGHT * 0.5 + 220, 250, 75, () => {}, audio);

const startUi: Entity[] = [
  startButton,
  title,
  me
];

const entities: Entity[] = [
  game
];

const ui: Entity[] = [
  lifeText,
  scoreText,
];

level.starter = new Card(p.x, p.y, level, game, { directions: [Direction.Up, Direction.Right, Direction.Down, Direction.Left], gem: Gem.None });
level.starter.lock();
level.board[2].content = level.starter;
entities.push(level.starter);

canvas.id = "game";
canvas.width = WIDTH;
canvas.height = HEIGHT;
const div = document.createElement("div");
div.appendChild(canvas);
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
document.body.appendChild(canvas);

canvas.onmousemove = (e: MouseEvent) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

document.onkeydown = (e: KeyboardEvent) => {
  audio.prepare();
  if(e.key == 'n') {
    game.nextLevel();
    game.life += 100;
  }
  // if(e.key == 'f') {
  //   canvas.requestFullscreen();
  // }
  if(e.key == 'p') {
    game.picker.rewards = 1;
    game.picker.create(1);
  }
  if(e.key == 'c') {
    game.picker.rewards = 1;
    game.picker.create(0);
  }
}

document.onmousedown = (e: MouseEvent) => {
  audio.play();
  mouse.pressing = true;
  if(startButton.isInside(mouse)) {
    startButton.visible = false;
    audio.pop();
    setTimeout(() => game.started = true, 100);
  }
};

document.onmouseup = (e: MouseEvent) => mouse.pressing = false;

let zoom = 1.2;

function tick(t: number) {
  scoreText.content = game.score.toString();
  lifeText.content = `LIFE: ${game.life}/${game.maxLife}`;
  requestAnimationFrame(tick);
  ctx.resetTransform();
  ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
  ctx.scale(zoom, zoom);
  ctx.translate(-WIDTH * 0.5, -HEIGHT * 0.5 + (game.started ? 0 : 30));
  camera.update();
  ctx.translate(camera.offset.x, camera.offset.y);
  ctx.fillStyle = "#74be75";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
  ctx.rotate(-Math.PI * 0.25);
  ctx.scale(2, 2);
  ctx.translate(-WIDTH * 0.5, -HEIGHT * 0.75);
  ctx.fillStyle = "#ffffff22";
  for(let i = 0; i < 10; i++) {
    ctx.fillRect(200 * i, 0, 100, 999);
    ctx.fillRect(200 * i - 70, 0, 5, 999);
    ctx.fillRect(200 * i - 35, 0, 5, 999);
    ctx.fillRect(200 * i + 50, 0, 5, 999);
  }
  ctx.save();
  ctx.translate(WIDTH * 0.5, HEIGHT * 0.5);
  ctx.rotate(-Math.PI * 0.5);
  ctx.translate(-WIDTH * 0.5, -HEIGHT * 0.75);
  for(let i = 0; i < 10; i++) {
    ctx.fillRect(200 * i, 0, 100, 999);
    ctx.fillRect(200 * i - 70, 0, 5, 999);
    ctx.fillRect(200 * i - 35, 0, 5, 999);
    ctx.fillRect(200 * i + 50, 0, 5, 999);
  }
  ctx.restore();
  ctx.restore();

  entities.forEach(e => e.update(t, mouse));
  effects.update(t, mouse);
  const all = [...entities, ...effects.getChildren(), ...level.board];
  all.sort(sortByDepth);
  level.board.forEach(t => t.prePreDraw(ctx));
  level.board.forEach(t => t.preDraw(ctx));
  all.forEach(e => e.draw(ctx));
  if(!game.started) {
    ctx.resetTransform();
    startUi.forEach(e => {
      e.update(t, mouse);
      e.draw(ctx);
    });
    return;
  }
  zoom = Math.max(1, zoom - 0.02);
  ui.forEach(e => e.draw(ctx));
}

requestAnimationFrame(tick);