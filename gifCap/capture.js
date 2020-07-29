
let capturedActions;
let filename;

self.addEventListener('message', function (e) {
    let data = e.data;
    capturedActions = data.capturedActions;
    filename = data.filename;
    console.log(capturedActions);
    console.log(filename);
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

        // perform commands on canvas and take frames 
        for (let action = lastClear, actionsLength = capturedActions.length; action < actionsLength; action++) {
            for (let command = 0, length = capturedActions[action].length; command < length; command++) {
                if (capturedActions[action][command]) {
                    canvasPainter.performDrawCommand(capturedActions[action][command]);
                    //console.log(command);
                    if (command % 50 == 0) {
                        encoder.addFrame(canvasContext);
                    }
                }
            }
        }

        encoder.setDelay(500);
        // add end result
        encoder.addFrame(canvasContext);

        encoder.finish();
        self.postMessage(encoder.download(filename + ".gif"));
    }, 1000);
}