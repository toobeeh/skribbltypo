(() => {
    const chatInput = document.querySelector('#inputChat');
    
    document.addEventListener('keydown', e => {
        if (document.activeElement.tagName !== 'INPUT') {
            if (e.key === 'z' && e.ctrlKey) {
                e.preventDefault();
                captureCanvas.restoreDrawing(1);
                return;
            }
            if (e.key === 'Shift' && !(e.altKey || e.ctrlKey)) {
                e.preventDefault();
                chatInput.focus();
                return;
            }
        }
    });
})();
