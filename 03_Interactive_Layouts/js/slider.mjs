import { Item } from "./items.mjs";
import { circle, InfoBox } from "./graphics.mjs";

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function Slider(ctx) {
    let active, identifier;

    const item = Item();

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);
    }

    function draw() {
        const { x, y, width, height } = item.get();
        ctx.translate(x, y);
        InfoBox(ctx, width, height, "Slider");
        ctx.resetTransform();
    }

    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (identifier === id) {
            active = item.hit(tx, ty);
            if (active) {
            } else
                identifier = undefined;
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        active = item.hit(tx, ty);
        if (active) {
        }
    }

    function reset(id) {
        if (id === identifier) {
            identifier = undefined;
        }
    }

    return { draw, isTouched, reset, move, set };
}


