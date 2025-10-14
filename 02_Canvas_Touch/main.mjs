import { circle, line } from "./js/grafics.mjs"

const fontSize = 24;


window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        console.log("resize", cnv.width, cnv.height);
    }
    addEventListener("resize", resize);

    let Touches = new Map();

    cnv.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        for (let t of evt.changedTouches) {
            console.log(`add ${t.identifier}`);
            Touches.set(t.identifier, {
                x: t.pageX,
                y: t.pageY,
            });
        }
    }, true);


    cnv.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        for (let t of evt.changedTouches) {
            console.log(`move ${t.identifier}`);
            Touches.set(t.identifier, {
                x: t.pageX,
                y: t.pageY,
            });
        }
    }, true);

    cnv.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        for (let t of evt.changedTouches) {
            console.log(`end ${t.identifier}`);
            Touches.delete(t.identifier);
        }
    }, true);


    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);


        ctx.font = `${fontSize}px monospace`;

        for (const [identifier, coords] of Touches) {
            circle(ctx, coords.x, coords.y, 40, "#f00");
            ctx.fillStyle = "#000";
            ctx.fillText(`finger ${identifier}`, coords.x, coords.y);

        }

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}

