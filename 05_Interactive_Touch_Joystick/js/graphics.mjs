import { getTime } from "./utils.mjs";


const FULL_CIRCLE = Math.PI * 2;

export function circle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, FULL_CIRCLE, true);
    ctx.fill();
}

const fontSize = 12;

// Item, das die aktuelle Größe anzeigt 
export function InfoBox(ctx, width, height, info) {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";

    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = "#000";

    const text = `${info} ${width.toFixed(0)}x${height.toFixed(0)}`;
    const bb = ctx.measureText(text);
    const bbheight = bb.actualBoundingBoxAscent + bb.actualBoundingBoxDescent;
    ctx.fillText(text, width / 2 - bb.width / 2, height / 2 + bbheight / 2);
}

export function Header(ctx, width, height, info) {
    ctx.fillStyle = "#eee";
    ctx.strokeStyle = "#000";

    // ctx.strokeRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);

    const fontSize = height / 2;
    ctx.font = `${fontSize}px arial`;
    ctx.fillStyle = "#000";

    const bb = ctx.measureText(info);
    const bbheight = bb.actualBoundingBoxAscent + bb.actualBoundingBoxDescent;
    ctx.fillText(info, bbheight, height - bbheight);
}


export function Pong() {
    let ballX = 10, ballY = 10, speedX = 5, speedY = 5;

    function draw(ctx, width, height) {
        const min = width < height ? width : height;
        const radius = min / 10;
        circle(ctx, ballX, ballY, radius, "#f00");

        ballX += speedX;
        ballY += speedY;

        if (ballX + radius > width || ballX - radius < 0) speedX *= -1;
        if (ballY + radius > height || ballY - radius < 0) speedY *= -1;
    }

    return { draw };
}

export function Clock() {
    function pointer(ctx, angle, length, strokeStyle, lineWidth) {
        ctx.save(); // Zustand wird auf Stack gespeichert
        ctx.rotate(angle);  // ganze Drehung: 2 PI; 1 Sekunde = PI / 30
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.restore(); // Zustand wird von Stack wieder hergestellt
    }

    function draw(ctx, width, height) {
        const { pHrs, pMin, pSec, hrs, min, sec } = getTime();
        const radius = width < height ? width / 2 : height / 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        ctx.translate(width / 2, height / 2);
        pointer(ctx, sec * Math.PI / 30, radius, "#000", 1);
        pointer(ctx, min * Math.PI / 30, radius, "#000", 2);
        pointer(ctx, hrs * Math.PI / 6 + (Math.PI / 360) * min, radius * 0.8, "#000", 3);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        for (let i = 0; i < 60; ++i) {
            const start = i % 5 === 0 ? radius * 0.8 : radius * 0.95;
            ctx.beginPath();
            ctx.moveTo(0, start);
            ctx.lineTo(0, radius);
            ctx.stroke();
            ctx.rotate(Math.PI / 30);
        }
    }
    return { draw };
}


export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function transform(ctx, x, y, alpha = 0, sc = 1) {
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

export function createArrowPath() {
    let upath = new Path2D();
    upath.moveTo(-1, -2);
    upath.lineTo(1, -2);
    upath.lineTo(1, 0);
    upath.lineTo(1.5, 0);
    upath.lineTo(0, 1.5);
    upath.lineTo(-1.5, 0);
    upath.lineTo(-1, 0);
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
