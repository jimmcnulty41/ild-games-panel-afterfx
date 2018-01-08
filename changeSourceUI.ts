/// <reference types="types-for-adobe/AfterEffects/2018"/>
/// <reference types="types-for-adobe/shared/ScriptUI"/>

// View

// Controller
interface set {
    [item: string]: null;
}

interface layerToSourceMap {
    [layerName: string]: string;
}

const isAVLayer = (layer: Layer): layer is AVLayer => {
    return (layer as AVLayer).source !== undefined;
};

const isCompItem = (item: Item | null): item is CompItem => {
    if (item === null) return false;
    return (item as CompItem).numLayers !== undefined;
};

const layerToCompItem = (layer: Layer): CompItem | null => {
    if (isAVLayer(layer)) {
        if (isCompItem(layer.source)) {
            return layer.source;
        }
    }
    return null;
};

const getSourcesUsed = (comp: CompItem): set => {
    let sourceSet: set = {};
    for (let i = 1; i <= comp.layers.length; ++i) {
        let layerSourceComp = layerToCompItem(comp.layers[i]);
        if (layerSourceComp === null) continue;
        for (let j = 1; j <= layerSourceComp.layers.length; ++j) {
            sourceSet[layerSourceComp.layers[j].name] = null;
        }
    }
    return sourceSet;
};

// Source
clearOutput();

// If 'this' is not a panel, we create and show a new window, then
// house a new panel within the window
const unsafeGetPanel = (thisObj: Window | Panel): Panel | Window => {
    if (thisObj instanceof Panel) {
        return thisObj;
    } else {
        const window = new Window("palette", "My Tools", [100, 100, 300, 300]);
        (thisObj as any)["customWindow"] = window;
        window.add("panel");
        return window.children[0] as Panel;
    }
};

let panel = unsafeGetPanel(this);
panel.orientation = "row";
panel.add("statictext", undefined, "sup");
panel.add("edittext", undefined, "Sup");
writeLn(this["customWindow"].show());

if (isCompItem(app.project.activeItem)) {
    const sourcesUsed = getSourcesUsed(app.project.activeItem);
}
