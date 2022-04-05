window.addEventListener("load", function () {
  var timestamp = null;
  var lastMouseX = null;
  var lastMouseY = null;
  var speedX = 0;
  var speedY = 0;
  var v = { x: speedX, y: speedY };
  var hitDot = false;

  document.body.addEventListener("mousemove", function (e) {
    if (timestamp === null) {
      timestamp = Date.now();
      lastMouseX = e.screenX;
      lastMouseY = e.screenY;
      return;
    }

    var now = Date.now();
    var dt = now - timestamp;
    var dx = e.screenX - lastMouseX;
    var dy = e.screenY - lastMouseY;
    if (!hitDot) {
      speedX = (dx / dt) * 1;
      speedY = (dy / dt) * 5;
      v = { x: speedX, y: speedY };
    }

    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
  });

  var dot = document.querySelector(".dot");

  var pageBounds = document.querySelector(".home").getBoundingClientRect();
  var dotLoc = dot.getBoundingClientRect();

  var xOffset = dotLoc.right - 8; // 10
  var yOffset = dotLoc.bottom - 21.5; // 21.5
  var xBound = pageBounds.right;
  var yBound = pageBounds.height;

  var pos = { x: 0, y: 0 };
  var g = 0.3; // some gravity
  var absorption = 0.7; // absorption
  var bottom = yBound - yOffset - 19; // floor collision
  var right = xBound - xOffset - 10;
  var left = -xOffset;
  var frames = 0;
  var vyTolerance = 0.5;
  var pyTolerance = 3;
  var vxTolerance = 0.01;
  var friction = 0.95;
  var fontSz = dot.style.fontSize;
  var growth = 1;
  var hasTouchedBottom = false;

  document.querySelector(".dotHidden").addEventListener("mouseover", loop);
  // animate
  function loop(e) {
    if (v.x == 0 && v.y == 0) return;
    calc();

    // if done moving, stop animating motion
    if (v.x == 0 && v.y == 0) return;
    move(dot, pos);
    style = window.getComputedStyle(dot, null).getPropertyValue("width");
    currentSize = parseFloat(style);
    if (!hasTouchedBottom) {
      increaseSize(dot);
    }
    hitDot = true;
    document.querySelector(".dotHidden").style.display = "none";
    requestAnimationFrame(loop);
  }

  // main calculation of the animation using a particle and a vector
  function calc() {
    // alert(speedX + " " + speedY);
    pos.x += v.x; // update position with vector
    pos.y += v.y;
    v.y += g; // update vector with gravity
    if (pos.y > bottom) {
      // hit da floor, bounce
      hasTouchedBottom = true;
      pos.y = bottom; // force position = max bottom
      v.y = -v.y * absorption; // reduce power with absorption
    }
    if (Math.abs(v.y) < vyTolerance && pos.y > 300) {
      v.x *= friction;
      if (Math.abs(v.x) < vxTolerance) {
        v.x = 0;
      }
    }
    if (Math.abs(v.y) < vyTolerance && Math.abs(bottom - pos.y) < pyTolerance) {
      v.y = 0;
    }
    if (pos.x < left || pos.x > right) v.x = -v.x;
  }

  function move(el, p) {
    el.style.transform = el.style.webkitTransform =
      "translate(" + p.x + "px," + p.y + "px)";
  }

  var width = 0;
  var height = 0;

  function increaseSize(el) {
    txt = document.querySelector(".dot");
    style = window.getComputedStyle(txt, null).getPropertyValue("width");
    currentSize = parseFloat(style);
    txt.style.width = currentSize + 1 + "px";
    width = currentSize + 1;

    style = window.getComputedStyle(txt, null).getPropertyValue("height");
    currentSize = parseFloat(style);
    txt.style.height = currentSize + 1 + "px";
    height = currentSize + 1;

    style = window
      .getComputedStyle(txt, null)
      .getPropertyValue("border-radius");
    currentSize = parseFloat(style);
    txt.style.borderRadius = currentSize + 1 + "px";
  }

  const dragDot = document.querySelector(".dot");
  // txt = document.querySelector(".dot");
  // style = window.getComputedStyle(txt, null).getPropertyValue("width");
  // width = parseFloat(style) * 10;

  // txt = document.querySelector(".dot");
  // style = window.getComputedStyle(txt, null).getPropertyValue("height");
  // height = parseFloat(style) * 10;
  var x;
  var y;

  const drag = (ev) => {
    // if you have a circle inscribed inside square, corner is the distance from the corner
    // of the square to the edge of the triangle
    corner = 0.5 * (width * Math.SQRT2 - width);

    //dragDot.style.left = ev.pageX - x - width + "px";
    // dragDot.style.left = 0 + "px";
    // dragDot.style.top = 0 + "px";
    //dragDot.style.top = ev.pageY - y - height + "px";
  };

  dragDot.addEventListener("mousedown", (e) => {
    // if you grab the dot mid air, then it stops moving
    v.x = 0;
    v.y = 0;

    // this.window.alert("circle right offset: " + dragDot.style.right);
    // this.window.alert("circle bottom offset: " + dragDot.style.bottom);

    this.window.alert(pos.x);
    this.window.alert(e.pageX);

    dragDot.style.left = 0 + "px";
    dragDot.style.top = 0 + "px";

    x = e.pageX;
    y = e.pageY;
    window.addEventListener("mousemove", drag);
  });

  dragDot.addEventListener("mouseup", loop, (e) => {
    window.removeEventListener("mousemove");
  });

  navSlide();
});
