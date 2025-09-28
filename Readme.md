# skribbltypo
A wise man once said:
> I hate `any`.   
> It's rough and coarse and irritating and it gets everywhere.

So he switched to typescript, and the galaxy was at peace.  

---

This repository is the refactor of the skribbltypo extension, originally written in vanilla javascript.  
It builds a custom framework to implement the features of typo, focussed on a solid architecture, maximum modularity and separation of features,
and clean code style via dependency injection and reactive components.  
The node project is based on typescript in combination with the vite compiler, 
using the plugins svelte for ui component designs and crx as a browser extension bundler.  

## Build & run
1. Clone the repository
2. Run `npm install` in the root directory
3. Run `npm run dev` in the root directory
> Alternatively, run `npm run dev-hmr` for hot module reloading, 
> but this is likely subject to race conditions on the page due to inperformant content script injection.
4. Load the extension in your browser via the `dist` directory as an unpacked extension.
5. Open skribbl.io; every time the bundle is recompiled, the extension & page have to be reloaded
> Using hmr, the page & extension are automatically reloaded, but sometimes not reliable.

### Vite custom plugin
In general, the vite crx plugin is used to bundle the extension based on the specified manifest.  
Additionally, this plugin is extended so that all web-accessible-resources are more easily accessible:  
An additional plugin loads all files that are matched by the resource glob patterns, and an additional content
script is generated that injects css variables containing dynamic chrome urls for the resources.

This plugin wraps the crx plugin and is located in ./css-resources.plugin.ts  
During vite build, a temporary file will be added in ./cssgen which contains the generated content script.  
Although it resides in a separate folder, it should be taken care that vite and tsc ignore it by default.

## Architecture
The project is divided into folders for the type of extension script and utilities:  
```
src
├──app        -- application sources
│   ├──core
│   ├──services
│   ├──setups
│   ├──events
│   └──features
├──runtime        -- implementation for the current browser context runtime and specific features
│   ├──page       -- runtime and entrypoint for userscript environment
│   └──extension  -- runtime, background page and popup for extension environment
│ 
├──api            -- generated api client
├──worker         -- background worker implementations
├──signalr        -- generated signalr client
├──lib            -- reusable svelte components
└──util           -- utility functions
```

### Application
The app.ts is the entry point of the application, which interacts with the skribbl.io page.  
For clean development, the architecture is divided into *core*, *setup*, *services*, *events* and *features*.  
- *core* contains services and abstractions that are used throughout the application
- *setup* contains modules that are responsible for setting up dependencies for the application
- *services* contains services that can establish shared state and functionality for features
- *events* contains modules that process events on the page
- *features* contains modules that implement specific features on the page

#### Core 
The core module contains the extension container class, which is the entrypoint to the content script.  
It manages the dependency injection container for the application and is the central point for configuration.

Core also contains abstractions of the feature, event and setup modules, which are implemented in the respective folders.  
Furthermore, there are a few services that are vital to the abstract classes:
- EventService acts as a central pipe between event processors and listeners
- LoggerService logs formatted messages to the console

#### Services
Services (`*.service.ts`) are modules that follow no specific lifecycle or purpose, and can be injected anywhere in the application.  
Services can be either singleton or scoped; any service that is nt tied to a core functionality should reside in the services folder.  

In contrast to features, services may depend on other services and can be injected to features.  
Any functionality that can be reused should be implemented as service instead of a feature.

#### Setup
A setup module (`*.setup.ts`) consists of a single asynchronous operation and a return value.  
Setups can be injected by features or other setups to express a dependency chain.
Setups can be awaited in the activation of a feature, loading the data of the respective setup.  
Setups are singletons; once they are executed, their promise always returns their initial result.  
Examples for setups are the panel setup, which creates the start page panels used by several features, 
or the elements setup which queries the most important elements from the page and provides them to features.

#### Events
Events are split into *processors* and *listeners* (both in `*.event.ts`).  
An event processor is a class that processes a specific event from the page, and emits data to a central events service.  
Event listeners are the counterpart of event processors and can be injected by features.  
An injected event listener will only return data of their event type.  
Event processors will only start processing when an event listener is injected.

#### Features
Features (`*.feature.ts`) are the main part of the application.  
Features can make use of core services, events, setups and reactive svelte components, but must not depend on other features.  
Features are singletons and implement an activate/destroy interface which indicates start and end of their lifecycle;
furthermore they can be paused via run/freeze (not implemented yet).  
Features are instantiated as soon as they are registered; to delay activation further, setups can be used.

When other features rely on a feature or state of a feature, the feature should implement the required state and functions in a separate service.  
The service can then be bound to the feature activation state by implementing the `boundService` interface and listing it in the feature's "boundServices",  
which will tie init/reset functions of the service to the feature state.  
This prevents tight coupling of features and allows for better separation of concerns, as well as it avoids injecting features into other features.  
These services may reside in the folder of their associated feature.  
A service must only be bound to one feature to prevent illegal states.

#### Svelte Components
Svelte is the framework that is used to build UI in features and setups.  
Additionally, reusable components can be created in the `src/lib` folder.  
Svelte components should be created in their feature/setup module, and should reside in the respective folder.  
Features and Setups should pass themselves (`this`) as a prop to the component, to separate controller and template, 
and execute as few code as possible in the svelte script tag.  

## UX
### Toasts
Toasts should be used at every action the user takes, where the result might not be immediately visible.  
Toasts should be used in feature classes, never in a service.  
If a service errors, it should throw an error. Features should catch the error either using conditions, try-catch or rxjs catch operator.  
The feature should then log the error to have detailed typo logs, throw the error to have a stack trace available and then reject the toast with a message.  

## Logging
Thorough logging is essential for debugging, especially when the extension is already deployed.  
In general, adding logging right during development is favorable, but at the very least when it comes to debugging 
and logging is added to debug a specific issue, the logging should be meaningful so that it can be used for future debugging and be kept in the codebase.  
Errors should be logged for illegal states where a recovery is not possible;
warnings in states that do not necessarily lead to user experience issues;
information for any action that is executed/initiated by a feature or service;
and debug to dump data for low-level debugging.

# Development
This extension is under active development and maintenance.  
The following sections describe the development process and the features of the custom extension framework.

## Contribution
Contributions are welcome!  
Contributions need to strictly follow and make use of the extension architecture.

## Framework Features
The framework provides many features to simplify the development of new game features,   
making the extension as modular as possible and avoiding code duplication.

### Features
Features are isolated modules that implement a specific functionality for the extension.  
For information about feature architecture, refer to the section above.  
Features need to be registered in the `content.ts` entrypoint and will automatically be accessible to the user.  
The framework will integrate an information section, custom setting section, and hotkey/setting customization as described below.  
The framework also manages lifecycle and lets the user toggle it on/off.

### Feature settings
Each feature is listed in the extension settings, where it can also be toggled on/off.  
Feature can provide additional information or a custom management component.  

To achieve this, svelte templates need to be created.  
These components can be integrated by overriding the `featureInfoComponent` or `featureManagementComponent` getters in the feature class.

### Skribbl Game Events
The framework provides many different event listeners that parse events from skribbl to a reactive stream.  
For a more detailed description, refer to the architecture section above.  

To use events, the event listener of the desired event can be simply injected to the feature:
````ts
@inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener;
````

#### Canvas & Chatbox events
The canvas anc chatbox are the two main interaction interfaces with the game. To provide more fine-grained tuning of listeners and avoiding interferences between features, following API is implemented:
- prioritized canvas events: 
A setup that lets features add high-prioritized event handlers with execution order of pre/post and during draw processing
- prioritized chatbox events: 
A setup that lets features add high-prioritized event handlers
- chat box locking: 
A mechanism in the chat service. If multiple features modify the chatbox content, a feature may acquire a lock to prevent other features from replacing the content.  
Features can also provide a filter lambda, which cancels default/propagation of the event at all - this should be handled with care so that not unlocking events are canceled.

### Commands
Commands provide a way of execution actions of features from the chat input.  
Typo implements its own command parsing mechanism.  
This mechanism is probably a bit awkward way too overengineered for its purpose, but .. i just felt like it.

#### Interpretables
The command parsing is based on the concept of interpretable chains.  
An interpretable is an object that follows the interpretable interface and implements a function to parse a string into data,
and a function that will be executed on the resulting data.  
Each interpretable also receives a context and data from a previous interpretable.

In the interpret function, the interpretable will parse the arguments string and create new data using the context and its input data.  
It may throw an error of instance InterpretableError if the parsing was attempted but failed, or return null if the interpretation of the arguments was refused.

In the execution function, the interpretable executes its logic on the context and the output data of the interpret function.
The execution has to return an instance of InterpretationResult, containing an error or success, and optionally another interpretable.

#### Interpretable Chains  
based on the result of the execute function, interpretables can be chained together.
In the `commands.service.ts`, the processing of interpretables in defined.  
First, the interpretable is prompted to interpret the arguments. If it refuses (null), null is returned and the chain ends. 
If it fails (InterpretableError), the error is returned as chain result the chain ends.  
If the interpretation is successful, the interpretable is executed.

If the result of the execution holds another interpretable, the same procedure is repeated with the new interpretable on the result data of the last interpretable.

#### Commands and Parameters
Commands and parameters are just a concrete implementation of interpretables.  
A command essentially consists of a interpretation chain: An interpretable which parses the command identification, and an amount
of interpretables which interpret the remaining arguments.  
This way, the arguments are parsed bit by bit and data is cumulated by each argument in the chain.  
Due to the strict typing of the interpretables, the argument at the end of the chain can execute an action 
on the exact cumulated type of the previous arguments.

Due to the awkward nature of constructing commands by callback layering, a command builder is provided, which wraps the
construction process in a builder pattern.

An example command definition looks like this:
```typescript
new ExtensionCommand("add", "add", this, "Add Numbers", "Adds two numbers and outputs the result")
  .withParameters((params) => params
    .addParam(new NumericCommandParameter("a", "The first number", (a) => ({ a })))
    .addParam(new NumericCommandParameter("b", "The second number", (b) => ({ b })))
    .run(async (result, command) => {
      return new InterpretableSuccess(command, `The sum is ${result.a + result.b}`);
    }));
```

### Hotkeys
Hotkeys are a combination of keys that trigger an action.  

Hotkeys are supported by a core service that is bound at DI container creation.  
The feature base class provides a function to register a hotkey.  
When this is used, the hotkey will be integrated in the settings page and can be customized by the user.

An example hotkey registration in a feature class may look like this:
```typescript
private readonly _startZoomHotkey = this.useHotkey(new HotkeyAction(
  "start_zoom",
  "Start Zoom",
  "While pressed, a click on the canvas will start zooming",
  this,
  () => this._zoomListenToggle$.next(true),
  true,
  ["ControlLeft"],
  () => this._zoomListenToggle$.next(false)
));
```
It consists of two parts:
- creation of a hotkey instance using `new HotkeyAction`, where the hotkey defaults are configured
- registration to the hotkey management service via `this.useHotkey`

### Logging
Loggers provide a rich debugging option for extension development.  

The logger is available in all DI scopes via its factory `loggerFactory`.  
The factory takes an instance as argument, which is used to identify the logger for customization of log levels.  
It connects to a logging service which collects logs, and a logger feature which implements the user interface for log management.

Each implementation of the base feature class has access to a logger via `this._logger`.  
There are gout log levels available:
- debug
- info
- warn
- error

The log level of each feature can be set in the logger settings.  
Logs will be available in the console, or exported as text or json.

### Settings
Settings are an easy way to persist feature customization.

Settings store data in plain text (JSON) in the extension storage, via a interface to the background script.  
The setting class provides a typed interface to save and retrieve settings, as well as reactive properties (svelte, rxjs).  

Settings are not bound to DI scope and can be used anywhere.
When a setting should be available in the integrated feature settings, it has to be registered in the feature class.  
For this, a subtype of the extension setting class has to be used, which implements a svelte template for a certain setting data type.  
Currently, the BooleanSetting and NumericSetting are available to use like that:

```typescript
private readonly _enableOnlyWhenDrawingSetting = this.useSetting(
  new BooleanExtensionSetting("trigger_require_drawing", true, this)
      .withName("Zoom Only When Drawing")
      .withDescription("Only allow start zooming with the hotkey when you're currently drawing"));
```
the registration consists of two parts:
- creation of a UI-enabled setting instance using `new BooleanExtensionSetting`, where the setting defaults are configured
- registration to the feature via `this.useSetting`

### Draw Mods and Tools

### Tooltips
Tooltips can be used to show information text when the user hovers over elements.  

Tooltips are supported by a core service that is bound at DI container creation, and a feature that can be toggled by the user.  
The feature base class provides a svelte action to register a tooltip to the service.  
In a svelte component, using the feature reference, the tooltip can be registered by calling the action with the tooltip params.

Example:
```sveltehtml
<img alt="Exit Lobby" on:click={() => feature.exitLobby()} use:feature.createTooltip={{title: "Exit Lobby", lock: "Y"}} />
```

Features that use components from the library can't directly access their svelte template.  
As a workaround, the template may take a reference to the feature's svelte action 
and implement its own tooltip registration in the reusable template.  
An example for this is the IconButton component.

### Workers

Workers are a way to execute heavy tasks in the background in separate threads.
Typo implements a small framework to create a typed interface to access workers.  
Also, due to their separate environment and the concern that typo needs to be compiled to userscript as well, it workers are built separately from the main bundle.

#### Implementing a worker
A worker consists of a worker and parent interface. 
The worker defines the functions that can be called from the parent, and the parent defines notifications from the worker to the parent.  
Workers have to reside in their own file which will be executed in a separate thread.  
They need to create an instance of TypedWorker, which will automatically handle message communication with the parent.
The parent can ultimately spawn a worker by creating an instance of type TypedWorkerExecutor.  
From this point on, every data exchange happens through strongly typed interfaces.

#### Building a worker
Workers are built separately from the main bundle.  
Workers have to reside in `src/worker` and need to end with `.worker.ts`.  
To build all workers, run `npm run generate:workers`.  
This will compile the worker's js and generate a worker definition file in `src/api/worker`.
This file contains the base64 encoded worker js, which can be easily imported in the parent to spawn the worker.  
The workers.ts file is ignored by git to avoid binary commits. However, a type definition file `workers.d.ts` is generated as well to be committed.
