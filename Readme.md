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
> Using hmr page & extension are automatically, but sometimes not reliable.

### Vite custom plugin
In general, the vite crx plugin is used to bundle the extension based on the specified manifest.  
Additionally, this plugin is extended so that all web-accessible-resources are more easily accessible:  
An additional plugin loads all files that are matched by the resource glob patterns, and an additional content
script is generated that injects css variables containing dynamic chrome urls for the resources.

This plugin wraps the crx plugin and is located in ./css-resources.plugin.ts  
During vite build, a temporary file will be added in ./cssgen which contains the generated content script.  
Although it resides in a separate folder, it should be taken care that vite and tsc ignore it by default.
