export function fullScreenOnOff(cnv) {
    return async (enabled) => {
        if (enabled) {
            try {
                await cnv.requestFullscreen();
                return true;
            } catch (err) {
                return false;
            }
        } else {
            document.exitFullscreen();
        }
    }
}

export function fullScreenToggle(cnv) {
    return async (id) => {
        console.log("fullScreenToggle ", id);
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        try {
            await cnv.requestFullscreen();
            return true;
        } catch (err) {
            return false;
        }
    }
}
