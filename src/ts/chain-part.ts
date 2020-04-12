/** パーツごとの大きさ */
export const PART_SIZE = 10;

/** 隣接する要素の方向 */
type Direction = 'top' | 'right' | 'bottom' | 'left';

/** 回転の状態 */
type RotateStatus = 0 | 1 | 2 | 3;


/** 個々のパーツクラス */
export class ChainPart {

    /** 描画時の傾き */
    private angle: number;

    /** 回転状態 */
    private rotation: RotateStatus;

    /** 回転のステップ数 */
    private rotatingCount: number;

    /** 回転しているかどうかの状態 */
    private _isRotating = false;

    /** 回転しているかどうかの状態、公開用 */
    get isRotating(): boolean {
        return this._isRotating;
    }

    /** 隣接するパーツへの参照 */
    private neighbors = new Map<Direction, ChainPart>();


    /** 音声コンテキスト */
    static audioCtx: AudioContext;

    /** 音量調整用のゲインノード */
    static gainNode: GainNode;


    constructor(
        private x: number,
        private y: number
    ) {
        this.init();
    }


    /** 回転状態の初期化 */
    init(): void {

        this.rotation = Math.floor(Math.random() * 4) as RotateStatus;
        this.angle = Math.PI / 2 * this.rotation;
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
        this.playSound();

    }

    /** 回転時の効果音を鳴らす */
    private playSound(): void {

        const osc = new OscillatorNode(ChainPart.audioCtx);
        osc.type = 'sine';
        osc.frequency.value = 300 + this.rotation * 100;
        osc.connect(ChainPart.gainNode);
        osc.start();
        setTimeout(() => osc.stop(), 100);

    }

    /** 隣接する要素を回転させる */
    private rotateNeighbors(): void {

        this.neighbors.forEach((part, direction) => {
            if (
                (
                    direction === 'top' &&
                    (part.rotation === 1 || part.rotation === 2) &&
                    (this.rotation === 0 || this.rotation === 3)
                ) ||
                (
                    direction === 'right' &&
                    (part.rotation === 2 || part.rotation === 3) &&
                    (this.rotation === 0 || this.rotation === 1)
                ) ||
                (
                    direction === 'bottom' &&
                    (part.rotation === 0 || part.rotation === 3) &&
                    (this.rotation === 1 || this.rotation === 2)
                ) ||
                (
                    direction === 'left' &&
                    (part.rotation === 0 || part.rotation === 1) &&
                    (this.rotation === 2 || this.rotation === 3)
                )
            ) {
                part.rotate();
                if (direction === 'top' || direction === 'left') {
                    part.update();
                }
            }
        });

    }

    /** フレーム毎の更新 */
    update(): void {

        if (this._isRotating) {
            this.angle = (this.angle + Math.PI / 20) % (Math.PI * 2);
            if (++this.rotatingCount == 10) {
                this._isRotating = false;
                this.rotation = (this.rotation + 1) % 4 as RotateStatus;
                this.rotateNeighbors();
            }
        }

    }

    /** 画面描画 */
    draw(ctx: CanvasRenderingContext2D): void {

        const harfSize = PART_SIZE / 2;
        ctx.save();
        ctx.fillStyle = '#ddd';
        ctx.strokeStyle = 
            this.rotation === 0 ? 'blue' :
            this.rotation === 1 ? 'red' :
            this.rotation === 2 ? 'green' :
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

/** パーツクラスのスタティックメンバの初期化 */
{

    ChainPart.audioCtx = new AudioContext();
    ChainPart.gainNode = ChainPart.audioCtx.createGain();
    ChainPart.gainNode.gain.value = 0.01;
    ChainPart.gainNode.connect(ChainPart.audioCtx.destination);

}

