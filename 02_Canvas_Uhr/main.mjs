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

    const secondAngle = Math.PI / 30;

    function draw() {
        const inner = cnv.height * 0.4;
        const outer = cnv.height * 0.42;

        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.translate(cnv.width / 2, cnv.height / 2);

        const now = new Date();
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = "#000";
        const text = now.toLocaleTimeString();
        const bb = ctx.measureText(text);
        const bbheight = bb.actualBoundingBoxAscent + bb.actualBoundingBoxDescent;
        ctx.fillText(text, -bb.width / 2, bbheight / 2);


        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) {
                line(ctx, inner, 0, outer + 15, 0, "#000", 2);
            } else {
                line(ctx, inner, 0, outer, 0, "#000", 1);
            }
            ctx.rotate(secondAngle);
        }

        ctx.resetTransform();
        ctx.translate(cnv.width / 2, cnv.height / 2);

        const actSeconds = now.getSeconds();
        const actSecondsAngle = actSeconds * secondAngle;

        ctx.rotate(actSecondsAngle);
        line(ctx, 0, 0, 0, -outer, "#f00", 1);


        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


