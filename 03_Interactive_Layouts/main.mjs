// import * as lib from "./js/funcs.mjs";

import { DrawPong, DrawInfo, DrawClock } from "./js/items.mjs"
import { HorizontalLayout, VerticalLayout, ToggleLayout } from "./js/layout.mjs"
import { WidgetsHandler } from "./js/widgetshandler.mjs";
import { Button } from "./js/widgets.mjs";
import { Checkbox } from "./js/widgets.mjs";
import { Fingers } from "./js/finger.mjs";
import { Lines } from "./js/lines.mjs";

function fullScreen(enabled) {
    if (enabled) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Fehler beim Aktivieren des Vollbildmodus: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    const widgets = WidgetsHandler(cnv);
    const interactiveElement = Lines(ctx);

    const greenButton = Button(ctx, () => { interactiveElement.setColor("#0f0") }, "Green", "#3f3", "#262");
    const redButton = Button(ctx, () => { interactiveElement.setColor("#f00") }, "Red", "#f33", "#622");
    const testCheckBox = Checkbox(ctx, fullScreen, "#aaa", "#ccc");
    // const interactiveElement = Fingers(ctx);

    widgets.addWidget(greenButton);
    widgets.addWidget(redButton);
    widgets.addWidget(testCheckBox);
    widgets.addWidget(interactiveElement);

    const mainLayout = VerticalLayout(ctx);

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        mainLayout.set(0, 0, window.innerWidth, window.innerHeight)
    }

    addEventListener("resize", resize);

    const menuLayout = HorizontalLayout();
    const contentLayout = HorizontalLayout();

    mainLayout.addChild(menuLayout, 2.5);
    mainLayout.addChild(contentLayout, 10);

    menuLayout.addChild(DrawClock(ctx), 2);
    menuLayout.addChild(DrawInfo(ctx, "menu"), 9);

    const buttonLayout = ToggleLayout(1.5);
    buttonLayout.addChild(greenButton, 1);
    buttonLayout.addChild(redButton, 1);
    buttonLayout.addChild(testCheckBox, 2);
    menuLayout.addChild(buttonLayout, 2);

    // contentLayout.addChild(DrawPong(ctx, "content"), 1);
    contentLayout.addChild(interactiveElement);

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        mainLayout.draw();
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


