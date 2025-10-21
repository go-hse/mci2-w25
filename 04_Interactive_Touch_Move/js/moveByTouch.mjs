import { Item } from "./items.mjs";
import { circle } from "./graphics.mjs";

export function MoveByTouch(ctx, path) {
    let f1, f2;

    const item = Item();
    let localTransform, preTransform, initialDistance;

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);

        const scale = nw < nh ? nw / 20 : nh / 20;

        // initialisierung der Position des U-Objekts
        localTransform = transform(ctx, nw / 2, nh / 2, 1, scale);

    }

    function draw() {
        const { x, y, width, height } = item.get();
        if (f1)
            circle(ctx, f1.x, f1.y, 10, "#fff");

        if (f2)
            circle(ctx, f2.x, f2.y, 10, "#f0f");

        ctx.fillStyle = "#fee";
        ctx.strokeStyle = "#000";

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        if (f1) {
            fillPath(ctx, path, localTransform, "#e22121ff", "#000");
        } else {
            fillPath(ctx, path, localTransform, "#aaa", "#000");
        }
    }

    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (f1 && id === f1.id) {
            f1.x = tx; f1.y = ty;
        }
        if (f2 && id === f2.id) {
            f2.x = tx; f2.y = ty;
        }

        if (f1 && f2) {
            // 2 Finger aktiv: nur Translation und Drehung
            const currentDistance = distance(f1.x, f1.y, f2.x, f2.y);
            const alpha = Math.atan2(f2.y - f1.y, f2.x - f1.x);
            localTransform = transform(ctx, f1.x, f1.y, alpha, currentDistance / initialDistance).multiplySelf(preTransform); // L = Tn * P
        } else if (f1) {
            // nur 1 Finger aktiv Translation, keine Drehung
            localTransform = transform(ctx, f1.x, f1.y, 0).multiplySelf(preTransform); // L = Tn * P
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        if (f1 === undefined) {
            const I = (new DOMMatrix(localTransform)).invertSelf();  // L-1
            const localTouch = I.transformPoint(new DOMPoint(tx, ty));
            const touchedState = ctx.isPointInPath(path, localTouch.x, localTouch.y);
            if (touchedState === true) {
                f1 = { id, x: tx, y: ty };
                preTransform = transform(ctx, tx, ty).invertSelf().multiplySelf(localTransform);
            }
        } else {
            if (f2 === undefined) {
                f2 = { id, x: tx, y: ty };
                initialDistance = distance(f1.x, f1.y, f2.x, f2.y);  // Skalierung
                const alpha = Math.atan2(f2.y - f1.y, f2.x - f1.x);
                preTransform = transform(ctx, f1.x, f1.y, alpha).invertSelf().multiplySelf(localTransform);  // Formel für P = Ti-1 Li

            }
        }
    }

    function reset(id) {
        if (f1 && id === f1.id) {
            f1 = undefined; f2 = undefined;
        }
        if (f2 && id === f2.id) {
            // weiter Bewegung möglich
            f2 = undefined;
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
