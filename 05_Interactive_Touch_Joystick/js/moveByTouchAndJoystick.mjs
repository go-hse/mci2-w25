import { Item } from "./items.mjs";
import { circle, distance, transform, fillPath } from "./graphics.mjs";
import { Joystick } from "./joystick.mjs";


export function MoveByTwoFingers(ctx, path) {
    let f1, f2, initialDistance;

    const item = Item();
    let localTransform, preTransform;

    const joystick = Joystick(ctx);

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);
        const scale = nw < nh ? nw / 20 : nh / 20;
        localTransform = transform(ctx, nw / 2, nh / 2, 0, scale);

        joystick.set(nx, ny, nw, nh);
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
            fillPath(ctx, path, localTransform, "#f00", "#000");
        } else {
            fillPath(ctx, path, localTransform, "#aaa", "#000");
        }

        joystick.draw();
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

        joystick.move(id, tx, ty);
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        console.log("M2F", id, tx, ty);
        if (!f1) {
            const I = (new DOMMatrix(localTransform)).invertSelf();  // L-1
            const localTouch = I.transformPoint(new DOMPoint(tx, ty));
            const touchedState = ctx.isPointInPath(path, localTouch.x, localTouch.y);
            if (touchedState) {
                f1 = { id, x: tx, y: ty };
                preTransform = transform(ctx, f1.x, f1.y, 0).invertSelf().multiplySelf(localTransform);  // Formel für P = Ti-1 Li
            }
        } else {
            if (!f2) {
                f2 = { id, x: tx, y: ty };
                initialDistance = distance(f1.x, f1.y, f2.x, f2.y);
                const alpha = Math.atan2(f2.y - f1.y, f2.x - f1.x);
                preTransform = transform(ctx, f1.x, f1.y, alpha).invertSelf().multiplySelf(localTransform);  // Formel für P = Ti-1 Li
            }
        }
        joystick.isTouched(id, tx, ty);
    }

    function reset(id) {
        if (f1 && id === f1.id) {
            f1 = undefined; f2 = undefined;
        }
        if (f2 && id === f2.id) {
            f2 = undefined;
            preTransform = transform(ctx, f1.x, f1.y).invertSelf().multiplySelf(localTransform);  // Formel für P = Ti-1 Li
        }
        joystick.reset(id);
    }

    return { draw, isTouched, reset, move, set };
}


