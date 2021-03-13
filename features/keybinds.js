const keybind = {
    isInit: false,
    lastColorIdx: 11,
    keybindPanel: `
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
</div -->`,
    init: () => {
        'use strict';
        if (!keybind.isInit) {
            keybind.brushColors = document.querySelectorAll('[data-color]');
            keybind.brushSizes = document.querySelectorAll('[data-size]');
            keybind.userPanel = document.querySelector(
                '#screenLogin > .login-content > .loginPanelContent'
            );
            keybind.panelElem = document.createElement('div');
            keybind.panelElem.classList.add('keybindMenu');
            keybind.panelElem.innerHTML = keybind.keybindPanel;
            keybind.userPanel.append(keybind.panelElem);
            const colorInput = document.querySelector('#brushColor');
            colorInput.value = localStorage.brushColor || 'None';
            colorInput.addEventListener('change', e => (localStorage.brushColor = e.target.value));
            const sizeInput = document.querySelector('#brushSize');
            sizeInput.value = localStorage.brushSize || 'None';
            sizeInput.addEventListener('change', e => (localStorage.brushSize = e.target.value));
            document.addEventListener('keydown', keybind.keydown);
            keybind.isInit = true;
        }
    },
    destroy: () => {
        'use strict';
        if (keybind.isInit) {
            keybind.userPanel.removeChild(keybind.panelElem);
            document.removeEventListener('keydown', keybind.keydown);
            keybind.isInit = false;
        }
    },
    keydown: e => {
        'use strict';
        if (document.activeElement.tagName !== 'INPUT') {
            // Brush size
            if (
                (localStorage.brushSize === '1-4' && e.code.match(/Digit[1-4]/)) ||
                (localStorage.brushSize === 'Numpad 1-4' && e.code.match(/Numpad[1-4]/))
            ) {
                keybind.brushSizes[+e.key - 1].click();
            }
            // Brush color
            if (
                (localStorage.brushColor === '0-9' && e.code.match(/Digit[0-9]/)) ||
                (localStorage.brushColor === 'Numpad 0-9' && e.code.match(/Numpad[0-9]/))
            ) {
                let targetColor = 11;
                if (e.key === '0') {
                    switch (keybind.lastColorIdx) {
                        case 11:
                            targetColor = 0;
                            break;
                        case 0:
                            targetColor = 1;
                            break;
                        case 1:
                            targetColor = 12;
                    }
                } else if (keybind.lastColorIdx == +e.key + 1) {
                    targetColor = +e.key + 12;
                } else {
                    targetColor = +e.key + 1;
                }
                keybind.brushColors[targetColor].click();
                keybind.lastColorIdx = targetColor;
            }
        }
    },
};
