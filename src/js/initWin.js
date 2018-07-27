// JavaScript Document<script type="text/javascript">
var gl;

let WX_GAME_ENV = typeof wx !== 'undefined';
window.WX_GAME_ENV = WX_GAME_ENV;

var canvas,docWidth,docHeight;

function initWin(w,h){

  // (w) ? docWidth = w : docWidth = $(window).width();
  // (h) ? docHeight = h : docHeight = $(window).height();
  // $("#webgl-canvas").width(docWidth);
  // $("#webgl-canvas").height(docHeight);    
  // canvas.width = docWidth;
  // canvas.height = docHeight;  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  try {
    gl = canvas.getContext( "experimental-webgl" ) ;
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    window.gl = gl;    
  } catch(e) {
    console.log("gl failed");
  }
  if (!gl) {
    alert("Your browser failed to initialize WebGL.");
  }
}

//cjh $(window).resize(function() {
//   initWin();
// });

window.webGLStart = function webGLStart() {
  if (WX_GAME_ENV) {
    if (window != null && window.canvas != null) {
      canvas = window.canvas;
    }
    else {
      canvas = wx.createCanvas();
    }
  } else {
    canvas = document.getElementById("canvas");
  }
  
  initWin();
  initBuffers();
  initShaders();
  initTextures();

  setDebugParam();
  
  gl.clearColor(0., 0., 0., 0.);
  gl.clearDepth(1.);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  interact(canvas);
  animate();

  if (window.jsb) {
    jsb.setDebugViewText(1, "点击屏幕左下方减少水母, 点击屏幕右下方增加水母");
    jsb.setDebugViewText(2, "拖动可切换查看角度");
    jsb.setDebugViewText(0, "水母数: " + Param.jCount);
    // console.log('window.innerWidth: ' + window.innerWidth + ", window.innerHeight:" + window.innerHeight);
    document.addEventListener('touchend', (event)=>{
      var x = event.touches[0].clientX;
      var y = event.touches[0].clientY;
      // console.log('touch: x:' + x + ", y:" + y);
      if (y > window.innerHeight - 200) {
        if (x < window.innerWidth / 2) {
          Param.jCount -= 5;
          if (Param.jCount < 0)
            Param.jCount = 0;
        }
        else {
          Param.jCount += 5;
        }
        jsb.setDebugViewText(0, "水母数: " + Param.jCount);
      }
    });
  }
  else {
    canvas.addEventListener('touchend', function (event) {
      var x = event.touches[0].clientX;
      var y = event.touches[0].clientY;
      if(y > window.innerHeight - 200) {
        if (x < window.innerWidth / 2) {
          Param.jCount -= 5;
          if (Param.jCount < 0)
            Param.jCount = 0;
        }
        else {
          Param.jCount += 5;
        }
        console.log("水母数: " + Param.jCount);
      }
    });
  }
}