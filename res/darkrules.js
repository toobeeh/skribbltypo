let sheet = document.createElement("style");
document.querySelector("head").appendChild(sheet);
function acr(rule){sheet.innerHTML += rule;}
acr("html{height: 150%;box-shadow: inset 0 0 0 2000px rgba(0,0,0, 0.4);}");
acr(".loginPanelTitle{background-color: #23272a; border-bottom: none}");
acr(".loginPanelContent{background-color:	#2c2f33;}");
acr("#loginAvatarCustomizeContainer{background:none;border:none;}");
acr("div#accordion>div, .updateInfo {background: none;color: #8c8d8f; border:none;}");
acr(".informationTabs a{color:white}");
acr(".form-control{background:#4f5257;color:white;border:none;}");
acr(".btn-success{background:#171a1c;border:none;}");
acr(".btn-primary{background:	#23272a;border:none;}");
acr(".btn-warning{background:#23272a;border:none;}");
acr(".btn-info{background:#4f5257;border:none;}");
acr("body{color:white;}");
acr("#timer{color:black;}");
acr(".gameHeader, #containerFreespace,#boxChat, #containerChat, #tableBox, .tool, .brushSize {background-color:#2c2f33 !important;}");
acr("#containerGamePlayers .player:nth-child(odd){background:#2c2f33; color:white;}");
acr("#containerGamePlayers .player:nth-child(even){background:#23272a; color:white;}");
