import { DrawInfo, DrawClock } from "./js/items.mjs"
import { HorizontalLayout, VerticalLayout, ToggleLayout } from "./js/layout.mjs"
import { WidgetsHandler } from "./js/widgetshandler.mjs";
import { Slider } from "../03_Interactive_Layouts/js/slider.mjs";

window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    const widgets = WidgetsHandler(cnv);
    const mainLayout = VerticalLayout(ctx);

    const slider = Slider(ctx);

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        mainLayout.set(0, 0, window.innerWidth, window.innerHeight)
    }
    addEventListener("resize", resize);

    const menuLayout = HorizontalLayout();

    mainLayout.addChild(menuLayout, 2.5);
    mainLayout.addChild(slider, 10);
    // mainLayout.addChild(DrawInfo(ctx, "Touch"), 10);

    menuLayout.addChild(DrawClock(ctx), 2);
    menuLayout.addChild(DrawInfo(ctx, "Touch"), 10);

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        mainLayout.draw();
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}

