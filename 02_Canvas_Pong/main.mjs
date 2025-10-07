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

    const radius = 20, border = 20;
    let ballX = Math.random() * cnv.width, ballY = Math.random() * cnv.height, speedX = 5, speedY = 5;

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        circle(ctx, ballX, ballY, radius, "#f00");

        ballX += speedX;
        ballY += speedY;

        if (ballX + radius > cnv.width || ballX - radius < 0) speedX *= -1;
        if (ballY + radius > cnv.height || ballY - radius < 0) speedY *= -1;



        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


