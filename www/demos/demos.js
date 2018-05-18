var initId = 0;
var world = createWorld();
var ctx = null;
var currBuffer = 0;

var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

function setupWorld(did) {
    if (!did) did = 0;
    world = createWorld();
    initId += did;
    initId %= demos.InitWorlds.length;
    if (initId < 0) initId = demos.InitWorlds.length + initId;
    demos.InitWorlds[initId](world);
}

function setupNextWorld() {
    setupWorld(1);
}

function setupPrevWorld() {
    setupWorld(-1);
}

var frames = 0;
var lastTime = (new Date()).getTime();
var lastFrameTime = (new Date()).getTime();
var stepSize = 1;
var delayAvg = 0;
var maxStepSize = 40;
var missedFrames = 11;
var targetFPS = 30;
var timeStep = 1.0 / targetFPS;
var lastDelay = timeStep * 1000;

function step() {

    world.Step(timeStep, Math.round(stepSize));

    if ((delayAvg > 0) || (missedFrames > 5)) {
        drawWorld(world, ctx);
        missedFrames = 0;
        frames += 1;
        if ((targetFPS < 30) && (delayAvg > 10)) {
            targetFPS++;
            timeStep = 1 / targetFPS;
        }
    } else {
        missedFrames += 1;
        if (missedFrames > 3) {
            targetFPS--;
            targetFPS = (targetFPS < 25) ? 25 : targetFPS;
            timeStep = 1 / targetFPS;
        }
    }

    // double buffered svg : switch the buffers here
    // ctx.svg.change(ctx.buffers[currBuffer], {'visiblity': 'visible'});
    // currBuffer++;
    // currBuffer %= 2;
    // ctx.svg.change(ctx.buffers[currBuffer], {'visiblity': 'hidden'});


    var currTime = (new Date()).getTime();
    if ((currTime - lastTime) >= 1000) {
        jQuery('#fpsText').text(world.m_bodyCount + " bodies. " + frames);
        jQuery('#stepSize').text(stepSize.toFixed(1));

        lastTime = currTime;

        if (frames > (targetFPS + 2)) {
            stepSize += 0.1;
            stepSize = (stepSize > maxStepSize) ? maxStepSize : stepSize;
        } else if (frames < (targetFPS - 2)) {
            if ((targetFPS - frames) > 5) {
                stepSize -= 2;
            } else {
                stepSize -= 0.1;
            }
            stepSize = (stepSize < 1) ? 1 : stepSize;
        }

        jQuery('#delayVal').text((delayAvg / frames).toFixed(1));
        frames = 0;
        delayAvg = 0.001;
    }
    var delay = (stepSize * timeStep * 1000) - (currTime - lastFrameTime);
    delay = (delay + lastDelay) / 2;
    lastDelay = delay;

    delayAvg += delay;
    lastFrameTime = currTime;

    setTimeout(step, (delay > 0) ? delay : 0);
}

/*
function initBuffers(svgContext) {
  ctx.buffers[0] = svgContext.group('buffer1');
  // ctx.buffers[1] = svgContext.group('buffer2', {'visibility':'hidden'});
}
*/

function disableSelection(target) {
    if (typeof target.onselectstart != "undefined") //IE route
        target.onselectstart = function () {
            return false
        };

    else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
        target.style.MozUserSelect = "none";

    else //All other route (ie: Opera)
        target.onmousedown = function () {
            return false
        };
}

function handleResize() {
    var canvasElm = jQuery('#canvas');
    canvasWidth = parseInt(canvasElm.width());
    canvasHeight = parseInt(canvasElm.height());
    canvasTop = parseInt(canvasElm.offset().top);
    canvasLeft = parseInt(canvasElm.offset().left);
    let elem = jQuery("#canvas");
    let svgwcoeff = Math.round(document.documentElement.clientWidth / 640 * 1000) / 1000;
    let svghcoeff = Math.round(document.documentElement.clientHeight / 400 * 1000) / 1000;
    jQuery("body").width(document.documentElement.clientWidth);
    jQuery("body").height(document.documentElement.clientHeight);
    elem.css({
        "transform": "scale(" + (svgwcoeff < svghcoeff ? svgwcoeff : svghcoeff) + ")"
    });
    let realwidth = Math.round(elem[0].getBoundingClientRect().width * 1000) / 1000;
    let realheight = Math.round(elem[0].getBoundingClientRect().height * 1000) / 1000;
    elem.offset({
        "left": (document.documentElement.clientWidth - realwidth) / 2
    });
    elem.offset({
        "top": 0
    });
}