import { ButtonEntity } from "./engine/button";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { ZERO } from "./engine/vector";
import { Game } from "./game";
import { HEIGHT, WIDTH } from "./index";
import { TextEntity } from "./text";
import { transformToCenter } from "./engine/transformer";

export class GameOver extends Entity {
  public visible: boolean;

  private again: ButtonEntity;
  private gameOver = new TextEntity(
    "SIEGE ENDED!",
    90,
    WIDTH * 0.5,
    280,
    -1,
    ZERO,
    { shadow: 8, align: "center" },
  );

  constructor(game: Game) {
    super(0, 0, 0, 0);
    this.again = new ButtonEntity(
      "TRY AGAIN?",
      WIDTH * 0.5,
      HEIGHT * 0.5 + 90,
      300,
      75,
      () => game.restart(),
      game.audio,
    );
    this.scale = { x: 1, y: 0 };
  }

  public click(x: number, y: number, game: Game): void {
    if (this.again.isInside({ x, y })) {
      game.restart();
    }
  }

  public toggle(state: boolean): void {
    const delay = state ? 0.3 : 0.1;
    this.tween.scale({ x: 1, y: state ? 1 : 0 }, delay);
    setTimeout(() => (this.visible = state), delay * 1000);
  }

  public update(tick: number, mouse: Mouse): void {
    this.tween.update(tick);
    if (this.visible) this.again.update(tick, mouse);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    transformToCenter(ctx, 0, this.scale.x, this.scale.y);
    ctx.fillStyle = "#000000bb";
    ctx.fillRect(-100, HEIGHT * 0.2, WIDTH + 200, HEIGHT * 0.6);
    this.gameOver.draw(ctx);
    this.again.draw(ctx);
    ctx.restore();
  }
}
