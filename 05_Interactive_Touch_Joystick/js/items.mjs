import { Pong, InfoBox, Clock, Header } from "./graphics.mjs";

export function Item() {
    let x = 0, y = 0, width = 0, height = 0;

    function set(nx, ny, nw, nh) {
        x = nx; y = ny; width = nw; height = nh;
    }

    function hit(px, py) {
        return px >= x && px <= x + width && py >= y && py <= y + height;
    }

    function get() {
        return { x, y, width, height };
    }

    return { set, get, hit };
}

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

export function DrawInfo(ctx, info) {
    return Drawable(ctx, (ctx, w, h) => {
        InfoBox(ctx, w, h, info)
    });
}

export function DrawHeader(ctx, info) {
    return Drawable(ctx, (ctx, w, h) => {
        Header(ctx, w, h, info)
    });
}


export function DrawPong(ctx, info) {
    const pong = Pong();
    return Drawable(ctx, (ctx, w, h) => {
        InfoBox(ctx, w, h, info);
        pong.draw(ctx, w, h);
    });
}


export function DrawClock(ctx) {
    const clock = Clock();
    return Drawable(ctx, (ctx, w, h) => {
        clock.draw(ctx, w, h);
    });
}

