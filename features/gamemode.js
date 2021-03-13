const gamemode = {
    isInit: false,
    hasRunOnce: false,
    gamemodeSelect: `
<label for="gamemode">Gamemode:</label>
<select class="form-control" id="gamemode">
    <option>None</option>
    <option>Blind</option>
    <option>Deaf</option>
    <option>One shot</option>
    <!--option>Continuation</option-->
</select>`,
    currentGamemode: 'None',
    runOnce: () => {
        'use strict';
        if (!gamemode.hasRunOnce) {
            gamemode.userPanel = document.querySelector(
                '#screenLogin > .login-content > .loginPanelContent'
            );
            gamemode.panelElem = document.createElement('div');
            gamemode.panelElem.classList.add('gamemodeMenu');
            gamemode.panelElem.innerHTML = gamemode.gamemodeSelect;
            gamemode.chatInput = document.querySelector('#inputChat');
            gamemode.canvas = document.querySelector('#canvasGame');
            gamemode.game = document.querySelector('.containerGame');
            gamemode.currentWord = document.querySelector('#currentWord');
            gamemode.overlay = document.querySelector('#overlay');
            gamemode.drawingObserver = new MutationObserver(mutations => {
                const overlay = mutations[0].target;
                if (overlay.style.display === 'none') {
                    // Start drawing
                    switch (gamemode.currentGamemode) {
                        case 'Blind':
                            gamemode.canvas.style.opacity = 0;
                            break;
                        case 'Deaf':
                            gamemode.game.classList.add('gamemodeDeaf');
                            gamemode.currentWord.style.opacity = 0;
                            break;
                        case 'One shot':
                            gamemode.chatInput.disabled = false;
                            gamemode.chatInput.addEventListener('keyup', gamemode.oneshot);
                            break;
                    }
                } else {
                    // Finish drawing
                    switch (gamemode.currentGamemode) {
                        case 'Blind':
                            gamemode.canvas.style.opacity = 1;
                            break;
                        case 'Deaf':
                            gamemode.game.classList.remove('gamemodeDeaf');
                            gamemode.currentWord.style.opacity = 1;
                            break;
                        case 'One shot':
                            gamemode.chatInput.disabled = false;
                            gamemode.chatInput.removeEventListener('keyup', gamemode.oneshot);
                            break;
                    }
                }
            });
            gamemode.hasRunOnce = true;
        }
    },
    init: () => {
        'use strict';
        if (!gamemode.isInit) {
            gamemode.runOnce();
            gamemode.userPanel.append(gamemode.panelElem);
            gamemode.currentGamemode = sessionStorage.getItem('gamemode');
            gamemode.gamemodeInput = document.querySelector('#gamemode');
            gamemode.gamemodeInput.value = gamemode.currentGamemode || 'None';
            gamemode.gamemodeInput.addEventListener('change', gamemode.changeGame);
            gamemode.setup();
            gamemode.drawingObserver.observe(gamemode.overlay, {
                attributes: true,
                attributeFilter: ['style'],
            });
            gamemode.isInit = true;
        }
    },
    destroy: () => {
        'use strict';
        if (gamemode.isInit) {
            gamemode.userPanel.removeChild(gamemode.panelElem);
            gamemode.gamemodeInput.removeEventListener('change', gamemode.changeGame);
            gamemode.drawingObserver.disconnect();
            gamemode.isInit = false;
        }
    },
    changeGame: e => {
        'use strict';
        sessionStorage.setItem('gamemode', e.target.value);
        gamemode.currentGamemode = e.target.value;
        gamemode.setup();
    },
    oneshot: e => {
        'use strict';
        if (e.key === 'Enter') {
            gamemode.chatInput.disabled = true;
        }
    },
    setup: () => {
        'use strict';
        gamemode.canvas.style.opacity = 1;
        gamemode.game.classList.remove('gamemodeDeaf');
        gamemode.currentWord.style.opacity = 1;
        gamemode.chatInput.disabled = false;
        switch (gamemode.currentGamemode) {
            case 'Blind':
                gamemode.canvas.style.opacity = 0;
                break;
            case 'Deaf':
                gamemode.game.classList.add('gamemodeDeaf');
                gamemode.currentWord.style.opacity = 0;
                break;
            case 'One shot':
                gamemode.chatInput.disabled = false;
                gamemode.chatInput.addEventListener('keyup', gamemode.oneshot);
                break;
        }
    },
};
