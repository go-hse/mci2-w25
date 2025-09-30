export function test() {
    console.log("Test Funktion");
}

export function delByValue(arr, val) {
    if (arr.includes(val)) {
        const idx = arr.indexOf(val);
        const del = arr.splice(idx, 1);
        console.log(`delByValue ${val}:`, arr, del);
    }
}

export function dom(tag, attributes) {
    attributes = attributes || {};
    const namespace = attributes.namespace || "http://www.w3.org/1999/xhtml";
    let node = document.createElementNS(namespace, tag);
    for (let key in attributes) {
        if (key === "events") {
            for (let ev of attributes[key]) {
                for (const event in ev) {
                    node.addEventListener(event, ev[event]);
                }
            }
        } else if (key === "HTML") {
            node.innerHTML = attributes[key];
        } else {
            if (attributes[key])
                node.setAttribute(key, attributes[key]);
        }
    }
    for (let i = 2; i < arguments.length; ++i) {
        let child = arguments[i];
        if (typeof child === "string") {
            child = document.createTextNode(child);
            node.textnode = child;
        }
        node.appendChild(child);
    }
    return node;
}

export function removeAllChildren(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.lastChild);
    }
}


export function svg(parentId, width = 200, height = 200) {
    const namespace = "http://www.w3.org/2000/svg";
    const parent = document.getElementById(parentId);
    const svgElement = dom("svg", { namespace, width, height });
    parent.appendChild(svgElement);

    function circle(cx, cy, r, fill = "white", stroke = "black") {
        svgElement.appendChild(dom("circle", { namespace, cx, cy, r, fill, stroke }));
    }

    return { circle };
}