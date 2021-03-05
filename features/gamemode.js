(() => {
    'use strict';

    const gamemodeSelect = `
<label for="gamemode">Gamemode:</label>
<select class="form-control" id="gamemode">
    <option>None</option>
    <option>Blind</option>
    <option>Deaf</option>
    <option>One shot</option>
    <!--option>Continuation</option-->
</select>`;

    const userPanel = document.querySelector('#screenLogin > .login-content > .loginPanelContent');
    const panelElem = document.createElement('div');
    panelElem.classList.add('gamemodeMenu');
    panelElem.innerHTML = gamemodeSelect;
    userPanel.append(panelElem);

    const chatInput = document.querySelector('#inputChat');
    const canvas = document.querySelector('#canvasGame');
    const game = document.querySelector('.containerGame');
    const currentWord = document.querySelector('#currentWord');
    const gamemodeInput = document.querySelector('#gamemode');
    let currentGamemode = sessionStorage.getItem('gamemode');
    gamemodeInput.value = currentGamemode || 'None';
    gamemodeInput.addEventListener('change', e => {
        sessionStorage.setItem('gamemode', e.target.value);
        currentGamemode = e.target.value;
        init();
    });

    function oneshot(e) {
        if (e.key === 'Enter') {
            chatInput.disabled = true;
        }
    }

    function init() {
        canvas.style.opacity = 1;
        game.classList.remove('gamemodeDeaf');
        currentWord.style.opacity = 1;
        chatInput.disabled = false;

        switch (currentGamemode) {
            case 'Blind':
                canvas.style.opacity = 0;
                break;
            case 'Deaf':
                game.classList.add('gamemodeDeaf');
                currentWord.style.opacity = 0;
                break;
            case 'One shot':
                chatInput.disabled = false;
                chatInput.addEventListener('keyup', oneshot);
                break;
        }
    }
    init();

    const drawingObserver = new MutationObserver(mutations => {
        const overlay = mutations[0].target;

        if (overlay.style.display === 'none') {
            // Start drawing
            switch (currentGamemode) {
                case 'Blind':
                    canvas.style.opacity = 0;
                    break;
                case 'Deaf':
                    game.classList.add('gamemodeDeaf');
                    currentWord.style.opacity = 0;
                    break;
                case 'One shot':
                    chatInput.disabled = false;
                    chatInput.addEventListener('keyup', oneshot);
                    break;
            }
        } else {
            // Finish drawing
            switch (currentGamemode) {
                case 'Blind':
                    canvas.style.opacity = 1;
                    break;
                case 'Deaf':
                    game.classList.remove('gamemodeDeaf');
                    currentWord.style.opacity = 1;
                    break;
                case 'One shot':
                    chatInput.disabled = false;
                    chatInput.removeEventListener('keyup', oneshot);
                    break;
            }
        }
    });
    drawingObserver.observe(document.querySelector('#overlay'), {
        attributes: true,
        attributeFilter: ['style'],
    });
})();
