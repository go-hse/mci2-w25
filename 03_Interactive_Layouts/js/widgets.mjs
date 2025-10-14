import { Item } from "./items.mjs";
import { drawButton } from "./buttonDraw.mjs";
import { drawCheckbox } from "./checkboxDraw.mjs";
/*
function Widget() {
    let identifier, active;
    function isTouched(id, x, y) { }
    function reset(id) { }
    function move(id, x, y) { }
    function draw() { }
    return { isTouched, reset, move };
}
*/

const BorderRatio = 0.2;

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function ButtonBase(ctx, callback, drawFunc) {
    let identifier, active, radius;

    const item = Item();

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);
        radius = nw < nh ? nw / 2 : nh / 2;
    }

    function draw() {
        const { x, y, width, height } = item.get();
        const border = width < height ? width * BorderRatio : height * BorderRatio;

        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, width, height);

        drawFunc(ctx, x, y, width, height, border, active);
    }

    function isTouched(id, tx, ty) {
        active = item.hit(tx, ty);
        if (active === true) {
            identifier = id;
            callback();
        }
        return active;
    }

    function reset(id) {
        if (id === identifier) {
            active = false;
            identifier = undefined;
        }
    }

    return { draw, isTouched, reset, move: () => { }, set };
}

export function Button(ctx, callback, text = "Klick", bg_from = '#10B981', bg_to = '#059669') {
    let radius = 12;

    const base = ButtonBase(ctx, callback, (ctx, x, y, width, height, border, active) => {
        drawButton(ctx, x + border / 2, y + border / 2, width - border, height - border, text, active, {
            bg_from, bg_to, radius, font: '12px system-ui'
        });
    });

    function set(nx, ny, nw, nh) {
        base.set(nx, ny, nw, nh);
        radius = nw < nh ? nw / 8 : nh / 8;
    }

    return { draw: base.draw, isTouched: base.isTouched, reset: base.isTouched, move: () => { }, set };
}

export function Checkbox(ctx, callback) {
    let enabled = false;

    function onChange() {
        enabled = !enabled;
        callback(enabled);
    }

    function set(nx, ny, nw, nh) {
        const aspectRatio = nw / nh;
        if (aspectRatio < 1.5) nh = nw / 1.5;
        base.set(nx, ny, nw, nh);
    }

    const base = ButtonBase(ctx, onChange, (ctx, x, y, width, height, border) => {
        drawCheckbox(ctx, x + border / 2, y + border / 2, width - border, height - border, enabled);
    });

    return { draw: base.draw, isTouched: base.isTouched, reset: () => { }, move: () => { }, set };
}



