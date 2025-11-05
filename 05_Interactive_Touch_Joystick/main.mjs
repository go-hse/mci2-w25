// import * as lib from "./js/funcs.mjs";

import { DrawClock, DrawHeader } from "./js/items.mjs"
import { HorizontalLayout, VerticalLayout, ToggleLayout } from "./js/layout.mjs"
import { TouchHandler } from "./js/touchhandler.mjs";
import { Checkbox } from "./js/widgets.mjs";
import { MoveByTwoFingers } from "./js/moveByTouchAndJoystick.mjs";
import { fullScreenOnOff, fullScreenToggle } from "./js/fullscreen.mjs";
import { createUpath } from "./js/graphics.mjs";
import { initPhysics, arrow } from "./js/matter_physics.mjs";

window.onload = async () => {
    // Canvas-Element und Context als API zum Zeichnen
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    const physics = await initPhysics(ctx);

    const arrowBody = physics.addPath(arrow);
    arrowBody.setPosRot(200, 0, 1);
    const floor = physics.addRectangle(600, 10, true); // floor
    floor.setPosRot(0, 600);


    // Touchables reagieren auf Touch-Events
    const touchables = TouchHandler(cnv, fullScreenToggle(cnv));

    const fullscreenCheckBox = Checkbox(ctx, fullScreenOnOff(cnv), "#aaa", "#ccc");
    // const interactiveObject = MoveByTouch(ctx, createUpath());
    const interactiveObject = MoveByTwoFingers(ctx, createUpath());

    touchables.addTouchWidget(fullscreenCheckBox);
    touchables.addTouchWidget(interactiveObject);
    touchables.addTouchWidget(arrowBody);

    // Layouts: steuern die Größen der Widgets im Fenster
    const mainLayout = VerticalLayout(ctx);

    // resize: wird bei Größenänderungen des Fensters und initial aufgerufen
    // setzt Größe des Haupt-Layouts
    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        mainLayout.set(0, 0, window.innerWidth, window.innerHeight)
    }

    addEventListener("resize", resize);

    // 2 Layouts der 1. Hierarchieebene
    const menuLayout = HorizontalLayout();
    const contentLayout = ToggleLayout();

    mainLayout.addChild(menuLayout, 1);
    mainLayout.addChild(contentLayout, 10);

    // Menü mit Uhr und Button-Layout
    menuLayout.addChild(DrawClock(ctx), 2);
    menuLayout.addChild(DrawHeader(ctx, "Touch"), 10);
    menuLayout.addChild(fullscreenCheckBox, 2);

    // contentLayout.addChild(DrawPong(ctx, "content"), 1);
    contentLayout.addChild(interactiveObject);

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        mainLayout.draw();
        physics.draw();

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


