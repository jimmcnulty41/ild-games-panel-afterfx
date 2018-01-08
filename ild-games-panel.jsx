"use strict";
/// <reference types="types-for-adobe/AfterEffects/2018"/>
/// <reference types="types-for-adobe/shared/ScriptUI"/>
var isAVLayer = function (layer) {
    return layer.source !== undefined;
};
var isCompItem = function (item) {
    if (item === null)
        return false;
    return item.numLayers !== undefined;
};
var layerToCompItem = function (layer) {
    if (isAVLayer(layer)) {
        if (isCompItem(layer.source)) {
            return layer.source;
        }
    }
    return null;
};
var getSourcesUsed = function (comp) {
    var sourceSet = {};
    for (var i = 1; i <= comp.layers.length; ++i) {
        var layerSourceComp = layerToCompItem(comp.layers[i]);
        if (layerSourceComp === null)
            continue;
        for (var j = 1; j <= layerSourceComp.layers.length; ++j) {
            sourceSet[layerSourceComp.layers[j].name] = null;
        }
    }
    return sourceSet;
};
// Source
clearOutput();
// If 'this' is not a panel, we create and show a new window, then
// house a new panel within the window
var unsafeGetPanel = function (thisObj) {
    if (thisObj instanceof Panel) {
        return thisObj;
    }
    else {
        var window = new Window("palette", "My Tools", [100, 100, 300, 300]);
        thisObj["customWindow"] = window;
        window.add("panel");
        return window.children[0];
    }
};
var panel = unsafeGetPanel(this);
panel.orientation = "row";
panel.add("statictext", undefined, "sup");
panel.add("edittext", undefined, "Sup");
writeLn(this["customWindow"].show());
if (isCompItem(app.project.activeItem)) {
    var sourcesUsed = getSourcesUsed(app.project.activeItem);
}
