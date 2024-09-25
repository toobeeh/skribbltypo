<script>
  export let content = "Loading...";
</script>

<style lang="scss">
    @keyframes bounceload {
        from {
            transform: scale(0.5)
        }

        to {
            transform: translateX(-40%) scale(1.5)
        }
    }

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .5em;
        padding:.8em;

        .icon {
            display: inline-block;
            height: 1.5em;
            aspect-ratio: 1;
            background-image: url(/img/size.gif);
            background-size: 1em;
            background-repeat: no-repeat;
            background-position: center;
            transform: scale(1.5);
            filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
            animation: bounceload .5s infinite;
            animation-direction: alternate;
            animation-timing-function: ease-in-out;
            transform-origin: center;
            margin-right: .5em;
            margin-left: .5em;
        }

        span {
          color: var(--COLOR_PANEL_TEXT);
          font-weight: bold;
        }
    }
</style>

<div>
  <div class="icon"></div>
  <span>{content}</span>
</div>