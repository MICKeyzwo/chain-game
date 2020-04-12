import { ChainPart, PART_SIZE } from './chain-part';

/** 1辺あたりのパーツの数 */
const PART_COUNT = 50;

/** キャンバスのサイズ */
const CANVAS_SIZE = PART_SIZE * PART_COUNT;


/** チェインゲームの本体クラス */
export class ChainGame {

    /** キャンバスコンテキスト */
    private context: CanvasRenderingContext2D;

    /** キャンバスの座標情報 */
    private canvasRect: DOMRect;

    /** パーツ郡への参照 */
    private parts: ChainPart[][];

    /** タイマーのID */
    private timer: number;


    constructor(
        private canvas: HTMLCanvasElement
    ) {
        this.context = canvas.getContext('2d');
        this.canvasRect = canvas.getBoundingClientRect();
    }


    /** ゲームの開始 */
    start(): void {

        this.canvas.width = this.canvas.height = CANVAS_SIZE;

        this.canvas.addEventListener('mousedown', this.onClick.bind(this));

        this.parts = Array.from(Array(PART_COUNT), (_, y) =>
            Array.from(Array(PART_COUNT), (_, x) =>
                new ChainPart(x * PART_SIZE, y * PART_SIZE)
            )
        );

        for (let y = 0; y < PART_COUNT; y++) {
            for (let x = 0; x < PART_COUNT; x++) {
                const part = this.parts[y][x];
                if (y > 0) {
                    part.appendNeighbor('top', this.parts[y - 1][x]);
                }
                if (x < PART_COUNT - 1) {
                    part.appendNeighbor('right', this.parts[y][x + 1]);
                }
                if (y < PART_COUNT - 1) {
                    part.appendNeighbor('bottom', this.parts[y + 1][x]);
                }
                if (x > 0) {
                    part.appendNeighbor('left', this.parts[y][x - 1]);
                }
            }
        }

        this.timer = setInterval(this.update.bind(this), 1000 / 33);

        console.log('chain game started!');

    }

    /** ゲームのリセット */
    reset(): void {

        for (const parts of this.parts) {
            for (const part of parts) {
                part.init();
            }
        }

        this.draw();

    }

    /** ゲームの終了 */
    end(): void {

        clearInterval(this.timer);

    }

    /** フレーム毎の更新 */
    private update(): void {

        for (const parts of this.parts) {
            for (const part of parts) {
                part.update();
            }
        }

        this.draw();

    }

    /** 画面描画 */
    private draw(): void {

        this.context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        for (const parts of this.parts) {
            for (const part of parts) {
                part.draw(this.context);
            }
        }

    }

    /** キャンバスクリック時のイベントハンドラ */
    private onClick(e: MouseEvent): void {

        const x = Math.floor((e.clientX - this.canvasRect.x) / PART_SIZE);
        const y = Math.floor((e.clientY - this.canvasRect.y) / PART_SIZE);
        this.parts[y][x].rotate();

    }

}
