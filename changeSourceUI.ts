/// <reference types="types-for-adobe/AfterEffects/2018"/>
/// <reference types="types-for-adobe/shared/ScriptUI"/>

import AE from "./Utility/AEUtility";

// Utility
const listboxItemsFromList = (list: string[]): DomElement[] => {
    let listboxItems: DomElement[] = [];
    for (let item of list) {
        listboxItems.push({
            type: "item",
            attributes: {
                text: item
            },

            children: []
        });
    }
    return listboxItems;
};

const sourceFolderName = "Sources";

// Controller
function oldestAncestor(item: Item): Item {
    if (item.parentFolder.name === sourceFolderName) {
        return item;
    } else {
        return oldestAncestor(item.parentFolder);
    }
}

const getCurrentFileSource = (comp: CompItem): string => {
    let i = 1;
    while (!AE.isAVLayer(comp.layers[i])) {
        ++i;
    }
    return oldestAncestor((comp.layers[i] as AVLayer).source).name;
};

function getAllSources(
    folder: FolderItem = app.project.rootFolder
): string[] | null {
    if (folder.name === sourceFolderName) {
        let sources = [];
        for (let i = 1; i <= folder.numItems; ++i) {
            sources.push(folder.item(i).name);
        }
        return sources;
    } else {
        for (let i = 1; i <= folder.numItems; ++i) {
            let item = folder.item(i);
            if (AE.isFolderItem(item)) {
                let sources = getAllSources(item);
                if (sources !== null) {
                    return sources;
                }
            }
        }
        return null;
    }
}

interface State {
    currentSelectedSource?: ListItem;
    newSelectedSource?: ListItem;
}

// Source
const CurrentSourceMappingGroup = (): DomElement => {
    if (AE.isCompItem(app.project.activeItem)) {
        return {
            type: "group",
            attributes: {},
            children: [
                {
                    type: "statictext",
                    attributes: {
                        text: getCurrentFileSource(app.project.activeItem)
                    },
                    children: []
                },
                {
                    type: "listbox",
                    attributes: {
                        onChange: function(): void {
                            state.newSelectedSource = this.selection;
                        }
                    },
                    children: listboxItemsFromList(getAllSources() || [])
                },
                {
                    type: "button",
                    attributes: {
                        text: "Change Source",
                        onClick: function(): void {
                            alert(typeof state);
                        }
                    },
                    children: []
                }
            ]
        };
    }
    throw new Error("no comp selected");
};

interface Attributes {
    [attr: string]: any;
}
// Any callbacks defined must not use arrow functions as
// they will rely on the 'this' object
interface DomElement {
    type: "button" | "group" | "listbox" | "item" | "statictext";
    attributes: Attributes;
    children: DomElement[];
}

const applyAttributes = (control: any, attributes: Attributes) => {
    for (let key in attributes) {
        control[key] = attributes[key];
    }
};

const dom = (thisObj: any, elSpec: DomElement) => {
    applyAttributes(thisObj, elSpec.attributes);
    switch (elSpec.type) {
        case "group":
        case "listbox":
            for (let i = 0; i < elSpec.children.length; ++i) {
                let type = elSpec.children[i].type;
                thisObj.add(type);
                dom(thisObj.children[i], elSpec.children[i]);
            }
            break;
    }
};

/* Build UI */
const buildUI = (thisObj: _Control) => {
    let windowTitle = "ILD Games Tools";
    let win =
        thisObj instanceof Panel ? thisObj : new Window("palette", windowTitle);
    win.spacing = 12;
    win.margins = 4;
    dom(win, {
        type: "group",
        attributes: {
            margins: 20
        },
        children: [CurrentSourceMappingGroup()]
    });

    win.layout.layout();

    return win;
};

let state: State = {
    currentSelectedSource: undefined,
    newSelectedSource: undefined
};

clearOutput();
// Show the Panel
var win = buildUI(this);
if (win.toString() == "[object Panel]") {
    win;
} else {
    win.show();
}
