const stateFromLocalstorage = (modeName, defaultState, stateOverride) => {
    let keyname = "brushmagic_" + modeName;

    if(stateOverride === false || stateOverride === true) {
        localStorage.setItem(keyname, stateOverride);
        return stateOverride;
    }
    else if(!localStorage.getItem(keyname)) {
        localStorage.setItem(keyname, defaultState);
        return defaultState;
    }
    else return localStorage.getItem(keyname) == "true";
}

const brushtools = {
    groups: {
        tablet: {
            pressure: {
                name: "Tablet Pressure",
                description: "Draw with tablet pressure.",
                enabled: stateFromLocalstorage("tablet_pressure", true),
                lastUpdate: 0,
                options: {
                },
                enable: () => {
                    brushtools.groups.tablet.pressure.enabled = stateFromLocalstorage("tablet_pressure", undefined, true);
                },
                disable: () => {
                    brushtools.groups.tablet.pressure.enabled = stateFromLocalstorage("tablet_pressure", undefined, false);
                },
                pointermoveCallback: (event) => {
                    if(event.pointerType == "pen"){

                        let now = Date.now();
                        if(now - brushtools.groups.tablet.pressure.lastUpdate < 5) return;
                        brushtools.groups.tablet.pressure.lastUpdate = now;

                        if(event.type == "pointerdown"){
                           setBrushsize(0);
                        } 
                        else if(event.type == "pointerup"){
                            setBrushsize(0);
                        } 
                        else if (event.type === "pointermove"){
                            
                            if(event.pressure >= 0){
                                setBrushsize(event.pressure);
                            }
                        }
                    }
                }
            },
            eraser: {
                name: "Pen Eraser",
                description: "Enables the pen eraser button.",
                enabled: stateFromLocalstorage("tablet_eraser", true),
                options: {
                },
                enable: () => {
                    brushtools.groups.tablet.eraser.enabled = stateFromLocalstorage("tablet_eraser", undefined, true);
                },
                disable: () => {
                    brushtools.groups.tablet.eraser.enabled = stateFromLocalstorage("tablet_eraser", undefined, false);
                },
                pointermoveCallback: (event) => {
                    if(event.type == "pointerdown" && event.pointerType == "pen"){

                        if(event.button == 5) {
                            document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'})); 

                            brushtools.canvas.dispatchEvent(new PointerEvent("mouseup", event));
                            brushtools.canvas.dispatchEvent(new PointerEvent("mousedown", event));

                            document.addEventListener("pointerup", () => {
                                document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
                            }, {once: true});
                        }
                    }
                },
                switched: null
            }
        },
        color: {
            rainbowcircle: {
                name: "Rainbow Cycle",
                description: "Cycles through bright rainbow colors, no pen needed.",
                enabled: false,
                options: {
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.color)) {
                        mode.disable();
                    }
                    brushtools.groups.color.rainbowcircle.lastSwitch = 0;
                    brushtools.groups.color.rainbowcircle.lastIndex = 0;
                    brushtools.groups.color.rainbowcircle.direction = 1;
                    brushtools.groups.color.rainbowcircle.enabled = true;
                    gamemodes.modes.find(mode => mode.name == "Monochrome").options.destroy();
                },
                disable: () => {
                    brushtools.groups.color.rainbowcircle.enabled = false;
                },
                pointermoveCallback: (event) => {
                    const colors = ["ef130b", "ff7100", "ffe400", "00cc00", "00b2ff", "231fd3", "a300ba", "d37caa"];
                    if (event.pressure > 0) {
                        const interval = parseInt(localStorage.randomColorInterval)
                        if (Date.now() - brushtools.groups.color.rainbowcircle.lastSwitch > interval) {
                            brushtools.groups.color.rainbowcircle.lastSwitch = Date.now();
                            let index = brushtools.groups.color.rainbowcircle.lastIndex;
                            if (brushtools.groups.color.rainbowcircle.direction > 0) {
                                if (++index >= colors.length) {
                                    brushtools.groups.color.rainbowcircle.direction *= -1;
                                    index = colors.length - 2;
                                }
                            }
                            else {
                                if (--index < 0) {
                                    brushtools.groups.color.rainbowcircle.direction *= -1;
                                    index = 1;
                                }
                            }
                            brushtools.groups.color.rainbowcircle.lastIndex = index;
                            console.log("#" + colors[index]);
                            document.body.dispatchEvent(newCustomEvent("setColor", { detail: { hex: "#" + colors[index] } }));
                        }
                    }
                }
            }
		},
        stroke: {
            dash: {
                name: "Dash",
                description: "Draw dashed lines.",
                enabled: false,
                options: {
                    interval: {
                        val: 10,
                        type: "num"
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.dash.enabled = true;
                },
                disable: () => {
                    brushtools.groups.stroke.dash.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        if (!brushtools.groups.stroke.dash.wait) {
                            brushtools.groups.stroke.dash.wait = true;
                            brushtools.canvas.dispatchEvent(new MouseEvent("mouseup", event));
                            setTimeout(() => {
                                brushtools.groups.stroke.dash.wait = false;
                                if (brushtools.currentDown) brushtools.canvas.dispatchEvent(new MouseEvent("mousedown", event));
                            }, brushtools.groups.stroke.dash.options.interval.val);
                        }
                    }
                }
            },
            tilt: {
                name: "Tilt",
                description: "Draw tilted lines.",
                enabled: false,
                options: {
                    density: {
                        val: 10,
                        type: "num"
                    },
                    tilt: {
                        val: 5,
                        type: "num"
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.tilt.enabled = true;
                },
                disable: () => {
                    brushtools.groups.stroke.tilt.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 ) {
                        const density = brushtools.groups.stroke.tilt.options.density.val;
                        const tilt = brushtools.groups.stroke.tilt.options.tilt.val;
                        const size = parseInt(QS("#sizeslider input").value);
                        for (let i = 1; i < density; i++) {
                            const offset = event.pressure  * tilt * size;
                            let clone = new MouseEvent("mousemove", event)
                            clone = Object.defineProperty(clone, "clientX", { value: event.clientX - offset - i});
                            clone = Object.defineProperty(clone, "clientY", { value: event.clientY - offset - i});
                            brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                            //brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", event));
                        }
                    }
                }
            },
            noise: {
                name: "Noise",
                description: "Draw distorted lines. If you're using a pen, the size is affected by pressure.",
                enabled: false,
                options: {
                    size: {
                        val: 10,
                        type: "num"
                    },
                    direction: {
                        val: "top",
                        type: ["top", "bottom", "left", "right", "vertical", "horizontal", "all"]
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.stroke.noise.enabled = true;
                },
                disable: () => {
                    brushtools.groups.stroke.noise.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 ) {
                        const density = 4;
                        const direction = brushtools.groups.stroke.noise.options.direction.val;
                        const size = brushtools.groups.stroke.noise.options.size.val * 10;
                        const amount = density; 
                        const offset = event.pressure  * size;
                        
                        for (let i = 1; i < amount; i++) {
                            let vertical = Math.random() * offset * 2 - offset;
                            let horizontal = Math.random() * offset * 2 - offset;

                            switch(direction){
                                case "top":
                                    vertical = -Math.abs(vertical);
                                    horizontal = horizontal * 0.6;
                                    break;
                                case "bottom":
                                    vertical = Math.abs(vertical);
                                    horizontal = horizontal * 0.6;
                                    break;
                                case "left":
                                    horizontal = -Math.abs(horizontal);
                                    vertical = vertical * 0.6;
                                    break;
                                case "right":
                                    horizontal = Math.abs(horizontal);
                                    vertical = vertical * 0.6;
                                    break;
                                case "vertical": 
                                    horizontal = horizontal * 0.3;
                                    break;
                                case "horizontal":
                                    vertical = vertical * 0.3;
                                    break;
                            }

                            let clone = new MouseEvent("mousemove", event);
                            clone = Object.defineProperty(clone, "clientX", { value: event.clientX + horizontal});
                            clone = Object.defineProperty(clone, "clientY", { value: event.clientY + vertical});
                            brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                            brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", event));
                        }
                    }
                }
            }
		},
        mirror: {
            mandala: {
                name: "Mandala",
                description: "The brush is mirrored on either the X-axis, Y-axis or both.",
                enabled: false,
                options: {
                    axis: {
                        val: "X",
                        type: ["X", "XY", "Y"]
                    },
                    mirrorpoint: {
                        val: "Center",
                        type: ["Center", "Click"]
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.mirror.mandala.enabled = true;
                },
                disable: () => {
                    brushtools.groups.mirror.mandala.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        if (event.type == "pointerdown") {
                            brushtools.groups.mirror.mandala.lastDownPos = [event.offsetX, event.offsetY];
                            brushtools.canvas.addEventListener("pointerup", () => {
                                brushtools.groups.mirror.mandala.lastDownPos = [];
                                brushtools.groups.mirror.mandala.lastEvent = null;
                                brushtools.groups.mirror.mandala.lastClone = null;
                            }, { once: true });
                        }
                        const mirror = brushtools.groups.mirror.mandala.options.axis.val;
                        const point = brushtools.groups.mirror.mandala.options.mirrorpoint.val;
                        const lastDown = brushtools.groups.mirror.mandala.lastDownPos;
                        let clone = new MouseEvent("mousemove", event)
                        const canvasRect = brushtools.canvas.getBoundingClientRect();
                        const sculptX = point == "Center" ? canvasRect.width - event.offsetX : lastDown[0] - ((lastDown[0] - event.offsetX) * -1);
                        const sculptY = point == "Center" ? canvasRect.height - event.offsetY : lastDown[1] - ((lastDown[1] - event.offsetY) * -1);
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });

                        let lastEvent = brushtools.groups.mirror.mandala.lastEvent;
                        let lastClone = brushtools.groups.mirror.mandala.lastClone;

                        brushtools.canvas.dispatchEvent(new MouseEvent("mousedown", lastEvent ? lastEvent : event));
                        brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", event));
                        brushtools.canvas.dispatchEvent(new MouseEvent("mouseup", event));
                        brushtools.canvas.dispatchEvent(new MouseEvent("mousedown", lastClone ? lastClone : clone));
                        brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                        brushtools.canvas.dispatchEvent(new MouseEvent("mouseup", clone));

                        brushtools.groups.mirror.mandala.lastEvent = event;
                        brushtools.groups.mirror.mandala.lastClone = clone;
                    }
                    else {
                        brushtools.groups.mirror.mandala.lastEvent = null;
                        brushtools.groups.mirror.mandala.lastClone = null;
                    }
                }
            },
            sculpt: {
                name: "Sculpt",
                description: "Creates sculptures mirrored on either the X-axis, Y-axis or both.",
                enabled: false,
                options: {
                    axis: {
                        val: "X",
                        type: ["X", "XY", "Y"]
                    },
                    mirrorpoint: {
                        val: "Center",
                        type: ["Center", "Click"]
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushtools.groups.mirror)) {
                        mode.disable();
                    }
                    for (let [name, mode] of Object.entries(brushtools.groups.stroke)) {
                        mode.disable();
                    }
                    brushtools.groups.mirror.sculpt.enabled = true;
                },
                disable: () => {
                    brushtools.groups.mirror.sculpt.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 && !event.ctrlKey) {
                        if (event.type == "pointerdown") {
                            brushtools.groups.mirror.sculpt.lastDownPos = [event.offsetX, event.offsetY];
                            brushtools.canvas.dispatchEvent(new MouseEvent("mousedown", event));
                        }
                        const mirror = brushtools.groups.mirror.sculpt.options.axis.val;
                        const point = brushtools.groups.mirror.sculpt.options.mirrorpoint.val;
                        const lastDown = brushtools.groups.mirror.sculpt.lastDownPos;
                        let clone = new MouseEvent("mousemove", event)
                        const canvasRect = brushtools.canvas.getBoundingClientRect();
                        const sculptX = point == "Center" ? canvasRect.width - event.offsetX : lastDown[0] - ((lastDown[0] - event.offsetX) * -1);
                        const sculptY = point == "Center" ? canvasRect.height - event.offsetY : lastDown[1] - ((lastDown[1] - event.offsetY) * -1);
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });
                        brushtools.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                        if (event.type == "pointerdown") {
                            brushtools.canvas.dispatchEvent(new MouseEvent("mouseup", clone));
                        }
                    }
                }
            }
        }
    },
    currentDown: false,
    canvas: null,
    enable: (modename, state) => {
        for (let [name, group] of Object.entries(brushtools.groups)) {
            for (let [name, mode] of Object.entries(group)) {
                if (mode.name == modename) {
                    if (state) mode.enable();
                    else mode.disable();
				}
            }
        }
    },
    modal: null,
    showSettings: null,
    setup: () => {
        brushtools.canvas = QS("#canvasGame");
        brushtools.canvas.addEventListener("pointerdown", (event) => {
            brushtools.currentDown = true;
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled) mode.pointermoveCallback(event);
                }
            }
        });
        brushtools.canvas.addEventListener("pointerup", () => brushtools.currentDown = false);
        brushtools.canvas.addEventListener("pointermove", (event) => {
            for (let [name, group] of Object.entries(brushtools.groups)){
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled) mode.pointermoveCallback(event);
                }
            }
        });

        const settingsContent = elemFromString(`<div id="brushmagicSettings" style="
                /* display: grid; */
                /* grid-column-gap:2em; */
                /*  width: 100%; */
                /* grid-template-columns: 1fr 1fr 1fr; */
                columns: 3"></div>`);

        const updateStates = () => {
            for (let [name, group] of Object.entries(brushtools.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    const toggle = settingsContent.querySelector("input#brushmagicToggle" + name);
                    if (toggle) toggle.checked = mode.enabled;
                }
            }
        }

        for (let [name, group] of Object.entries(brushtools.groups)) {
            const groupContainer = elemFromString(`<div><h3>${name.charAt(0).toUpperCase() + name.slice(1)} Mods</h3></div>`);
            for (let [name, mode] of Object.entries(group)) {
                const modeDetails = elemFromString(`<div class="mode">
                <label>
                    <input id="brushmagicToggle${name}" type="checkbox" class="flatUI"></input>
                    <span>${mode.name}</span>
                </label>
                <span>${mode.description}</span>
                </div>`);
                modeDetails.querySelector("input").addEventListener("input", (event) => {
                    if (event.target.checked) mode.enable();
                    else mode.disable();
                    updateStates();
                });
                const modeOptions = elemFromString(`<div class="options"></div>`);
                for (let [name, option] of Object.entries(mode.options)) {
                    if (option.type == "num") {
                        const optionElem = elemFromString(`<label>Set ${name}:<input type="number" value="${option.val}"></label>`);
                        modeOptions.appendChild(optionElem);
                        optionElem.querySelector("input").addEventListener("input", event => {
                            option.val = parseInt(event.target.value);
                        });
                    }
                    else if (typeof (option) == "object") {
                        const optionElem = elemFromString(`<label>Set ${name}:<select value="${option.val}">${option.type.map(opt => "<option value="+opt+">" + opt + "</option>").join("")}</select></label>`);
                        modeOptions.appendChild(optionElem);
                        optionElem.querySelector("select").addEventListener("input", event => {
                            option.val =event.target.value;
                        });
					}
                }
                modeDetails.appendChild(modeOptions);
                groupContainer.appendChild(modeDetails);
            }
            settingsContent.appendChild(groupContainer);
        }

        brushtools.showSettings = () => {
            updateStates();
            if (!brushtools.modal) brushtools.modal = new Modal(settingsContent, () => { brushtools.modal = null; }, "Brush Laboratory", "65vw");
            else {
                brushtools.modal.close();
                brushtools.modal = null;
            }
        }

        document.addEventListener("openBrushLab", brushtools.showSettings);

        // enable defaults
        for (let [name, group] of Object.entries(brushtools.groups)) {
            for (let [name, mode] of Object.entries(group)) {
                if(mode.enabled) mode.enable();
            }
        }
    }
};
