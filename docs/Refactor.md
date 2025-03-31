# Typo Refactor Planning

Before the typo refactor with TS/Svelte can begin, the current extension should be examinated and based on the findings, the new architecture can be designed.

## Typo Feature Classification

Typo features should be grouped by their type (how the user percieves them) and their internal details.  
The results help to find shared needs and conctruct an interface that is able to register features and provide them with all necessary dependencies.

Classification types:
- *PRE_LOAD* Code before page load
- *ON_LOAD* Code on page load
- *STAT_UI* Has static UI element
- *DYNC_UI* Adds UI element dynamically
- *TYPO_EVT* Needs event listeners for typo-accessible skribbl events
- *SKRB_EVT* Needs event listeners for skribbl-internal events
- *PATCH* Needs patched game besides events
- *API* Needs typo API
- *SOCKET* Needs typo socket
- *AUTH* Needs typo authentication
- *STATE* Needs information to the current state (playing, drawing, lobby state,..)


### 🖼️ Solely UI
Features that solely modify the user interface of skribbl.

#### 🖼️ Sprites
show sprites of players in lobbies and on the user landing avatar
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* set landing sprites
- [x] *STAT_UI* landing sprites
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [x] *API* sprite list
- [x] *SOCKET* lobby sprite data
- [ ] *AUTH*
- [x] *STATE* current lobby

#### 🖼️ Scenes
show scenes of players in lobbies and on the user landing avatar
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* set landing scenes
- [x] *STAT_UI* landing scenes
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* lobby join
- [ ] *PATCH*
- [x] *API* scene list
- [x] *SOCKET* lobby scene data
- [ ] *AUTH*
- [x] *STATE* current lobby

#### 🖼️ Typo News Box
display typo news and hints on the landing page
- [x] *PRE_LOAD* added element in patcher
- [ ] *ON_LOAD*
- [x] *STAT_UI* news box
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖼️ Typo User account info
display stats like bubbles and drops on the landing page
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* when doc ready show connection hint
- [x] *STAT_UI* info box
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [x] *SOCKET* when user connected
- [x] *AUTH* user properties
- [ ] *STATE*


### 🔢 Solely Code
Features that only ecexute code in tha background (eg via eventhandlers) with no UI modification.

#### 🔢 Patcher
injects a patches game js instead of the original one
- [x] *PRE_LOAD* inject patched game.js
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🔢 Commands
listen for chat input and execute actions when a command name matches; integrates with feature toggles
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* event listener for chat input
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* some commands

#### 🔢 Zoom Draw
zoom in the canvas while drawing for more precision
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* add listeners for trigger
- [ ] *STAT_UI*
- [x] *DYNC_UI* minimal, hint that mode active
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* only when user drawing

#### 🔢 Straight Lines
allow the user to draw straight lines by clicking two points on the canvas
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners for trigger
- [ ] *STAT_UI*
- [x] *DYNC_UI* minimal, hint that mode active
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* only when user drawing

#### 🔢 Typo Pressure
allow the user to draw in full size range with pressure, instead range depeninding on selected skribbl pen size
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD* init listeners for trigger
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* i thiiiink..? handled in game patch
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🔢 Guess Check
previously "Char count" / check if the word in the chat box matches the given hints and signalize with color
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners for trigger
- [ ] *STAT_UI*
- [x] *DYNC_UI*  minimal, color change some text
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* only when not drawing

#### 🔢 Alt Reveal IDs
reveal player IDs on alt key
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners for trigger
- [ ] *STAT_UI*
- [x] *DYNC_UI*  minimal, show id in playerlist
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* only when not drawing

#### 🔢 Lobby data connection
send the current lobby properties to palantir
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* listeners for lobby updates
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [x] *TYPO_EVT* lobby leave
- [x] *SKRB_EVT* lobby join
- [ ] *PATCH*
- [ ] *API*
- [x] *SOCKET* send lobby data
- [x] *AUTH* user needs to log in
- [x] *STATE* whether currently playing or not

#### 🔢 Chat recall
navigate and recall earlier chat input with the arrow keys
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🔢 TAB to focus chat
focus chat input anytime when TAB is pressed
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* only if in lobby

#### 🔢 Image Completed Listener
Process data when an image is finished (commands, image, drawer)
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [x] *TYPO_EVT* listen for drawing finished event
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🔢 Commands Listener
Process draw commands and handle clear, undo etc
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* draw commands, undo log
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🔢 Lobby Listener
Process data when a lobby is joined or leaved
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [x] *TYPO_EVT* lobby leave event
- [x] *SKRB_EVT* lobby join event
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*


### 🖌️ Skribbl Features
Features that both include a user interface visible to the user, and perform actions when executed.
More closely related to vanilla skribbl than to typo/palantir.

#### 🖌️ Image Save
save, download, gif, cloud
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init UI
- [x] *STAT_UI* button to open popout
- [x] *DYNC_UI* feature popout
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [x] *SOCKET* save to cloud
- [x] *AUTH* save to cloud
- [x] *STATE* image properties, draw commands

#### 🖌️ Image Lab
tools to save and recall drawing process on skribbl, and to load external images
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init UI
- [x] *STAT_UI* button to open popout
- [x] *DYNC_UI* feature popout
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Brush Lab
tools to create various effects while drawing
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* event listener to open feature popup
- [ ] *STAT_UI*
- [x] *DYNC_UI* feature popup
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* add feature tool icon
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Themes
load and create custom css to style skribbl
- [x] *PRE_LOAD* load current theme
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* button to open feature popup
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [x] *API* load and share themes
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Lobby Navigation & Filter
buttons to navigate/exit lobbies, and buttons to start a lobby search
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui and listeners
- [x] *STAT_UI* filter list
- [x] *DYNC_UI* create filter popup
- [x] *TYPO_EVT* lobby left
- [x] *SKRB_EVT* lobby joined
- [x] *PATCH* exit lobbies
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* check lobby properties

#### 🖌️ Color Tools
Picker and Pipette tools
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* feature buttons
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* custom colors
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Fullscreen
quick-toggle to enter/leave fullscreen mode
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* feature button
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Challenges
modify UI to make drawing/guessing harder
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui and listeners
- [x] *STAT_UI* button to open feature popout
- [x] *DYNC_UI* feature popout
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* if in lobby or guessed

#### 🖌️ Image Agent
show a template image for the current word
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* add listeners
- [x] *STAT_UI* image agent ui
- [ ] *DYNC_UI*
- [x] *TYPO_EVT* drawer change event
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [x] *STATE* if user currently drawing

#### 🖌️ Quick React
show a popout when ctrl is pressed to execute quick actions with the arrow keys
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Practice
enable free draw without lobby connection
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* add listeners
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* support for free draw
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Chat Discord Format
when chat text is selected, show a popout to copy the text selection formatted as discord code block
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [x] *DYNC_UI* popout when text selected
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Open user profile via message name
add the possibility to open an user's profile by clicking their name in the chat
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* add listeners
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* add metadata to messages
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🖌️ Color palettes
enable custom colors in the color toolbar
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* custom color support
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*
- 
#### 🖌️ Drawing choose time bar
a bar visualizing remaining time to choose a word
- [ ] *PRE_LOAD*
- [ ] *ON_LOAD*
- [ ] *STAT_UI*
- [x] *DYNC_UI*
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT*
- [ ] *PATCH* custom color support
- [ ] *API*
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*


### 🧩 Typo Features
Features that both include a user interface visible to the user, and perform actions when executed.
More closely related to typo/palantir than to vanilla skribbl.

#### 🧩 Cloud
save images from lobbies in the cloud and provide a cloud browser
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* popup button
- [x] *DYNC_UI* popup
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* save images in the cloud on finished event
- [ ] *PATCH*
- [x] *API* load images
- [ ] *SOCKET*
- [x] *AUTH*
- [x] *STATE* image properties when saving

#### 🧩 Emojis
convert emoji codes in the chat to emojis and provide an emoji picker
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [x] *DYNC_UI* emoji picker
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [x] *API* load emojis
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*

#### 🧩 Awards
view an award picker, show award animations and badges
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* award picker button
- [x] *DYNC_UI* award picker, award badges in playerlist, award badges in chat
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* drawing finished/started
- [x] *PATCH* chat message identification
- [x] *API* load awards
- [x] *SOCKET* get award notification
- [x] *AUTH* load user awards
- [x] *STATE* if user is drawing, link image with award

#### 🧩 Lobby List
show a list of players on connected servers to join
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* players list
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [x] *PATCH* join lobby without reload
- [ ] *API*
- [x] *SOCKET* active lobbies updates
- [x] *AUTH* user connected servers
- [ ] *STATE*

#### 🧩 Sprite Cabin
sprite picker and combo dragndrop for combo building
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* cabin element
- [x] *DYNC_UI* sprite picker
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [x] *API* load and use sprites
- [ ] *SOCKET*
- [x] *AUTH* auth with api
- [ ] *STATE*

#### 🧩 Image Post
post images directly to a connected server
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init ui
- [x] *STAT_UI* button to open popout
- [x] *DYNC_UI* server/image picker popout
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* drawing finished, push history
- [ ] *PATCH*
- [x] *API* load image posts
- [ ] *SOCKET*
- [x] *AUTH* api auth
- [x] *STATE* image properties

#### 🧩 Drops
show drops, show stats and result
- [ ] *PRE_LOAD*
- [x] *ON_LOAD* init listeners
- [ ] *STAT_UI*
- [x] *DYNC_UI* drop element, statistics
- [ ] *TYPO_EVT*
- [x] *SKRB_EVT* lobby join/leave
- [ ] *PATCH*
- [x] *API* load drops
- [x] *SOCKET* catch drops, stat and result events
- [x] *AUTH* auth with socket
- [ ] *STATE*

#### 🧩 Typo login
log in to typo via redirect auth
- [x] *PRE_LOAD* check if auth code present / load auth from background script
- [x] *ON_LOAD* init button
- [x] *STAT_UI* login/logout button
- [ ] *DYNC_UI*
- [ ] *TYPO_EVT*
- [ ] *SKRB_EVT*
- [ ] *PATCH*
- [x] *API* load member
- [ ] *SOCKET*
- [ ] *AUTH*
- [ ] *STATE*


## New Typo Architecture

Based on the feature dependency analysis, it can be derived that most of the features are heavily dependent on events that are trivially or more complex to detect.  
Further, many features can be disabled/frozen unless the game is in a certain state to save performance and API load.

Most features need a setup phase for an UI element that they keep throughout their lifecycle.  
This is in most cases either a button when the main feature element is accessible through a popup/out, or a larger interface if it represents the whole feature.  
This setup should happen after the DOM is loaded, so that the respective anchor is already present.  
Alternatively, the setup can be run already while *building* the DOM, as soon as the anchor has been added.  
This has the benefit that the user sees loading spinners/hints instead of elements popping up.

Fewer features need to init already at page load as early as possible - these are pure code runs and contain no user interface.

### Core Architecture Considerations

The extension should have a single entrypoint file.  
In this file, as the parent module of all, the lifecycle events should be managed - as described page load, DOM load, et cetera. This lifecycle module acts as hook to initialize or run functions of other modules.

The extension features should be implemented as individual classes, implementing interfaces of a base feature class.  
Feature classes have to register in a feature registry module that cenalizes the feature activation and lifetime, and manages services that the features depend on.  
Central to the features will also be an events module, which captures all events that may be used by features and preprocesses data to a easily consumable state for the features.

Key to an efficient and solid implementation of this structure is type safety (TS), reactive programming (RXJS, Svelte) and dependency injection (tsyringe).

## Core Architecture Modules
This section lists the tasks and implementation possibilities of the mentioned core modules.

### Lifecycle Module
The lifecycle module is lightweight and basically wraps DOM events to event listeners.  
It should provide hooks for:
- Page load
- (DOM node added during initial page load)
- DOM load

### Events Module
The events module is a central part of the extension.
It should be initialized on DOM load and pipe all captured events through a single RXJS pipe.

The events module should contain of one injectable service class which provides the central RXJS pipe and functions to subscribe to different types of event.
The individual event preprocessors should each reside in an own class and are injectable themselves. They inject the events service, have an individual implementation of capturing their event, and finally write their event to the central event pipe.

On the other side, for receiving events, there is one generic injectable event listener class. It can be injected in any depending service and emits all events of the subscribed generic type.  
When this is implemented, it should also be considered that when a feature is frozen or disabled, the event listener gets paused. This can be done either by adding hooks inside the feature omplementation, or by injecting the feature itself into the injected event listener, which can filter events based on the injected feature state.

### Feature Registry Module

The feature registry acts as the dependency injection container for typo.  
Features are registered similar to adding services to a dependency container.  
The feature registry also provides the events service, as well as other vital services as the logger, API factory, authentication service, and socket service.

Furthermore, the feature registry should invoke lifecycle events of the features like on page load or DOM load.

## Feature Modules

Feature modules contain the individual typo features, organized in separate classes. The feature list from the classification will be largely applicable for the separation of the features.

### Feature lifecycle

Features should provide the possibility to be activated and destroyed. Activation contains initialization from the very begin, and destroyal means to remove the feature completely from the DOM and cut ties from events. Activate and destroy are controlled by the user feature selection, activation is additionally called in the init phase of the features (Page Load of the lifecycle module).

Beside these hard resets, a feature should be able to freeze and run.
This is solely to pause a feature while it is not needed - like the image agent when the player is actually not playing.  
Freeze and run is optional - in background features or features where freezing brings no advantage, it can be skipped.  
If a feature implements freeze and run, it has to provide a rxjs pipe factory that can be applied to the global event pipe, which emits either true, false or undefined. This will be used by the feature registry, which then freezes or runs the feature depending on the output.  
While the feature is frozen, it will not receive any events.

### Feature UI

Features should use the Svelte framework to implement their UI.
Features should reside in their own folder, with a feature typescript class file, and svelte components.  
The svelte components should take the feature class as input parameter, and use its methods or stores:
```html
<script lang="ts">
    export let feature: FeatureClass;
    
    const { state } = feature;    
</script>

<div {#if ($state)} >
    <input type="button" on:click={feature.change()}>
</div>
```
