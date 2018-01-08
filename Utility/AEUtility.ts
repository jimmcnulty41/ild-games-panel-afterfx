/// <reference types="types-for-adobe/AfterEffects/2018"/>
/// <reference types="types-for-adobe/shared/ScriptUI"/>

namespace AE {
    export const compEachLayer = (
        comp: CompItem,
        iteratee: (layer: Layer, i?: number) => void
    ) => {
        for (let i = 1; i <= comp.layers.length; ++i) {
            iteratee(comp.layers[i], i);
        }
    };

    export const isFolderItem = (item: Item): item is FolderItem => {
        return item.typeName === "Folder";
    };

    export const isAVLayer = (layer: Layer): layer is AVLayer => {
        return (layer as AVLayer).source !== undefined;
    };

    export const isCompItem = (item: Item | null): item is CompItem => {
        if (item === null) return false;
        return (item as CompItem).numLayers !== undefined;
    };
}

export default AE;
