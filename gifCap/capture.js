
let capturedActions;
let filename;
let colors = [];
let resolution;
let hits = 0;
let msg = {};
const frames = 200;

self.addEventListener('message', function (e) {
    let data = e.data;
    capturedActions = data.capturedActions;
    filename = data.filename;
    console.log(data.palettes);
    JSON.parse(data.palettes).forEach(p => {
        p.colors.forEach(c => colors.push(c));
    });
    // add skribbl standard colors to palette colors
    colors = colors.concat(JSON.parse('[{"index":0,"color":"rgb(255, 255, 255)"},{"index":2,"color":"rgb(193, 193, 193)"},{"index":4,"color":"rgb(239, 19, 11)"},{"index":6,"color":"rgb(255, 113, 0)"},{"index":8,"color":"rgb(255, 228, 0)"},{"index":10,"color":"rgb(0, 204, 0)"},{"index":12,"color":"rgb(0, 178, 255)"},{"index":14,"color":"rgb(35, 31, 211)"},{"index":16,"color":"rgb(163, 0, 186)"},{"index":18,"color":"rgb(211, 124, 170)"},{"index":20,"color":"rgb(160, 82, 45)"},{"index":1,"color":"rgb(0, 0, 0)"},{"index":3,"color":"rgb(76, 76, 76)"},{"index":5,"color":"rgb(116, 11, 7)"},{"index":7,"color":"rgb(194, 56, 0)"},{"index":9,"color":"rgb(232, 162, 0)"},{"index":11,"color":"rgb(0, 85, 16)"},{"index":13,"color":"rgb(0, 86, 158)"},{"index":15,"color":"rgb(14, 8, 101)"},{"index":17,"color":"rgb(85, 0, 105)"},{"index":19,"color":"rgb(167, 85, 116)"},{"index":21,"color":"rgb(99, 48, 13)"}]'));
    console.log(capturedActions);
    console.log(filename);
    capturedActions.forEach((a) => hits += a.length);
    console.log(hits);
    //calc resolution for 4s duration and 0.5 ms delay between frames ()
    resolution = Math.round(hits / frames);
    console.log(resolution);
    capture();
}, false);

async function capture() {
    console.log("Started timeout");
    await setTimeout(() => {
        console.log("Started rendering");
        let canvasDummy = new OffscreenCanvas(800,600);
        let canvasContext = canvasDummy.getContext("2d");
        //create command-able skribbl canvas
        let canvasPainter = new Z([canvasDummy]);
        let encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(0.5);
        encoder.start();

        let lastClear = capturedActions.length-1;
        while (capturedActions[lastClear][0] != 3 && lastClear > 0) lastClear--;

        let commandHits = 0;

        // perform commands on canvas and take frames 
        for (let action = lastClear, actionsLength = capturedActions.length; action < actionsLength; action++) {
            for (let command = 0, length = capturedActions[action].length; command < length; command++) {
                if (capturedActions[action][command]) {
                    canvasPainter.performDrawCommand(capturedActions[action][command]);
                    commandHits++;
                    //console.log(command);
                    if (commandHits % resolution == 0) {
                        encoder.addFrame(canvasContext);
                        msg.progress = commandHits / hits;
                        self.postMessage(msg);
                    }
                }
            }
        }

        encoder.setDelay(500);
        // add end result
        encoder.addFrame(canvasContext);

        encoder.finish();
        msg.download = encoder.download(filename + ".gif");
        self.postMessage(msg);
    }, 1000);
}