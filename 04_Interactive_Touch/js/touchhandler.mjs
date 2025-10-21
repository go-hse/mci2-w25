import { hasMethods } from "./utils.mjs"


// Gibt Touch-Events an Widgets weiter

const dblClickDeltaMs = 400;

export function TouchHandler(cnv, dblClickCB) {
    const widgets = [];

    const clickTimestampPerFingerId = {};

    function click(id) {
        const now = new Date();
        if (clickTimestampPerFingerId[id] !== undefined && now - clickTimestampPerFingerId[id] < dblClickDeltaMs) {
            dblClickCB();
        } else {
            clickTimestampPerFingerId[id] = now;
        }

    }

    cnv.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            click(t.identifier);
            widgets.forEach(w => w.isTouched(t.identifier, t.pageX, t.pageY));
        }
    });

    cnv.addEventListener("touchend", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            widgets.forEach(w => w.reset(t.identifier));
        }
    });

    cnv.addEventListener("touchmove", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            widgets.forEach(w => w.move(t.identifier, t.pageX, t.pageY));
        }
    });

    function addTouchWidget(widget) {
        if (hasMethods(widget, ["isTouched", "reset", "move", "draw"])) {
            widgets.push(widget);
        } else {
            console.log("cannot add widget", widget);
        }
    }

    return { addTouchWidget };
}