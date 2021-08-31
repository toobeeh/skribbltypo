
let capturedCommands;
let filename;
let resolution;
let hits = 0;
let msg = {};
const frames = 60;

self.addEventListener('message', function (e) {
    let data = e.data;
    capturedCommands = data.capturedCommands;
    filename = data.filename;
    capturedCommands.forEach((a) => hits += a.length);
    //calc resolution for 4s duration and 0.5 ms delay between frames ()
    resolution = Math.round(hits / frames);
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
        let commandHits = 0;
        // perform commands on canvas and take frames 
        for (let command = 0, length = capturedCommands.length; command < length; command++) {
            if (capturedCommands[command]) {
                canvasPainter.performDrawCommand(capturedCommands[command]);
                commandHits++;
                if (commandHits % resolution == 0) {
                    encoder.addFrame(canvasContext);
                    msg.progress = commandHits / hits;
                    self.postMessage(msg);
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