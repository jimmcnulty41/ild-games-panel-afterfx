export const writeObjKeys = (obj: any) => {
    let str = "";
    for (let key in obj) {
        str = [str.split(","), key + " = " + typeof obj[key]].join("\n");
    }
    alert(str);
};
