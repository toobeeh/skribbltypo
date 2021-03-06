const customUI = `<div id="scsCustomUi">
<div id="scsRainbowWrapper">
  <span>Brush mode:</span>
  <select class="form-control" id="scsRainbowMode" value="1-color">
    <option>1-color</option>
    <option>2-cycle</option>
    <option>Light</option>
    <option>Dark</option>
    <option>All</option>
    <option>Gray</option>
  </select>
  <span>Speed (ms):</span>
  <input type="number" id="scsRainbowSpeed" class="form-control" min="10" max="1000" value="50" step="10" size="4" maxlength="4">
</div>

<style>
  #scsCustomUi { color: white; }
  #scsCustomUi > div { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
  #scsRainbowWrapper { margin-bottom: 10px; font-size: 12px; }
  #scsRainbowWrapper .form-control { width: auto; }
  .containerTools .tool[data-tool^="scs"].scsToolActive {
    background-color: #559105;
    filter: none;
  }
  .containerTools .tool[data-tool^="scs"]:hover {
    background-color: #699b37;
    filter: none;
  }
  div.colorPreview {
    width: 32px;
    height: 32px;
    margin-right: 24px;
  }
  .scsColorPreview {
    top: 16px;
    left: 16px;
    position: relative;
    width: 32px;
    height: 32px;
    z-index: -1;
    border-radius: 2px;
  }
</style>
</div>`;
const colorsRGB = [
  "rgb(255, 255, 255)",
  "rgb(193, 193, 193)",
  "rgb(239, 19, 11)",
  "rgb(255, 113, 0)",
  "rgb(255, 228, 0)",
  "rgb(0, 204, 0)",
  "rgb(0, 178, 255)",
  "rgb(35, 31, 211)",
  "rgb(163, 0, 186)",
  "rgb(211, 124, 170)",
  "rgb(160, 82, 45)",
  "rgb(0, 0, 0)",
  "rgb(76, 76, 76)",
  "rgb(116, 11, 7)",
  "rgb(194, 56, 0)",
  "rgb(232, 162, 0)",
  "rgb(0, 85, 16)",
  "rgb(0, 86, 158)",
  "rgb(14, 8, 101)",
  "rgb(85, 0, 105)",
  "rgb(167, 85, 116)",
  "rgb(99, 48, 13)",
];
const hatchetAnchor = { x: null, y: null };

let canvas,
  currentWord,
  solvedWord,
  timer,
  chatInput,
  brushColors;
let primaryActiveColor, secondaryActiveColor;
let isHatcheting, hatchInterval;

function switchColors() {
  const secondaryColorIdx = colorsRGB.indexOf(
    secondaryActiveColor.style.backgroundColor
  );
  secondaryActiveColor.style.backgroundColor =
    primaryActiveColor.style.backgroundColor;
  if (secondaryColorIdx != -1) {
    brushColors[secondaryColorIdx].click();
  }
}

function initColorToggle() {
  primaryActiveColor = document.getElementsByClassName("colorPreview")[0];

  secondaryActiveColor = primaryActiveColor.cloneNode();
  secondaryActiveColor.classList.add("scsColorPreview");
  secondaryActiveColor.classList.remove("colorPreview");
  secondaryActiveColor.style.backgroundColor = colorsRGB[0];
  secondaryActiveColor = primaryActiveColor.appendChild(secondaryActiveColor);

  primaryActiveColor.setAttribute("title", "Color (T)oggle");
  $(primaryActiveColor).tooltip("fixTitle");
  primaryActiveColor.addEventListener("click", switchColors);
}

function hatchCycle() {
  if (isHatcheting && hatchetAnchor.x && hatchetAnchor.y) {
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: hatchetAnchor.x,
        clientY: hatchetAnchor.y,
      })
    );
  }
}

function initHatching() {
  // Make the anchor image
  const scsAnchor = document.createElement("img");
  scsAnchor.id = "scsAnchor";
  scsAnchor.style.display = "none";
  scsAnchor.style.position = "absolute";
  scsAnchor.style.pointerEvents = "none";
  scsAnchor.src =
    "https://raw.githubusercontent.com/sbarrack/skribbl-community-scripts/master/images/anchor.png";
  document.body.appendChild(scsAnchor);

  scsElements.scsAnchor = scsAnchor;

  // Make the tool
  const eraserTool = document.querySelector('[data-tool="erase"]');
  let hatchingTool = eraserTool.cloneNode(true);
  hatchingTool.setAttribute("data-tool", "scsHatching");
  hatchingTool.firstChild.setAttribute(
    "title",
    "(H)atching (middle click to anchor, space to unanchor)"
  );
  hatchingTool.firstChild.setAttribute(
    "src",
    "https://raw.githubusercontent.com/sbarrack/skribbl-community-scripts/master/images/hatchet.gif"
  );
  hatchingTool = eraserTool.parentNode.insertBefore(hatchingTool, eraserTool);
  $(hatchingTool.firstChild).tooltip();

  // onClick logic
  hatchingTool.addEventListener("click", (e) => {
    hatchingTool.classList.toggle("scsToolActive");
    if (hatchingTool.classList.contains("scsToolActive")) {
      if (hatchetAnchor.x && hatchetAnchor.y) {
        scsAnchor.style.display = "block";
      }
      hatchInterval = setInterval(hatchCycle, settings.scsRainbowSpeed);
    } else {
      scsAnchor.style.display = "none";
      if (hatchInterval) {
        clearInterval(hatchInterval);
        hatchInterval = 0;
      }
    }
  });

  // Hatchet functionality
  document.addEventListener("mousedown", (e) => {
    if (hatchingTool.classList.contains("scsToolActive")) {
      if (e.button == 0) {
        isHatcheting = true;
      } else if (e.button == 1) {
        hatchetAnchor.x = e.clientX;
        hatchetAnchor.y = e.clientY;
        scsAnchor.style.display = "block";
        scsAnchor.style.top = e.clientY - 4 + "px";
        scsAnchor.style.left = (e.clientX - 13).toString(10) + "px";
      }
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (hatchingTool.classList.contains("scsToolActive")) {
      if (e.button == 0) {
        isHatcheting = false;
      }
    }
  });

  scsElements.hatchingTool = hatchingTool;
}

function initRainbow() {
  // Rainbow tick (change colors very fast)
  let rainbowIdx = 0;
  const grayCycle = [0, 1, 12, 11];
  function rainbowCycleTick() {
    if (settings.scsRainbowMode === "1-color") {
      const currentColorIdx = colorsRGB.indexOf(
        primaryActiveColor.style.backgroundColor
      );
      brushColors[(currentColorIdx + 11) % 22].click();
    } else if (settings.scsRainbowMode === "2-cycle") {
      switchColors();
    } else if (settings.scsRainbowMode === "Light") {
      brushColors[(rainbowIdx % 7) + 2].click();
    } else if (settings.scsRainbowMode === "Dark") {
      brushColors[(rainbowIdx % 7) + 13].click();
    } else if (settings.scsRainbowMode === "Gray") {
      brushColors[grayCycle[rainbowIdx % 4]].click();
    } else if (settings.scsRainbowMode === "All") {
      brushColors[rainbowIdx % 22].click();
    }
    rainbowIdx = (rainbowIdx + 1) % 22;
  }

  // Rainbow Tool stuff
  const eraserTool = document.querySelector('[data-tool="erase"]');
  let rainbowTool = eraserTool.cloneNode(true);
  rainbowTool.setAttribute("data-tool", "scsRainbow");
  rainbowTool.firstChild.setAttribute("title", "Magic b(R)ush");
  rainbowTool.firstChild.setAttribute(
    "src",
    "https://raw.githubusercontent.com/sbarrack/skribbl-community-scripts/master/images/brush.gif"
  );
  rainbowTool = eraserTool.parentNode.insertBefore(rainbowTool, eraserTool);
  $(rainbowTool.firstChild).tooltip();

  // Rainbow Interval for when tool is clicked
  let rainbowInterval;
  rainbowTool.addEventListener("click", (e) => {
    rainbowTool.classList.toggle("scsToolActive");
    if (rainbowTool.classList.contains("scsToolActive")) {
      rainbowInterval = setInterval(rainbowCycleTick, settings.scsRainbowSpeed);
    } else if (rainbowInterval) {
      clearInterval(rainbowInterval);
      rainbowInterval = null;
    }
  });
  scsElements.rainbowTool = rainbowTool;

  // Rainbow mode select
  const rainbowSelect = document.getElementById("scsRainbowMode");
  rainbowSelect.value = settings.scsRainbowMode || "1-cycle";
  rainbowSelect.addEventListener(
    "change",
    (e) => (settings.scsRainbowMode = e.target.value)
  );

  // Rainbow interval input
  const rainbowSpeedInput = document.getElementById("scsRainbowSpeed");
  settings.scsRainbowSpeed = parseInt(settings.scsRainbowSpeed) || 50;
  rainbowSpeedInput.value = settings.scsRainbowSpeed;
  rainbowSpeedInput.addEventListener(
    "change",
    (e) => (settings.scsRainbowSpeed = e.target.value)
  );
  rainbowSpeedInput.addEventListener("change", (e) => {
    settings.scsRainbowSpeed = parseInt(e.target.value);
    if (rainbowInterval) {
      clearInterval(rainbowInterval);
      rainbowInterval = setInterval(rainbowCycleTick, settings.scsRainbowSpeed);
    }

    if (hatchInterval) {
      clearInterval(hatchInterval);
      hatchInterval = setInterval(hatchCycle, settings.scsRainbowSpeed);
    }

    rainbowSpeedInput.blur();
  });
  scsElements.rainbowSpeed = rainbowSpeedInput;
}

function toggleHotkeys(e) {
  if (e.key === "r") {
    scsElements.rainbowTool.click();
  } else if (e.key === "t") {
    switchColors();
  } else if (e.key === "h") {
    scsElements.hatchingTool.click();
  } else if (
    e.key === " " &&
    scsElements.hatchingTool.classList.contains("scsToolActive")
  ) {
    e.preventDefault();
    e.stopPropagation();
    Object.assign(hatchetAnchor, { x: null, y: null });
    scsElements.scsAnchor.style.display = "none";
  }
}

function init() {
  document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName !== "INPUT") {
      toggleHotkeys(e);
    }
  });
}
