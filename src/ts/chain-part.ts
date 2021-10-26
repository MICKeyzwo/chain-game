/** パーツごとの大きさ */
export const PART_SIZE = 10;

/** 隣接する要素の方向 */
type Direction = 'top' | 'right' | 'bottom' | 'left';

/** 回転の状態 */
type RotateStatus = 0 | 1 | 2 | 3;


/** 個々のパーツクラス */
export class ChainPart {

    /** 回転状態 */
    private _rotation = Math.floor(Math.random() * 4) as RotateStatus;

    /** 回転状態、公開用 */
    get rotation(): RotateStatus {
        return this._rotation;
    }

    /** 描画時の傾き */
    private angle = Math.PI / 2 * this._rotation;

    /** 回転のステップ数 */
    private rotatingCount = 0;

    /** 回転しているかどうかの状態 */
    private _isRotating = false;

    /** 回転しているかどうかの状態、公開用 */
    get isRotating(): boolean {
        return this._isRotating;
    }

    /** 隣接するパーツへの参照 */
    private neighbors = new Map<Direction, ChainPart>();

    /** 回転完了状態のフラグ */
    private _hasRotated = false;

    /** 回転完了状態のフラグ、公開用 */
    get hasRotated(): boolean {
        return this._hasRotated;
    }


    constructor(
        private x: number,
        private y: number
    ) { }


    /** 回転状態の初期化 */
    init(): void {

        this._rotation = Math.floor(Math.random() * 4) as RotateStatus;
        this.angle = Math.PI / 2 * this._rotation;
        this._isRotating = false;
        this.rotatingCount = 0;

    }

    /** 隣接するパーツへの参照を追加 */
    appendNeighbor(direction: Direction, neighbor: ChainPart): void {

        this.neighbors.set(direction, neighbor);

    }

    /** 回転開始 */
    rotate(): void {

        if (this._isRotating) {
            return;
        }
        this._isRotating = true;
        this.rotatingCount = 0;

    }

    /** 隣接する要素を回転させる */
    private rotateNeighbors(): void {

        this.neighbors.forEach((part, direction) => {
            if (
                (
                    direction === 'top' &&
                    (part._rotation === 1 || part._rotation === 2) &&
                    (this._rotation === 0 || this._rotation === 3)
                ) ||
                (
                    direction === 'right' &&
                    (part._rotation === 2 || part._rotation === 3) &&
                    (this._rotation === 0 || this._rotation === 1)
                ) ||
                (
                    direction === 'bottom' &&
                    (part._rotation === 0 || part._rotation === 3) &&
                    (this._rotation === 1 || this._rotation === 2)
                ) ||
                (
                    direction === 'left' &&
                    (part._rotation === 0 || part._rotation === 1) &&
                    (this._rotation === 2 || this._rotation === 3)
                )
            ) {
                part.rotate();
            }
        });

    }

    /** フレーム毎の更新 */
    update(): void {

        if (this._isRotating) {
            this.angle = (this.angle + Math.PI / 20) % (Math.PI * 2);
            if (++this.rotatingCount == 10) {
                this._isRotating = false;
                this._rotation = (this._rotation + 1) % 4 as RotateStatus;
                this._hasRotated = true;
            }
        }

    }

    /** 回転完了時の隣接要素の更新 */
    updateNeighbors(): void {
        if (this._hasRotated) {
            this.rotateNeighbors();
            this._hasRotated = false;
        }
    }

    /** 画面描画 */
    draw(ctx: CanvasRenderingContext2D): void {

        const harfSize = PART_SIZE / 2;
        ctx.save();
        ctx.fillStyle = '#ddd';
        ctx.strokeStyle = 
            this._rotation === 0 ? 'blue' :
            this._rotation === 1 ? 'red' :
            this._rotation === 2 ? 'green' :
            'orange';
        ctx.lineWidth = 2;
        ctx.translate(this.x + harfSize, this.y + harfSize);
        ctx.rotate(this.angle);
        if (this.isRotating) {
            ctx.beginPath();
            ctx.arc(0, 0, harfSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(0, -harfSize);
        ctx.lineTo(0, 0);
        ctx.lineTo(harfSize, 0);
        ctx.stroke();
        ctx.restore();

    }

}
