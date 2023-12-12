
let capturedCommands;
let filename;
let resolution;
let frames = 0;
let msg = {};
const frameDelayMs = 50;

self.addEventListener('message', function (e) {
    let data = e.data;
    capturedCommands = data.capturedCommands;
    filename = data.filename;
    let length = data.gifLength;
    frames = (length * 1000 / frameDelayMs);
    resolution = Math.round(capturedCommands.length / frames);
    capture();
}, false);

async function capture() {
    await setTimeout(() => {
        console.log("Started rendering");
        let canvasDummy = new OffscreenCanvas(800, 600);
        let canvasContext = canvasDummy.getContext("2d");

        //create command-able skribbl canvas
        let canvasPainter = new Z([canvasDummy]);
        let encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(frameDelayMs);
        encoder.start();

        // perform commands on canvas and take frames 
        for (let command = 0; command < capturedCommands.length; command++) {
            if (capturedCommands[command]) {
                canvasPainter.performDrawCommand(capturedCommands[command]);

                // take every n steps and put to gif
                if (command % resolution == 0) {
                    encoder.setDelay(frameDelayMs);
                    encoder.addFrame(canvasContext);
                    msg.progress = command / capturedCommands.length;
                    self.postMessage(msg);
                }
            }
        }

        // add end result
        encoder.setDelay(500);
        encoder.addFrame(canvasContext);

        encoder.finish();
        msg.download = encoder.download(filename + ".gif");
        self.postMessage(msg);
    }, 1000);
}