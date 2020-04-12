// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ts/chain-part.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** パーツごとの大きさ */

exports.PART_SIZE = 10;
/** 個々のパーツクラス */

var ChainPart =
/** @class */
function () {
  function ChainPart(x, y) {
    this.x = x;
    this.y = y;
    /** 回転しているかどうかの状態 */

    this._isRotating = false;
    /** 隣接するパーツへの参照 */

    this.neighbors = new Map();
    /** 回転完了状態のフラグ */

    this.hasRotated = false;
    this.init();
  }

  Object.defineProperty(ChainPart.prototype, "isRotating", {
    /** 回転しているかどうかの状態、公開用 */
    get: function get() {
      return this._isRotating;
    },
    enumerable: true,
    configurable: true
  });
  /** 回転状態の初期化 */

  ChainPart.prototype.init = function () {
    this.rotation = Math.floor(Math.random() * 4);
    this.angle = Math.PI / 2 * this.rotation;
    this._isRotating = false;
    this.rotatingCount = 0;
  };
  /** 隣接するパーツへの参照を追加 */


  ChainPart.prototype.appendNeighbor = function (direction, neighbor) {
    this.neighbors.set(direction, neighbor);
  };
  /** 回転開始 */


  ChainPart.prototype.rotate = function () {
    if (this._isRotating) {
      return;
    }

    this._isRotating = true;
    this.rotatingCount = 0;
    this.playSound();
  };
  /** 回転時の効果音を鳴らす */


  ChainPart.prototype.playSound = function () {
    var osc = new OscillatorNode(ChainPart.audioCtx);
    osc.type = 'sine';
    osc.frequency.value = 300 + this.rotation * 100;
    osc.connect(ChainPart.gainNode);
    osc.start();
    setTimeout(function () {
      return osc.stop();
    }, 100);
  };
  /** 隣接する要素を回転させる */


  ChainPart.prototype.rotateNeighbors = function () {
    var _this = this;

    this.neighbors.forEach(function (part, direction) {
      if (direction === 'top' && (part.rotation === 1 || part.rotation === 2) && (_this.rotation === 0 || _this.rotation === 3) || direction === 'right' && (part.rotation === 2 || part.rotation === 3) && (_this.rotation === 0 || _this.rotation === 1) || direction === 'bottom' && (part.rotation === 0 || part.rotation === 3) && (_this.rotation === 1 || _this.rotation === 2) || direction === 'left' && (part.rotation === 0 || part.rotation === 1) && (_this.rotation === 2 || _this.rotation === 3)) {
        part.rotate();
      }
    });
  };
  /** フレーム毎の更新 */


  ChainPart.prototype.update = function () {
    if (this._isRotating) {
      this.angle = (this.angle + Math.PI / 20) % (Math.PI * 2);

      if (++this.rotatingCount == 10) {
        this._isRotating = false;
        this.rotation = (this.rotation + 1) % 4;
        this.hasRotated = true;
      }
    }
  };
  /** 回転完了時の隣接要素の更新 */


  ChainPart.prototype.updateNeighbors = function () {
    if (this.hasRotated) {
      this.rotateNeighbors();
      this.hasRotated = false;
    }
  };
  /** 画面描画 */


  ChainPart.prototype.draw = function (ctx) {
    var harfSize = exports.PART_SIZE / 2;
    ctx.save();
    ctx.fillStyle = '#ddd';
    ctx.strokeStyle = this.rotation === 0 ? 'blue' : this.rotation === 1 ? 'red' : this.rotation === 2 ? 'green' : 'orange';
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
  };

  return ChainPart;
}();

exports.ChainPart = ChainPart;
/** パーツクラスのスタティックメンバの初期化 */

{
  ChainPart.audioCtx = new AudioContext();
  ChainPart.gainNode = ChainPart.audioCtx.createGain();
  ChainPart.gainNode.gain.value = 0.008;
  ChainPart.gainNode.connect(ChainPart.audioCtx.destination);
}
},{}],"ts/chain-game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var chain_part_1 = require("./chain-part");
/** 1辺あたりのパーツの数 */


var PART_COUNT = 50;
/** キャンバスのサイズ */

var CANVAS_SIZE = chain_part_1.PART_SIZE * PART_COUNT;
/** チェインゲームの本体クラス */

var ChainGame =
/** @class */
function () {
  function ChainGame(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvasRect = canvas.getBoundingClientRect();
    this.bufferCanvas = document.createElement('canvas');
    this.bufferContext = this.bufferCanvas.getContext('2d');
  }
  /** ゲームの開始 */


  ChainGame.prototype.start = function () {
    this.canvas.width = this.canvas.height = CANVAS_SIZE;
    this.bufferCanvas.width = this.bufferCanvas.height = CANVAS_SIZE;
    this.canvas.addEventListener('mousedown', this.onClick.bind(this));
    this.parts = Array.from(Array(PART_COUNT), function (_, y) {
      return Array.from(Array(PART_COUNT), function (_, x) {
        return new chain_part_1.ChainPart(x * chain_part_1.PART_SIZE, y * chain_part_1.PART_SIZE);
      });
    });

    for (var y = 0; y < PART_COUNT; y++) {
      for (var x = 0; x < PART_COUNT; x++) {
        var part = this.parts[y][x];

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
    } // TODO: requestAnimationFrameを使うよりも早い？ 要検証


    this.timer = setInterval(this.update.bind(this), 1000 / 60);
    console.log('chain game started!');
  };
  /** ゲームのリセット */


  ChainGame.prototype.reset = function () {
    for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
      var parts = _a[_i];

      for (var _b = 0, parts_1 = parts; _b < parts_1.length; _b++) {
        var part = parts_1[_b];
        part.init();
      }
    }

    this.draw();
  };
  /** ゲームの終了 */


  ChainGame.prototype.end = function () {
    clearInterval(this.timer);
  };
  /** フレーム毎の更新 */


  ChainGame.prototype.update = function () {
    for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
      var parts = _a[_i];

      for (var _b = 0, parts_2 = parts; _b < parts_2.length; _b++) {
        var part = parts_2[_b];
        part.update();
      }
    }

    for (var _c = 0, _d = this.parts; _c < _d.length; _c++) {
      var parts = _d[_c];

      for (var _e = 0, parts_3 = parts; _e < parts_3.length; _e++) {
        var part = parts_3[_e];
        part.updateNeighbors();
      }
    }

    this.draw();
  };
  /** 画面描画 */


  ChainGame.prototype.draw = function () {
    this.context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    this.bufferContext.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
      var parts = _a[_i];

      for (var _b = 0, parts_4 = parts; _b < parts_4.length; _b++) {
        var part = parts_4[_b];
        part.draw(this.bufferContext);
      }
    }

    this.context.drawImage(this.bufferCanvas, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };
  /** キャンバスクリック時のイベントハンドラ */


  ChainGame.prototype.onClick = function (e) {
    var x = Math.floor((e.clientX - this.canvasRect.x) / chain_part_1.PART_SIZE);
    var y = Math.floor((e.clientY - this.canvasRect.y) / chain_part_1.PART_SIZE);
    this.parts[y][x].rotate();
  };

  return ChainGame;
}();

exports.ChainGame = ChainGame;
},{"./chain-part":"ts/chain-part.ts"}],"ts/main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var chain_game_1 = require("./chain-game");

function main() {
  var canvas = document.getElementById('canvas');
  var game = new chain_game_1.ChainGame(canvas);
  game.start();
  var resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', game.reset.bind(game));
}

main();
},{"./chain-game":"ts/chain-game.ts"}],"C:/Users/singi/scoop/persist/nvm/nodejs/v12.12.0/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59081" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/singi/scoop/persist/nvm/nodejs/v12.12.0/node_modules/parcel/src/builtins/hmr-runtime.js","ts/main.ts"], null)
//# sourceMappingURL=/main.0e24b174.js.map