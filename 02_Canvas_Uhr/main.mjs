import { circle, line } from "./js/grafics.mjs"

window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        console.log("resize", cnv.width, cnv.height);
    }
    addEventListener("resize", resize);

    const inner = cnv.height * 0.4;
    const outer = cnv.height * 0.42;

    const secondAngle = Math.PI / 30;

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.translate(cnv.width / 2, cnv.height / 2);
        circle(ctx, 0, 0, 10, "red");

        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) {
                line(ctx, inner, 0, outer + 15, 0, "#000", 2);
            } else {
                line(ctx, inner, 0, outer, 0, "#000", 1);
            }
            ctx.rotate(secondAngle);
        }


        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


