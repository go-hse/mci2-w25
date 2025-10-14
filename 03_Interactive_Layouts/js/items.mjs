import { Pong, InfoBox, Clock } from "./graphics.mjs";

// Items sind Elemente von Layouts

export function Item() {
    let x = 0, y = 0, width = 0, height = 0;

    // vom Layout aufgerufen, setzt Größe und Position
    function set(nx, ny, nw, nh) {
        x = nx; y = ny; width = nw; height = nh;
    }

    // Prüft, ob Punkt px/py im Bereicht des Items ist
    function hit(px, py) {
        return px >= x && px <= x + width && py >= y && py <= y + height;
    }

    // gibt die aktuelle Greöße und Position zurück
    function get() {
        return { x, y, width, height };
    }

    return { set, get, hit };
}

// Drawable: Item mit Funktion zum Zeichnen
export function Drawable(ctx, drawFunc) {
    const item = Item();
    function draw() {
        const { x, y, width, height } = item.get();
        ctx.translate(x, y);
        drawFunc(ctx, width, height);
        ctx.resetTransform();
    }
    return { set: item.set, draw };
}

// Zeichnet eine Infobox: Rahmen mit Größe als Text
export function DrawInfo(ctx, info) {
    return Drawable(ctx, (ctx, w, h) => {
        InfoBox(ctx, w, h, info)
    });
}

// Zeichnet den fliegenden Ball
export function DrawPong(ctx, info) {
    const pong = Pong();
    return Drawable(ctx, (ctx, w, h) => {
        InfoBox(ctx, w, h, info);
        pong.draw(ctx, w, h);
    });
}

// Zeichnet die Uhr
export function DrawClock(ctx) {
    const clock = Clock();
    return Drawable(ctx, (ctx, w, h) => {
        clock.draw(ctx, w, h);
    });
}

