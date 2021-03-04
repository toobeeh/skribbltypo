(() => {
    document.addEventListener('keydown', e => {
        if (document.activeElement.tagName !== 'INPUT') {
            if (e.key === 'z' && e.ctrlKey) {
                captureCanvas.restoreDrawing(1);
            }
        }
    });
})();
