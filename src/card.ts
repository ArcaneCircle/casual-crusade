import { Draggable } from "./engine/draggable";
import { drawCircle } from "./engine/drawing";
import { Mouse } from "./engine/mouse";
import { Pulse } from "./engine/pulse";
import { Tween } from "./engine/tween";
import { Vector, distance } from "./engine/vector";
import { Game } from "./game";
import { Level } from "./level";
import { TextEntity } from "./text";
import { Tile } from "./tile";

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 60;

const BORDER = 7;
const GAP = 2;

const gemColors = [
    "#fff",
    "blue",
    "purple",
    "red",
    "yellow",
    "orange",
    "green"
];

export enum Direction {
    Up,
    Right,
    Down,
    Left
};

export enum Gem {
    None,
    Blue,
    Purple,
    Red,
    Yellow,
    Orange,
    Green
};

export interface CardData {
    directions: Direction[];
    gem: Gem;
}

export function randomCard(canHaveGem = true, dirs?: Direction[]): CardData {
    const count = 1 + Math.floor(Math.random() * 4);
    return {
        directions: dirs ?? [Direction.Up, Direction.Right, Direction.Down, Direction.Left].sort(() =>  Math.random() - 0.5).slice(0, count),
        gem: canHaveGem && Math.random() < 0.2 ? 1 + Math.floor(Math.random() * 6): Gem.None
    }
}

export class Card extends Draggable {
    private tile: Tile;
    private tween: Tween;

    public constructor(x: number, y: number, private level: Level, private game: Game, public data: CardData) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT);
        this.tween = new Tween(this);
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.tween.update(tick);
        const sorted = [...this.level.board]
            .filter(tile => !tile.content && tile.accepts(this, this.level.board) && distance(this.position, tile.getPosition()) < 100)
            .sort((a, b) => distance(this.position, a.getPosition()) - distance(this.position, b.getPosition()));
        this.tile = sorted.length > 0 ? sorted[0]: null;
    }

    public move(to: Vector, duration: number): void {
        this.tween.move(to, duration);
    }

    public getPossibleSpots(): Tile[] {
        return this.level.board.filter(tile => !tile.content && tile.accepts(this, this.level.board))
    }

    protected pick(): void {
        this.getPossibleSpots().forEach(tile => tile.marked = true);
    }

    protected drop(): void {
        this.level.board.forEach(tile => tile.marked = false);
        this.level.board.filter(tile => tile.content === this).forEach(tile => tile.content = null);

        if(this.tile) {
            this.game.multi = 1;
            this.locked = true;
            this.position = this.tile.getPosition();
            this.tile.content = this;
            this.game.fill();
            this.game.findPath(this.tile, this.game);
            if(this.data.gem == Gem.Blue) {
                this.game.pull();
            }
            return;
        }

        this.move(this.getStartPosition(), 0.1);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.dragging && this.tile) {
            ctx.strokeStyle = "#ddd";
            ctx.lineWidth = 7;
            const tilePos = this.tile.getPosition();
            ctx.strokeRect(
                tilePos.x + BORDER + GAP, 
                tilePos.y + BORDER + GAP,
                this.size.x - BORDER * 2 - GAP * 2,
                this.size.y - BORDER * 2 - GAP * 2
            );
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x + GAP, this.position.y + GAP, this.size.x - GAP * 2, this.size.y - GAP * 2);
        ctx.fillStyle = this.hovered ? "#ff9999" : "#fff";
        ctx.fillRect(this.position.x + BORDER + GAP, this.position.y + BORDER + GAP, this.size.x - BORDER * 2 - GAP * 2, this.size.y - BORDER * 2 - GAP * 2);

        if(this.data.directions.includes(Direction.Up)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + BORDER + GAP);
        }
        if(this.data.directions.includes(Direction.Right)) {
            this.lineTo(ctx, this.position.x + this.size.x - BORDER - GAP, this.position.y + this.size.y * 0.5);
        }
        if(this.data.directions.includes(Direction.Down)) {
            this.lineTo(ctx, this.position.x + this.size.x * 0.5, this.position.y + this.size.y - BORDER - GAP);
        }
        if(this.data.directions.includes(Direction.Left)) {
            this.lineTo(ctx, this.position.x + BORDER + GAP, this.position.y + this.size.y * 0.5);
        }

        const p = {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5
        };
        drawCircle(ctx, p, 8, "#000");

        if(this.data.gem) {
            drawCircle(ctx, p, 12, "#000");
            drawCircle(ctx, p, 6, gemColors[this.data.gem]);
        }
    }

    public lock(): void {
        this.depth = -50;
        this.locked = true;
    }

    public has(dir: Direction): boolean {
        return this.data.directions && this.data.directions.includes(dir);
    }

    public getConnections(): Tile[] {
        const index = this.level.board.find(tile => tile.content === this).index;
        return this.data.directions.map(d => {
            if(d == Direction.Up) return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y - 1 && tile.content && tile.content.has(Direction.Down));
            if(d == Direction.Down) return this.level.board.find(tile => tile.index.x === index.x && tile.index.y === index.y + 1 && tile.content && tile.content.has(Direction.Up));
            if(d == Direction.Left) return this.level.board.find(tile => tile.index.x === index.x - 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Right));
            if(d == Direction.Right) return this.level.board.find(tile => tile.index.x === index.x + 1 && tile.index.y === index.y && tile.content && tile.content.has(Direction.Left));
        }).filter(tile => tile && tile.content);
    }

    public activate(): void {
        if(this.data.gem == Gem.Purple) {
            this.game.discard();
        }
        if(this.data.gem == Gem.Orange) {
            this.game.multi *= 2;
            this.popText(`x${this.game.multi}`, {
                x: this.position.x + this.size.x * 0.5,
                y: this.position.y + this.size.y * 0.5 - 50
            });
        }
    }

    public pop(amt: number): void {
        setTimeout(() => {
            this.activate();
            this.game.camera.shake(3, 0.08);
            this.addScore(amt);
        }, 0.2);
    }

    private addScore(amt: number, ): void {
        const mod = this.data.gem == Gem.Yellow ? 10 : 1;
        const addition = amt * mod * this.game.multi * this.level.level;
        this.game.score += addition;
        const p = {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5 - 20
        };
        this.game.effects.add(new Pulse(p.x, p.y - 10, 40 + Math.random() * 40));
        this.popText(addition.toString(), p);
    }

    private popText(content: string, p: Vector): void {
        this.game.effects.add(new TextEntity(
            content,
            40 + Math.random() * 10,
            p.x,
            p.y,
            0.5 + Math.random(),
            { x: 0, y: -1 - Math.random() },
            { shadow: 4, align: "center", scales: true }
        ));
    }

    private lineTo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 7;
        ctx.moveTo(this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}