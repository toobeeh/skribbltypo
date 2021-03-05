(() => {
    'use strict';

    const keybindPanel = `
<h5>Keybinds</h5>
<p><i>Esc</i> unbinds the selected key.</p>
<div>
    <label for="brushSize">Brush size:</label>
    <select class="form-control" id="brushSize">
        <option>None</option>
        <option>1-4</option>
        <option>Numpad 1-4</option>
    </select>
    <label for="brushColor">Brush color:</label>
    <select class="form-control" id="brushColor">
        <option>None</option>
        <option>0-9</option>
        <option>Numpad 0-9</option>
    </select>
</div>
<!-- Sample generic combo keybind
<div>
  <label for="example">Example:</label>
  <select class="form-control" id="example">
    <option>None</option>
    <option>Shift</option>
    <option>Alt</option>
    <option>Ctrl</option>
  </select>
  <h5 class="plus">+</h5>
  <input class="form-control" id="example2" placeholder="Click to bind..." readonly>
</div -->

<style>
</style>`;

    const userPanel = document.querySelector('#screenLogin > .login-content > .loginPanelContent');
    const panelElem = document.createElement('div');
    panelElem.classList.add('keybindMenu');
    panelElem.innerHTML = keybindPanel;
    userPanel.append(panelElem);

    const chatInput = document.querySelector('#inputChat');
    let lastColorIdx = 11;

    const brushColors = document.querySelectorAll('[data-color]');
    const colorInput = document.getElementById('brushColor');
    colorInput.value = localStorage.brushColor || 'None';
    colorInput.addEventListener('change', e => (localStorage.brushColor = e.target.value));

    const brushSizes = document.querySelectorAll('[data-size]');
    const sizeInput = document.getElementById('brushSize');
    sizeInput.value = localStorage.brushSize || 'None';
    sizeInput.addEventListener('change', e => (localStorage.brushSize = e.target.value));

    document.addEventListener('keydown', e => {
        if (document.activeElement.tagName !== 'INPUT') {
            // Undo
            if (e.key === 'z' && e.ctrlKey) {
                e.preventDefault();
                captureCanvas.restoreDrawing(1);
                return;
            }

            // Focus chat
            if (e.key === 'Shift' && !(e.altKey || e.ctrlKey)) {
                e.preventDefault();
                chatInput.focus();
                return;
            }

            // Brush size
            if (
                (localStorage.brushSize === '1-4' && e.code.match(/Digit[1-4]/)) ||
                (localStorage.brushSize === 'Numpad 1-4' && e.code.match(/Numpad[1-4]/))
            ) {
                brushSizes[+e.key - 1].click();
            }

            // Brush color
            if (
                (localStorage.brushColor === '0-9' && e.code.match(/Digit[0-9]/)) ||
                (localStorage.brushColor === 'Numpad 0-9' && e.code.match(/Numpad[0-9]/))
            ) {
                let targetColor = 11;
                if (e.key === '0') {
                    switch (lastColorIdx) {
                        case 11:
                            targetColor = 0;
                            break;
                        case 0:
                            targetColor = 1;
                            break;
                        case 1:
                            targetColor = 12;
                    }
                } else if (lastColorIdx == +e.key + 1) {
                    targetColor = +e.key + 12;
                } else {
                    targetColor = +e.key + 1;
                }
                brushColors[targetColor].click();
                lastColorIdx = targetColor;
            }
        }
    });
})();
