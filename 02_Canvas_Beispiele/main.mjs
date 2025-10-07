import { circle, line } from "./js/grafics.mjs"

window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    let alpha = 0;
    const rect_width = 200;
    const rect_height = 20;

    let start = new Date();

    function draw() {
        ctx.resetTransform();

        const now = new Date();
        const delta = now - start;
        start = now;

        console.log("frames", 1000 / delta, delta);
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "#f00";
        ctx.translate(300, 300);

        alpha += 0.01;
        ctx.rotate(alpha);  // Bogenmass
        ctx.fillRect(0, 0, rect_width, rect_height);

        ctx.translate(-rect_width / 2, -rect_height / 2);
        ctx.fillStyle = "#0f0";
        ctx.fillRect(0, 0, rect_width, rect_height);

        ctx.resetTransform();
        ctx.translate(cnv.width / 2, cnv.height / 2);
        ctx.fillStyle = "#00f";
        ctx.rotate(alpha);
        ctx.translate(-rect_width / 2, -rect_height / 2);
        ctx.fillRect(0, 0, rect_width, rect_height);


        line(ctx, 0, 0, 200, 300, "#f00", 4);

        // ctx.scale(2, 2);
        circle(ctx, 0, 0, 50, "#f00");

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


