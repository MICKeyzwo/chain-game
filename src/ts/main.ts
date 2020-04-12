import { ChainGame } from './chain-game';

function main() {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const game = new ChainGame(canvas);
    game.start();

    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', game.reset.bind(game));

}

main();
