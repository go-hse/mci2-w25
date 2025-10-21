import { Item } from "./items.mjs";
import { circle, InfoBox } from "./graphics.mjs";
import { drawSlider } from "./sliderDraw.mjs";

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function Slider(ctx) {
    let active, identifier, dx = 0, radius = 10, xi, cx = 0, cy = 0, maxdx = 10;

    const item = Item();

    // Interface für Layouts
    function set(nx, ny, nw, nh) {
        item.set(nx, ny, nw, nh);
        radius = nh / 2;
        maxdx = nw - radius * 2;
        cx = nx + radius;
        cy = ny + radius;
    }

    const bgColor = "#aaa";


    // Interface für/von Layout
    function draw() {
        ctx.font = "16px Calibri";
        circle(ctx, cx, cy, radius, bgColor);
        circle(ctx, cx + maxdx, cy, radius, bgColor);
        ctx.fillRect(cx, cy - radius, maxdx, radius * 2);
        circle(ctx, cx + dx, cy, radius, identifier === undefined ? "gray" : "yellow");
        ctx.fillStyle = "#000";
        ctx.fillText(`${(dx * 100 / maxdx).toFixed(0)}%`, cx + dx - 10, cy);
    }

    function drawNice() {
        drawSlider(ctx, cx, cy, maxdx, radius / 2, dx / maxdx)
    }


    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (identifier === id) {
            active = item.hit(tx, ty);
            if (active) {
                dx += tx - xi;
                xi = tx;
                // dx = Math.max(0, dx);
                // dx = Math.min(maxdx, dx);
                dx = dx > maxdx ? maxdx : dx;
                dx = dx < 0 ? 0 : dx;
            } else
                identifier = undefined;
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        const dist = distance(cx + dx, cy, tx, ty);
        if (dist < radius) {
            identifier = id;
            xi = tx;
        }
    }

    function reset(id) {
        if (id === identifier) {
            identifier = undefined;
        }
    }

    return { draw: drawNice, isTouched, reset, move, set };
}


