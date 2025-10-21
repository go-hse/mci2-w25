import { Item } from "./items.mjs";
import { circle } from "./graphics.mjs";

export function MoveByTouch(ctx, path) {
    let active, identifier;

    const item = Item();
    let localTransform, preTransform;

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);

        const scale = nw < nh ? nw / 20 : nh / 20;

        // initialisierung der Position des U-Objekts
        localTransform = transform(ctx, nw / 2, nh / 2, 1, scale);

    }

    function draw() {
        const { x, y, width, height } = item.get();

        ctx.fillStyle = "#fee";
        ctx.strokeStyle = "#000";

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        if (identifier !== undefined) {
            fillPath(ctx, path, localTransform, "#e22121ff", "#000");
        } else {
            fillPath(ctx, path, localTransform, "#aaa", "#000");
        }
    }

    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (identifier === id) {
            active = item.hit(tx, ty);
            if (active) {
                localTransform = transform(ctx, tx, ty).multiplySelf(preTransform);
            }
            else
                identifier = undefined;
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        active = item.hit(tx, ty);
        if (active) {
            const I = (new DOMMatrix(localTransform)).invertSelf();  // L-1
            const localTouch = I.transformPoint(new DOMPoint(tx, ty));
            const touchedState = ctx.isPointInPath(path, localTouch.x, localTouch.y);
            if (touchedState === true) {
                identifier = id;
                preTransform = transform(ctx, tx, ty).invertSelf().multiplySelf(localTransform);
            }
        }
    }

    function reset(id) {
        if (id === identifier) {
            identifier = undefined;
        }
    }

    return { draw, isTouched, reset, move, set };
}



function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function transform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(alpha);
    ctx.scale(sc, sc);
    const M = ctx.getTransform();
    return M;
}

export function createUpath() {
    let upath = new Path2D();
    upath.moveTo(-2, -2);
    upath.lineTo(-2, 2);
    upath.lineTo(-1, 2);
    upath.lineTo(-1, -1);
    upath.lineTo(1, -1);
    upath.lineTo(1, 2);
    upath.lineTo(2, 2);
    upath.lineTo(2, -2);
    upath.closePath();
    return upath;
}

export function fillPath(ctx, path, M, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 0.1) {
    ctx.save();  // Speichern des Zustands mit der aktuellen Matrix auf Stack
    ctx.setTransform(M);
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore(); // Holen der gespeicherten Matrix vom Stack
}
