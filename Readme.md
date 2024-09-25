# skribbltypo
A wise man once said:
> I hate `any`.   
> It's rough and coarse and irritating and it gets everywhere.

So he switched to typescript, and the galaxy was at peace.  

---

This repository is the refactor of the skribbltypo extension, originally written in vanilla javascript.  
It focuses on a solid architecture, maximum modularity and separation of features,
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
├──content        -- content script sources
│   ├──core
│   ├──setups
│   ├──events
│   └──features
├──background     -- background script sources
├──popup          -- popup page sources
│ 
├──api            -- generated api client
└──util           -- utility functions
```

### Content Script
The content script is the main part of the extension, which interacts with the skribbl.io page.  
It has the most complex structure; divided into *core*, *setup*, *events* and *features*.  
- *core* contains services and abstractions that are used throughout the application
- *setup* contains modules that are responsible for setting up dependencies for application
- *events* contains modules that process events on the page
- *features* contains modules that implement specific features on the page

#### Core 
The core module contains the lifecycle class, which is the entrypoint to the content script.  
It manages the different stages and the dependency injection container for the application.

Core also contains abstractions of the feature, event and setup modules, which are implemented in the respective folders.  
Furthermore, there are several services (`*.service.ts) that can be injected by features, events and setups; like the member service or api factory.

#### Setup
A setup module (`*.setup.ts`) consists of a single asynchronous operation and a return value.  
Setups can be injected by features or other setups to express dependencies.  
Setups can be awaited in the activation of a feature, loading the data of the respective setup.  
Setups are singletons; once they are executed, their promise always returns their initial result.  
Setups can also depend on each other, to express a dependency chain.

#### Events
Events are split into *processors* and *listeners* (both in `*.event.ts`).  
An event processor is a class that processes a specific event from the page, and emits data to a central events service.  
Event listeners are the counterpart of event processors and can be injected by features.  
An injected event listener will only return data of their event type.  
Event processors will only start processing when an event listener is injected.

#### Features
Features (both in `*.feature.ts`) are the main part of the application.  
Features can make use of core services, events, setups and reactive svelte components, but must not depend on other features.  
Features are singletons and implement a activate/destroy inteface which indicates start and end of their lifecycle;
furthermore they can be paused via run/freeze (not implemented yet).

#### Svelte Components
Svelte is the framework that is used to build UI in features and setups.  
Additionally, reusable components can be created in the `src/lib` folder.  
Svelte components should be created in their feature/setup module, and should reside in the respective folder.  
Features and Setups should pass themselves(`this`) as a prop to the component, to separate controller and template.  
