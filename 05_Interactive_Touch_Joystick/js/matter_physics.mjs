import * as decomp from 'https://unpkg.com/poly-decomp-es@0.4.2/dist/poly-decomp-es.js';
import Matter from 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm';
const { Common, Engine, Body, Bodies, World, Composite, Composites, Vertices, Runner } = Matter;

function verticesToPath2D(vertices) {
    const centre = Vertices.centre(vertices);
    const path = new Path2D();
    path.moveTo(vertices[0].x - centre.x, vertices[0].y - centre.y);
    for (let i = 1; i < vertices.length; ++i) {
        path.lineTo(vertices[i].x - centre.x, vertices[i].y - centre.y);
    }
    path.closePath();
    return path;
}

export const arrow = Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50'),
    chevron = Vertices.fromPath('100 0 75 50 100 100 25 100 0 50 25 0'),
    star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'),
    horseShoe = Vertices.fromPath('35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7');


function touchable(body, isStatic) {
    const vertices = body.vertices;
    let identifier, defaultColor, grabPoint;
    const forceMagnitude = 0.005;
    // touchmove id: finger, x,y: touchpoint
    function move(id, x, y) {
        if (!isStatic && id === identifier) {
            const force = {
                x: (x - grabPoint.x) * forceMagnitude,
                y: (y - grabPoint.y) * forceMagnitude
            };

            Matter.Body.applyForce(body, grabPoint, force);
            grabPoint = {
                x: body.position.x + (x - body.position.x),
                y: body.position.y + (y - body.position.y)
            };
        }
    }

    // touchstart: id: finger, x,y: touchpoint
    function isTouched(id, x, y) {
        if (Vertices.contains(vertices, { x, y })) {
            identifier = id;
            defaultColor = body.render.fillStyle;
            body.render.fillStyle = "#f00";
            grabPoint = { x, y };
        }

    }

    // touchend
    function reset(id) {
        if (id === identifier) {
            identifier = undefined;
            body.render.fillStyle = defaultColor;;
        }
    }

    function setPosRot(x, y, angle = 0) {
        Body.setPosition(body, { x, y });
        Body.setAngle(body, angle);
    }


    return { move, isTouched, reset, setPosRot, draw: () => { } };
}

export async function initPhysics(ctx) {
    window.decomp = decomp;

    const engine = Engine.create();
    const world = engine.world;
    world.gravity.y = 1; // Schwerkraft

    function drawBody(body) {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.fillStyle = body.render.fillStyle;
        ctx.fill(body.render.path);
        ctx.restore();
    }

    function addPath(vertices, isStatic = false, render = { fillStyle: "#5f5", strokeStyle: "#000", lineWidth: 1 }) {
        render.path = verticesToPath2D(vertices);
        const body = Bodies.fromVertices(0, 0, vertices, { restitution: 0.5, friction: 0.3, isStatic, render });
        World.add(world, body);
        return touchable(body, isStatic);
    }

    function addRectangle(width, height, isStatic = false, render = { fillStyle: "#ff5", strokeStyle: "#000", lineWidth: 1 }) {
        const body = Bodies.rectangle(0, 0, width, height, { isStatic, render });
        body.render.path = verticesToPath2D(body.vertices);
        World.add(world, body);
        return touchable(body, isStatic);
    }

    function draw() {
        const bodies = Composite.allBodies(world);
        for (const body of bodies) {
            drawBody(body);
        }
    }

    // --- Runner ---
    const runner = Runner.create();
    Runner.run(runner, engine);


    return { addPath, addRectangle, draw };
}

