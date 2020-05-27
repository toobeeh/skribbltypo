## ------- Skribbl Typo Addon -------

(Tipp: Zum Testen von Funktionen auf das Fragezeichen auf der Skribbl-Seite klicken!)

### Funktionen:

*   #### Kommandoeingabe

    Um die verschiedenen Funktionen zu aktivieren, kannst du im Chat Kommandos eingeben.  
    Dazu gibst du einfach den Befehl und am Ende "--" ein, zum Beispiel "help--".  
    Enter musst du nicht drücken.  
    Fast alle Funktionen können aber auch über das Popup eingestellt werden  

*   #### Zurück-Button

    Wenn du zum Beispiel falsch gefüllt hast, kannst du deine Aktionen auf der Leinwand mit dem Zurück-Button in der Werkzeugleiste rückgängig machen.  
    Dabei wird das ganze Bild neu gezeichnet, was etwa zwischen 1 und 5 Sekunden dauern kann. Die Funktion ist also eher für ... "Notfälle".  

    ##### Aktivieren: "enable back--"  
    Deaktivieren: "disable back--"

*   #### Zufallsfarbe

    Wenn du auf den Würfel neben der Farbpalette klickst, wird in einem festgelegten Intervall zwischen 10 und 500 Millisekunden die Farbe des Pinsels zufällig geändert.  
    Dadurch entstehen bunte Striche - für normale Farben einfach wieder eine Farbe auswählen.  
    (Den Hintergrund schnell zu verändern sieht zwar lustig aus, aber kann nerven!)  

    ##### Aktivieren: "enable random--"  
    Deaktivieren: "disable random--"  
    Intervall festlegen: "set random 100--"

*   #### ImageAgent

    Wenn du an der Reihe zu zeichnen bist und ein Wort gewählt hast, erscheinen über dem Chat neue Buttons.  
    Indem du auf "Logo", "Karte" oder "Flagge" klickst, wird eine Internet-Suche nach dem Wort und dem Thema durchgeführt.  
    Das erste Bild aus den Suchergebnissen wird dann direkt in Skribbl als kleine Vorlage unter den Buttons angezeigt.  
    Wenn du auf das Bild klickst, wird das nächste Bild aus den Suchergebnissen angezeigt.  

    Mit "Begriff" wird nur nach dem Begriff gesucht (zB "Italien" statt "Italien Karte").  
    Durch "Eingabe" öffnet sich ein Eingabefeld, in dem du einen eigenen Suchbegriff eingeben kannst (zB "Europakarte").  
    Mit Enter wird die Suche durchgeführt.  

    Die Buttons und das Bild werden automatisch entfernt, wenn du mit Zeichnen fertig bist.

    ##### Aktivieren: "enable agent--"  
    Deaktivieren: "disable agent--"

*   #### Nachrichten-Markierungen

    Deine Nachrichten im Chat können farbig hervorgehoben werden.  

    ##### Aktivieren: "enable markup--"  
    Deaktivieren: "disable markup--"  
    Farbe ändern: "set markup #ffffff--"

    '#ffffff' steht für den Hex-Code der Farbe. Dieser muss aus 6 Stellen bestehen.  
    Du kannst auch andere Personen farbig hervorheben. 'name' steht für den Namen des Spielers.

    ##### Namen hinzufügen: "add vip name--"  
    Namen löschen: "rem vip name--"  
    Namen anzeigen: "show vip--"  
    Alle Namen löschen: "clear vip--"

*   #### Tablet-Druckempfindlichkeit

    Eingabestifte, die Druckempfindlich sind, können die Pinselstärke je nach Druck setzen.  
    Dazu muss dein Stift / Tablet Windows Ink aktiviert haben.  
    Du kannst du Empfindlichkeit von 1 (niedrig) bis 100 (sehr hoch) verstellen.  
    Für genauere Einstellungen verwende deinen Tablet-Driver.  

    ##### Aktivieren: "enable ink--"  
    Deaktivieren: "disable ink--"  
    Empfindlichkeit: "set sens 3--"

    Außerdem kannst du mit den Tasten a und s die Pinselstärke verstellen (7 Stufen). Mit q und w sind die Sprünge größer.
*   #### Eingabe-Überprüfung

    Du kannst überprüfen lassen, ob deine Eingabe im Textfeld zu der Länge des gesuchten Wortes und den bekannten Buchstaben passen.  

    ##### Überprüfung aktivieren: "enable charbar--"  
    Überprüfung deaktivieren: "disable charbar--"

    In dem Feld unter dem Eingabefeld wird mit der Zahl signalisiert, wie viele Buchstaben noch fehlen / zu viel sind  
    Die Farbe zeigt an, ob die Eingabe zu den bekannten Buchstaben passt oder schon zu lange ist.
*   #### Heiligenschein

    Nutzloses Feature. Hol dir einen Ego-Boost.

    ##### Heiligenschein aktivieren: "enable holy--"  
    Heiligenschein deaktivieren: "disable holy--"

*   #### Navigationsbuttons

    Verlasse oder überspringe die aktuelle Lobby durch Klicken auf die Buttons oben rechts.
*   #### Eingabe leeren

    Durch Drücken von "++" im Eingabefenster wird deine aktuelle Eingabe geleert.  
    Du kannst die Kombination (Token) auch ändern, zB zu "#".  
    ACHTUNG: Wenn das Token ein Buchstabe aus "set token" ist, bist du verloren. Für immer.  

    ##### Token ändern: "set token #--"

    Mit ESCAPE wird außerdem die aktuelle Zeichnung gelöscht.