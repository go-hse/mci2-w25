import { DrawInfo, DrawClock } from "./js/items.mjs"
import { HorizontalLayout, VerticalLayout, ToggleLayout } from "./js/layout.mjs"
import { TouchHandler } from "./js/touchhandler.mjs";
import { Slider } from "./js/slider.mjs";


window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    const touchwidgets = TouchHandler(cnv, async () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            try {
                await cnv.requestFullscreen();
            } catch (err) {
                console.log(err);
            }
        }
    });
    const mainLayout = VerticalLayout(ctx);

    const slider = Slider(ctx);
    touchwidgets.addTouchWidget(slider);

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        mainLayout.set(0, 0, window.innerWidth, window.innerHeight)
    }
    addEventListener("resize", resize);

    const menuLayout = HorizontalLayout();

    mainLayout.addChild(menuLayout, 1.5);
    mainLayout.addChild(DrawInfo(ctx, "Touch"), 10);

    menuLayout.addChild(DrawClock(ctx), 2);
    menuLayout.addChild(DrawInfo(ctx, "Touch"), 10);
    menuLayout.addChild(slider, 4);



    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        mainLayout.draw();
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}

