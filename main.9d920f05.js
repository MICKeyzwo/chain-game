parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"SjuR":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PART_SIZE=10;var t=function(){function t(t,o){this.x=t,this.y=o,this._isRotating=!1,this.neighbors=new Map,this.init()}return Object.defineProperty(t.prototype,"isRotating",{get:function(){return this._isRotating},enumerable:!0,configurable:!0}),t.prototype.init=function(){this.rotation=Math.floor(4*Math.random()),this.angle=Math.PI/2*this.rotation,this._isRotating=!1,this.rotatingCount=0},t.prototype.appendNeighbor=function(t,o){this.neighbors.set(t,o)},t.prototype.rotate=function(){this._isRotating||(this._isRotating=!0,this.rotatingCount=0,this.playSound())},t.prototype.playSound=function(){var o=new OscillatorNode(t.audioCtx);o.type="sine",o.frequency.value=300+100*this.rotation,o.connect(t.gainNode),o.start(),setTimeout(function(){return o.stop()},100)},t.prototype.rotateNeighbors=function(){var t=this;this.neighbors.forEach(function(o,i){("top"!==i||1!==o.rotation&&2!==o.rotation||0!==t.rotation&&3!==t.rotation)&&("right"!==i||2!==o.rotation&&3!==o.rotation||0!==t.rotation&&1!==t.rotation)&&("bottom"!==i||0!==o.rotation&&3!==o.rotation||1!==t.rotation&&2!==t.rotation)&&("left"!==i||0!==o.rotation&&1!==o.rotation||2!==t.rotation&&3!==t.rotation)||(o.rotate(),"top"!==i&&"left"!==i||o.update())})},t.prototype.update=function(){this._isRotating&&(this.angle=(this.angle+Math.PI/20)%(2*Math.PI),10==++this.rotatingCount&&(this._isRotating=!1,this.rotation=(this.rotation+1)%4,this.rotateNeighbors()))},t.prototype.draw=function(t){var o=exports.PART_SIZE/2;t.save(),t.fillStyle="#ddd",t.strokeStyle=0===this.rotation?"blue":1===this.rotation?"red":2===this.rotation?"green":"orange",t.lineWidth=2,t.translate(this.x+o,this.y+o),t.rotate(this.angle),this.isRotating&&(t.beginPath(),t.arc(0,0,o,0,2*Math.PI),t.fill()),t.beginPath(),t.moveTo(0,-o),t.lineTo(0,0),t.lineTo(o,0),t.stroke(),t.restore()},t}();exports.ChainPart=t,t.audioCtx=new AudioContext,t.gainNode=t.audioCtx.createGain(),t.gainNode.gain.value=.01,t.gainNode.connect(t.audioCtx.destination);
},{}],"KTFm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./chain-part"),r=50,e=t.PART_SIZE*r,a=function(){function a(t){this.canvas=t,this.context=t.getContext("2d"),this.canvasRect=t.getBoundingClientRect()}return a.prototype.start=function(){this.canvas.width=this.canvas.height=e,this.canvas.addEventListener("mousedown",this.onClick.bind(this)),this.parts=Array.from(Array(r),function(e,a){return Array.from(Array(r),function(r,e){return new t.ChainPart(e*t.PART_SIZE,a*t.PART_SIZE)})});for(var a=0;a<r;a++)for(var n=0;n<r;n++){var i=this.parts[a][n];a>0&&i.appendNeighbor("top",this.parts[a-1][n]),n<r-1&&i.appendNeighbor("right",this.parts[a][n+1]),a<r-1&&i.appendNeighbor("bottom",this.parts[a+1][n]),n>0&&i.appendNeighbor("left",this.parts[a][n-1])}this.timer=setInterval(this.update.bind(this),1e3/33),console.log("chain game started!")},a.prototype.reset=function(){for(var t=0,r=this.parts;t<r.length;t++)for(var e=0,a=r[t];e<a.length;e++){a[e].init()}this.draw()},a.prototype.end=function(){clearInterval(this.timer)},a.prototype.update=function(){for(var t=0,r=this.parts;t<r.length;t++)for(var e=0,a=r[t];e<a.length;e++){a[e].update()}this.draw()},a.prototype.draw=function(){this.context.clearRect(0,0,e,e);for(var t=0,r=this.parts;t<r.length;t++)for(var a=0,n=r[t];a<n.length;a++){n[a].draw(this.context)}},a.prototype.onClick=function(r){var e=Math.floor((r.clientX-this.canvasRect.x)/t.PART_SIZE),a=Math.floor((r.clientY-this.canvasRect.y)/t.PART_SIZE);this.parts[a][e].rotate()},a}();exports.ChainGame=a;
},{"./chain-part":"SjuR"}],"g7hl":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./chain-game");function t(){var t=document.getElementById("canvas"),n=new e.ChainGame(t);n.start(),document.getElementById("reset").addEventListener("click",n.reset.bind(n))}t();
},{"./chain-game":"KTFm"}]},{},["g7hl"], null)
//# sourceMappingURL=/main.9d920f05.js.map