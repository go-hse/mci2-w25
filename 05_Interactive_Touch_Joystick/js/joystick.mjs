import { Item } from "./items.mjs";
import { circle, distance, transform, createArrowPath, fillPath } from "./graphics.mjs";

import { globals } from "./globals.mjs";

export function Joystick(ctx) {
    let initialTouch, moveTouch, cx, cy, radius, actionRadius, border, localTransform, initialAlpha, scale;
    const item = Item();

    const arrow = createArrowPath();

    function slice(angle) {
        if (initialAlpha !== undefined && angle !== undefined) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius * 2, initialAlpha, initialAlpha + angle, angle < 0);
            ctx.closePath();
            ctx.fill();
        }
    }

    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);
        radius = nw < nh ? nw / 10 : nh / 10;
        actionRadius = radius / 4;
        border = radius;
        cx = nx + radius + border;
        cy = ny + nh - (radius + border);

        scale = nw < nh ? nw / 20 : nh / 20;
        localTransform = transform(ctx, nw / 2, nh / 2, Math.PI, scale);
    }

    function normalizeAngleDiff(alpha) {
        let diff = alpha - initialAlpha;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return diff;
    }


    const speedScale = 0.001;
    function draw() {
        let deltaAlpha;
        if (initialTouch !== undefined && moveTouch !== undefined) {
            const dx = (moveTouch.tx - initialTouch.tx);
            const dy = (moveTouch.ty - initialTouch.ty);

            localTransform.translateSelf(-dx * speedScale, -dy * speedScale);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > actionRadius) {
                const alpha = Math.atan2(dy, dx);
                circle(ctx, moveTouch.tx, moveTouch.ty, radius / 10, globals.hightlightColor);
                if (initialAlpha === undefined) {
                    initialAlpha = alpha;
                } else {
                    deltaAlpha = normalizeAngleDiff(alpha);
                    localTransform.rotateSelf(deltaAlpha);
                }
            } else {
                initialAlpha = undefined;
            }
        }

        if (initialTouch !== undefined) {
            slice(deltaAlpha);
            circle(ctx, cx, cy, radius, globals.foregroundActive);
            circle(ctx, initialTouch.tx, initialTouch.ty, actionRadius, globals.foregroundPassive); // Action Circle
            circle(ctx, initialTouch.tx, initialTouch.ty, radius / 20, globals.hightlightColor);
            if (moveTouch !== undefined) {
                circle(ctx, moveTouch.tx, moveTouch.ty, radius / 20, globals.hightlightColor);
            }
        } else {
            circle(ctx, cx, cy, radius, globals.foregroundPassive);
        }

        fillPath(ctx, arrow, localTransform, "#a22");
    }

    function move(id, tx, ty) {
        if (initialTouch && initialTouch.id === id) {
            moveTouch = { id, tx, ty };
        }
    }

    let lastTouch = new Date();
    function isTouched(id, tx, ty) {
        const dist = distance(cx, cy, tx, ty);
        if (dist < radius) {
            initialTouch = { id, tx, ty };
        }
        lastTouch = new Date();
    }

    function reset(id) {
        if (initialTouch !== undefined && id === initialTouch.id) {
            const now = new Date();
            const deltaT = now - lastTouch
            if (deltaT < 400) {
                const { x, y, width, height } = item.get();
                localTransform = transform(ctx, width / 2, height / 2, Math.PI, scale);
            }
            initialTouch = undefined;
            moveTouch = undefined;
            initialAlpha = undefined;
        }
    }

    return { draw, isTouched, reset, move, set };
}