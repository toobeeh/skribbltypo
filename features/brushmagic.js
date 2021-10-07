const brushmagic = {
    groups: {
        color: {
            rainbow: {
                name: "Rainbow",
                description: "The brush color is a rainbow color depending on your pen pressure.",
                enabled: false,
                options: {
				},
                enable: () => {
                    for (let [name, mode] of Object.entries(brushmagic.groups.color)){
                        mode.disable();
                    }
                    brushmagic.groups.color.rainbow.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.color.rainbow.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 && event.pointerType == "pen") {
                        const colors = brushmagic.getColorsHue();
                        const index = Math.round(event.pressure * (colors.length - 1));
                        const color = colors[index][2].hex;
                        colcode = parseInt(color.toString().replace("#", ""), 16) + 10000;
                        if (colcode != 10000 + 16777215) document.dispatchEvent(newCustomEvent("setColor", { detail: { code: colcode } }));
					}
				}
            },
            brightness: {
                name: "Brightness",
                description: "The brightness of a selected color varies with pen pressure.",
                enabled: false,
                options: {
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushmagic.groups.color)) {
                        mode.disable();
                    }
                    brushmagic.groups.color.brightness.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.color.brightness.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 && event.pointerType == "pen") {
                        const selected = QS("#color-preview-primary").style.fill;
                        const matchGroup = brushmagic.colorGroups.find(group => group.some(col => col == selected));
                        const index = Math.round(event.pressure * (matchGroup.length - 1));
                        const color = new Color({ rgb: matchGroup[index] });
                        colcode = parseInt(color.hex.toString().replace("#", ""), 16) + 10000;
                        document.dispatchEvent(newCustomEvent("setColor", { detail: { code: colcode } }));
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
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushmagic.groups.mirror)) {
                        mode.disable();
                    }
                    brushmagic.groups.mirror.mandala.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.mirror.mandala.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        const mirror = brushmagic.groups.mirror.mandala.options.axis.val;
                        let clone = new MouseEvent("mousemove", event)
                        const canvasRect = brushmagic.canvas.getBoundingClientRect();
                        const sculptX = canvasRect.width - event.offsetX;
                        const sculptY = canvasRect.height - event.offsetY;
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });

                        brushmagic.canvas.dispatchEvent(new MouseEvent("mousedown", event));
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mousemove", event));
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mouseup", event));
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mousedown", clone));
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mouseup", clone));
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
                    }
                },
                enable: () => {
                    for (let [name, mode] of Object.entries(brushmagic.groups.mirror)) {
                        mode.disable();
                    }
                    brushmagic.groups.mirror.sculpt.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.mirror.sculpt.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        const mirror = brushmagic.groups.mirror.sculpt.options.axis.val;
                        let clone = new MouseEvent("mousemove", event)
                        const canvasRect = brushmagic.canvas.getBoundingClientRect();
                        const sculptX = canvasRect.width - event.offsetX;
                        const sculptY = canvasRect.height - event.offsetY;
                        if (mirror.indexOf("X") >= 0) clone = Object.defineProperty(clone, "clientX", { value: canvasRect.left + sculptX });
                        if (mirror.indexOf("Y") >= 0) clone = Object.defineProperty(clone, "clientY", { value: canvasRect.top + sculptY });
                        brushmagic.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
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
                    brushmagic.groups.stroke.dash.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.stroke.dash.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0) {
                        if (!brushmagic.groups.stroke.dash.wait) {
                            brushmagic.groups.stroke.dash.wait = true;
                            brushmagic.canvas.dispatchEvent(new MouseEvent("mouseup", event));
                            setTimeout(() => {
                                brushmagic.groups.stroke.dash.wait = false;
                                if (brushmagic.currentDown) brushmagic.canvas.dispatchEvent(new MouseEvent("mousedown", event));
                            }, brushmagic.groups.stroke.dash.options.interval.val);
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
                    brushmagic.groups.stroke.tilt.enabled = true;
                },
                disable: () => {
                    brushmagic.groups.stroke.tilt.enabled = false;
                },
                pointermoveCallback: (event) => {
                    if (event.pressure > 0 && event.pointerType == "pen") {
                        const density = brushmagic.groups.stroke.tilt.options.density.val;
                        const tilt = brushmagic.groups.stroke.tilt.options.tilt.val;
                        const size = parseInt(QS("#game-toolbar > div.picker > div.size-picker > div.preview > div.size").innerText.replace("px", ""));
                        for (let i = 1; i < density; i++) {
                            const offset = event.pressure * (i / density) * tilt * size;
                            let clone = new MouseEvent("mousemove", event)
                            clone = Object.defineProperty(clone, "clientX", { value: event.clientX - offset });
                            clone = Object.defineProperty(clone, "clientY", { value: event.clientY - offset });
                            brushmagic.canvas.dispatchEvent(new MouseEvent("mousemove", clone));
                        }
                    }
                }
            }
		}
    },
    currentDown: false,
    canvas: null,
    getColorsHue: () => [...QSA("#game-toolbar > div.picker > div.color-picker > div.colors:not([style*=none]) > div > div > div")]
        .map(col => new Color({ rgb: col.style.backgroundColor }))
        .map(col => [col.hsl[0], col.hsl[2], col])
        .sort((a, b) => a[0] - b[0]),
    getColorsWeighted: () => [...QSA("#game-toolbar > div.picker > div.color-picker > div.colors:not([style*=none]) > div > div > div")]
        .map(col => new Color({ rgb: col.style.backgroundColor }))
        .map(col => [Math.sqrt(0.5 * col.hsl[0] * col.hsl[0] + 0.5 * col.hsl[1] * col.hsl[1] + col.hsl[2] * col.hsl[2]), col])
        .sort((a, b) => a[0] - b[0]),
    colorGroups: [
        ['rgb(255, 255, 255)', 'rgb(210, 210, 210)', 'rgb(168, 168, 168)', 'rgb(126, 126, 126)', 'rgb(80, 80, 80)', 'rgb(0, 0, 0)'],
        ['rgb(239, 19, 11)', 'rgb(183, 6, 0)', 'rgb(86, 8, 6)'],
        ['rgb(255, 113, 0)', 'rgb(206, 67, 12)', 'rgb(137, 39, 0)'],
        ['rgb(255, 228, 0)', 'rgb(232, 162, 0)', 'rgb(163, 103, 0)'],
        ['rgb(0, 255, 145)', 'rgb(0, 158, 114)', 'rgb(0, 120, 93)', 'rgb(0, 204, 0)', 'rgb(0, 114, 21)', 'rgb(0, 61, 3)'],
        ['rgb(0, 178, 255)', 'rgb(0, 86, 158)', 'rgb(0, 59, 120)', 'rgb(35, 31, 211)', 'rgb(18, 11, 145)', 'rgb(8, 3, 82)'],
        ['rgb(211, 124, 170)', 'rgb(167, 85, 116)', 'rgb(118, 48, 75)', 'rgb(163, 0, 186)', 'rgb(108, 0, 135)', 'rgb(65, 0, 81)'],
        ['rgb(255, 172, 142)', 'rgb(226, 139, 93)', 'rgb(204, 119, 77)', 'rgb(160, 82, 45)', 'rgb(99, 48, 13)', 'rgb(72, 28, 0)']
    ],
    enable: (modename, state) => {
        for (let [name, group] of Object.entries(brushmagic.groups)) {
            for (let [name, mode] of Object.entries(group)) {
                if (mode.name == modename) {
                    if (state) mode.enable();
                    else mode.disable();
				}
            }
        }
    },
    showSettings: null,
    setup: () => {
        brushmagic.canvas = QS("#game-canvas canvas");
        brushmagic.canvas.addEventListener("pointerdown", () => brushmagic.currentDown = true);
        brushmagic.canvas.addEventListener("pointerup", () => brushmagic.currentDown = false);
        brushmagic.canvas.addEventListener("pointermove", (event) => {
            for (let [name, group] of Object.entries(brushmagic.groups)){
                for (let [name, mode] of Object.entries(group)) {
                    if (mode.enabled) mode.pointermoveCallback(event);
                }
            }
        });

        const settingsContent = elemFromString(`<div id="brushmagicSettings" style="
                display: grid;
                grid-column-gap:2em;
                width: 100%;
                grid-template-columns: 1fr 1fr 1fr;"></div>`);
        const updateStates = () => {
            for (let [name, group] of Object.entries(brushmagic.groups)) {
                for (let [name, mode] of Object.entries(group)) {
                    const toggle = settingsContent.querySelector("input#brushmagicToggle" + mode.name);
                    if (toggle) toggle.checked = mode.enabled;
                }
            }
        }

        for (let [name, group] of Object.entries(brushmagic.groups)) {
            const groupContainer = elemFromString(`<div><h3>Adjust ${name}:</h3></div>`);
            for (let [name, mode] of Object.entries(group)) {
                const modeDetails = elemFromString(`<div class="mode">
                <label>
                    <input id="brushmagicToggle${mode.name}" type="checkbox" class="flatUI"></input>
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

        brushmagic.showSettings = () => {
            new Modal(settingsContent, () => { }, "Brush Magic Tools");
		}
    }
};
