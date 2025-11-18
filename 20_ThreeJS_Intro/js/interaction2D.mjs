
// Ziel: Steuerung eines Objekts mit der 2D-Maus
export function mouse(cursor) {

    const mouseButtons = [false, false, false, false, false];

    function toggle(ev, active) {
        mouseButtons[ev.button] = active;
        console.log(mouseButtons);
    }

    const MOVESCALE = 0.001;
    function onMouseMove(ev) {
        console.log(ev);

        const dx = ev.movementX * MOVESCALE;
        const dy = ev.movementY * MOVESCALE;

        const isRotation = ev.ctrlKey;

        if (isRotation && mouseButtons[0]) {
            cursor.rotation.x += dy;
            cursor.rotation.z += dx;
        }

        if (!isRotation && mouseButtons[0]) {
            cursor.position.x += dx;
            cursor.position.y -= dy;
        }
        if (!isRotation && mouseButtons[2]) {
            cursor.position.x += dx;
            cursor.position.z += dy;
        }
    }


    document.addEventListener("mousedown", (ev) => toggle(ev, true));
    document.addEventListener("mouseup", (ev) => toggle(ev, false));
    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    });
}

