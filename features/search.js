const search = {
    startFilterSearch: undefined,
    SearchFilter: class {
        constructor(inputOptions) {
            // get names and define name match func
            this.names = [];
            this.names = inputOptions.find(e => e.id == "inputSearchName").value.trim() != "" ? inputOptions.find(e => e.id == "inputSearchName").value.trim().split(",").map(p => p.trim()) : []
            const matchesNames = (players) => {
                return this.names.length == 0 || players.some(lobbyplayer =>
                    this.names.some(searchPlayer => searchPlayer.toLowerCase() == lobbyplayer.Name.toLowerCase()));
            };

            // get round and round modifier + match func
            this.targetRound = 0;
            this.targetRoundModifier = 0;
            let valRound = inputOptions.find(e => e.id == "inputSearchRound").value.trim();
            this.targetRound = parseInt(valRound);
            this.targetRoundModifier = valRound[valRound.indexOf(this.targetRound) + this.targetRound.toString().length];
            if (this.targetRoundModifier != "+" && this.targetRoundModifier != "-" && this.targetRoundModifier != undefined
                || isNaN(this.targetRound)) this.targetRoundModifier = "+";
            const matchesRound = (round) => {
                return isNaN(this.targetRound) ||
                    (this.targetRoundModifier == "+" ? round >= this.targetRound
                        : this.targetRoundModifier == "-" ? round <= this.targetRound
                            : round == this.targetRound);
            };

            // get score and score modifier + match func
            this.targetScore = 0;
            this.targetScoreModifier = 0;
            let valScore = inputOptions.find(e => e.id == "inputSearchScore").value.trim();
            this.targetScore = parseInt(valScore);
            this.targetScoreModifier = valScore[valScore.indexOf(this.targetScore) + this.targetScore.toString().length];
            if (this.targetScoreModifier != "+" && this.targetScoreModifier != "-" && this.targetScoreModifier != undefined
                || isNaN(this.targetScore)) this.targetScoreModifier = "+";
            const matchesScore = (players) => {
                let avg = ((ps) => { let avg = 0; ps.forEach(p => avg += p.Score / ps.length); return avg; })(players);
                return isNaN(this.targetScore)
                    || (this.targetScoreModifier == "-" ? avg < this.targetScoreModifier : avg >= this.targetScore);
            };

            // get count and count modifier + match func
            this.targetCount = 0;
            this.targetCountModifier = 0;
            let valCount = inputOptions.find(e => e.id == "inputSearchCount").value.trim();
            this.targetCount = parseInt(valCount);
            this.targetCountModifier = valCount[valCount.indexOf(this.targetCount) + this.targetCount.toString().length];
            if (this.targetCountModifier != "+" && this.targetCountModifier != "-" && this.targetCountModifier != undefined
                || isNaN(this.targetCount)) this.targetCountModifier = "+";
            const matchesCount = (players) => {
                return isNaN(this.targetCount)
                    || (this.targetCountModifier == "-" ? players.length <= this.targetCount : this.targetCountModifier == "+" ? players.length >= this.targetCount : players.length == this.targetCount);
            };

            // get ptr players checked + match func
            this.targetPalantirPresent = inputOptions.find(e => e.id == "inputSearchPalantir").checked;
            const matchesPalantir = (lobbyKey) => {
                return !this.targetPalantirPresent || sprites.playerSprites.some(sprite => sprite.LobbyKey == lobbyKey);
            };

            //function to check if all filters match - if private, dont check filters
            this.matchAll = (lobbyProperties) => {
                return lobbyProperties.Private || matchesNames(lobbyProperties.Players)
                    && matchesCount(lobbyProperties.Players)
                    && matchesScore(lobbyProperties.Players)
                    && matchesRound(lobbyProperties.Round)
                    && matchesPalantir(lobbyProperties.Key)
            }
        }
    },
    setup: () => {

        // get add filter button
        let addFilterBtn = QS("#addFilter");

        // create filter input elements
        let containerFilters = elemFromString(`<div 
            id="containerFilters" 
            style="display:grid; grid-template-columns: 2fr 3fr 2fr 3fr; width:100%; place-items: center"
        >
            <div style="grid-column-start: span 4; text-align:center">
                <details> 
                    <summary style="cursor:pointer; user-select:none"> <b>How lobby filters work</b> </summary>
                    With lobby filters, you can search for lobbys with customizable search criteria.<br>
                    Add names (separated with a comma), a specific round, average player score or lobby player count.<br>
                    You can also add a + or - after numbers to accept more or less of that value.<br>
                    When you enable "With Palantir Player" the search will stop at lobbies with Palantir users.<br>
                    When you click "Play", Typo will only stop at lobbies that fulfull one of your active filters.  <br>
                </details>
            </div>

            <h3>Search Names:</h3>
            <input id="inputSearchName" class="form-control" placeholder="Names seaparated by a comma: \'name\' or \'name, name1, name2\'" style="grid-column-start: span 3">

            <h3 style="">In Round:</h3>
            <input id="inputSearchRound" class="form-control" placeholder="\'1\' or \'2+\'" style="">

            <h3 style="">Avg Score:</h3>
            <input id="inputSearchScore" class="form-control" placeholder="\'500+\' or \'500-\'" style="">

            <h3 style="">Player Count:</h3>
            <input id="inputSearchCount" class="form-control" placeholder="\'4-\' or \'8\'" style="">
            <div class="checkbox"  style="grid-column-start: span 2"><label  style="display:flex;"><input type="checkbox" id="inputSearchPalantir"><div style="margin-left: .5em; user-select:none"> With Palantir Player</div></label></div>

            <div style="grid-column-start: span 4; display:grid; place-content:center"> <button class="flatUI green min air" id="addFilter" >✔ Add</button>  </div>
        </div>`)
        /* let filterNamesForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5>Search Names:</h5><input id="inputSearchName" class="form-control" placeholder="\'name\' or \'name, name1, name2\'" style="flex-grow: 2; width:unset; margin-left: .5em;"></div>');
        let filterDetailsForm = elemFromString('<div style="display:flex; width: 100%; margin-bottom:.5em;"><h5 style="flex:1;">In Round:</h5><input id="inputSearchRound" class="form-control" placeholder="\'1\' or \'2+\'" style="flex: 1;margin-left: .5em;"><h5 style="margin-left: .5em; flex:1;">Avg Score:</h5><input id="inputSearchScore" class="form-control" placeholder="\'500+\' or \'500-\'" style="flex: 1; margin-left: .5em;"></div>');
        let filterPlayersForm = elemFromString('<div style="display:flex; width: 100%;"><h5 style="flex:1;">Player Count:</h5><input id="inputSearchCount" class="form-control" placeholder="\'4-\' or \'8\'" style="flex: 1;margin-left: .5em;"><div class="checkbox" style="margin-left: .5em; flex:2"><label><input type="checkbox" id="inputSearchPalantir"><span>With Palantir Player</span></label></div><div class="btn btn-success" id="addFilter" style="height: fit-content;">✔ Add</div></div>');
        containerFilters.appendChild(filterNamesForm);
        containerFilters.appendChild(filterDetailsForm);
        containerFilters.appendChild(filterPlayersForm); */
        
        // gets the current settings
        const getFilterString = () => {
            let values = [];
            [...containerFilters.querySelectorAll("input")].forEach(elem => {
                values.push({ id: elem.id, checked: elem.checked, value: elem.value });
            });
            return JSON.stringify(values);
        };
        
        let currentModal = null;
        addFilterBtn.addEventListener("click", () => currentModal =  new Modal(containerFilters, () => {}, "Add a lobby search filter"));

        // function to add a filter
        const addFilter = (filterstring, active, id) => {
            let filter = new search.SearchFilter(JSON.parse(filterstring));
            let names = (filter.targetPalantirPresent ? [...filter.names, "Palantir users"] : filter.names).join(", ");
            let visual = [];
            if (names != "") visual.push("🔎 " + names);
            if (!isNaN(filter.targetRound)) visual.push("🔄 " + filter.targetRound + (filter.targetRoundModifier ? filter.targetRoundModifier : ""));
            if (!isNaN(filter.targetScore)) visual.push("📈 " + filter.targetScore + (filter.targetScoreModifier ? filter.targetScoreModifier : ""));
            if (!isNaN(filter.targetCount)) visual.push("👥 " + filter.targetCount + (filter.targetCountModifier ? filter.targetCountModifier : ""));

            // func to remove filter btn and filter
            let remove = () => {
                let added = JSON.parse(localStorage.addedFilters);
                added = added.filter(filter => filter.id != id);
                localStorage.addedFilters = JSON.stringify(added);
            }

            // if nothing was selected
            if (visual.join("") == "") {
                new Toast("No filters set.");
                remove();
                return;
            }

            // create button element
            let filterbutton = elemFromString('<button class="flatUI blue min air" style="margin: .5em">' + visual.join(" & ") + '</button>');

            // add btn before add filter btn
            addFilterBtn.insertAdjacentElement("beforebegin", filterbutton);

            // set filter activation
            if(!active) filterbutton.classList.add("filterDisabled");
            filterbutton.addEventListener("click", () => {
                filterbutton.classList.toggle("filterDisabled");
                let added = JSON.parse(localStorage.addedFilters);
                added.forEach(filter => { if (filter.id == id) filter.active = !filterbutton.classList.contains("filterDisabled") });
                localStorage.addedFilters = JSON.stringify(added);
            });

            filterbutton.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                remove();
                filterbutton.remove();
            });
        }

        // add filter when save is pressed
        containerFilters.querySelector("#addFilter").addEventListener("click", () => {
            let filterstring = getFilterString();
            let id = Date.now();
            localStorage.addedFilters = JSON.stringify([...JSON.parse(localStorage.addedFilters), { active: true, filter: filterstring, id: id }]);
            addFilter(filterstring, true, id);
            currentModal?.close()
        });

        // add saved filters
        JSON.parse(localStorage.addedFilters).forEach(filter => {
            addFilter(filter.filter, filter.active, filter.id);
        });

        // start search on play button
        QS(".button-play").addEventListener("click", () => {
            // if filters enabled
            if (JSON.parse(localStorage.addedFilters).some(filter => filter.active)) search.startFilterSearch();
        });
    },
    startFilterSearch: () => {
        // load and create filters
        let filters = [];
        let humanCriterias = [];
        JSON.parse(localStorage.addedFilters).forEach(filter => {
            if (filter.active) {
                let filterObj = new search.SearchFilter(JSON.parse(filter.filter));
                filters.push(filterObj);
                criteria = [];
                if (filterObj.names.length > 0 || filterObj.targetPalantirPresent) criteria.push("<b>Names:</b> " + (filterObj.targetPalantirPresent ? [...filterObj.names, "Palantir Users"] : filterObj.names).join(", "));
                if (!isNaN(filterObj.targetRound)) criteria.push("<b>Round:</b> " + filterObj.targetRound + (filterObj.targetRoundModifier ? filterObj.targetRoundModifier : ""));
                if (!isNaN(filterObj.targetScore)) criteria.push("<b>Avg Score:</b> " + filterObj.targetScore + (filterObj.targetScoreModifier ? filterObj.targetScoreModifier : ""));
                if (!isNaN(filterObj.targetCount)) criteria.push("<b>Players:</b> " + filterObj.targetCount + (filterObj.targetCountModifier ? filterObj.targetCountModifier : ""));
                if (criteria.length > 0) humanCriterias.push(criteria.join(" & "));
            }
        });
        // create search modal
        let searchParamsHuman = (humanCriterias.join("<br>or<br>") != "" ?
            "Search Criteria:<br>" + humanCriterias.join("<br>or<br>") : "<b>Whoops,</b> You didn't set any filters.");
        let modalCont = elemFromString("<div style='text-align:center'><details><summary style='cursor:pointer; user-select:none''><b>Lobby Search Information</b></summary>While this popup is opened, typo jumps through lobbies and searches for one that matches you filters.<br>Due to skribbl limitations, typo can only join once in two seconds.</details><h4>" + searchParamsHuman + "</h4><span id='skippedPlayers'>Skipped:<br></span><br><h4>Click anywhere out to cancel</h4><div>");
        let modal = new Modal(modalCont, () => {
            search.searchData.searching = false;
            QS("#searchRules")?.remove();
            document.dispatchEvent(newCustomEvent("abortJoin"));
            leaveLobby();
        }, "Searching for filter match:", "40vw", "15em");

        let skippedPlayers = [];

        search.setSearch(() => {
            
            // search rules
            if(!QS("#searchRules")) {
                let rules = document.body.appendChild(elemFromString`<style id="searchRules">
                    #home{ display:flex !important}
                    #game{ display:none !important}
                    #load{ display:none !important}
                </style>`);
            }
            lobbies.lobbyProperties.Players.forEach(p => {
                if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
                    skippedPlayers.push(p.Name);
                    modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr>";
                }
            });
            let lobby = lobbies.lobbyProperties;
            return filters.length <= 0 || filters.some(filter => filter.matchAll(lobby));
        }, () => {
            leaveLobby(true);
        }, () => {
            search.searchData= {
                searching: false,
                check: undefined, proceed: undefined, ended: undefined
            };
            modal.close();
            QS("#searchRules")?.remove();
        });
    },
    searchData: {
        searching: false,
        check: undefined, proceed: undefined, ended: undefined
    },
	setSearch: (check, proceed, ended = () => { }) => {
		if (search.searchData.searching) return;
		search.searchData.searching = true;
		search.searchData.check = check;
		search.searchData.proceed = proceed;
		search.searchData.ended = ended;
	}
}