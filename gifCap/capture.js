
let capturedActions;
let filename;
let resolution;
let hits = 0;
let msg = {};
const frames = 30;

self.addEventListener('message', function (e) {
    let data = e.data;
    capturedActions = data.capturedActions;
    filename = data.filename;
    console.log(capturedActions);
    console.log(filename);
    capturedActions.forEach((a) => hits += a.length);
    console.log(hits);
    //calc resolution for 2s duration and 0.5 ms delay between frames ()
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