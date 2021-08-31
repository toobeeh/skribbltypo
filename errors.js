let errors = "";

// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

document.addEventListener('keydown', async (event) => {
	if (event.ctrlKey && event.key === 'b') {
        let message = JSON.stringify({
            username: "Typo Bugtracer",
            avatar_url:
                'https://tobeh.host/Orthanc/images/letterred.png',
            embeds: [
                {
                    "title": "Error Report",
                    "description": (errors == "" ? "No errors caught." : errors)
                }
            ]
        });
        // send webhook
        await fetch("https://discord.com/api/webhooks/880181730231861309/ate4BsIJtkpAeFQwWt1qpMzVWtYJkcMWFUShDHhw2o7DlNw5x-7hCKn3Mu0sAadgi3vy", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: message
        });
        alert('Error report was sent.');
    }   
});