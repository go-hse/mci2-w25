/* -------------------------
   drawSlider(ctx, x, y, width, radius, dx)
   - ctx: CanvasRenderingContext2D, bereits für DPR skaliert
   - x,y: linke obere Koordinate des Reglers (y ist mittig des Tracks)
   - width: Breite des gesamten Reglers (ohne Margins)
   - radius: Grundradius (verwendet für Knopf / Track-Rundung)
   - dx: relative Position des Sliders im Bereich [0,1]
   ------------------------- */
export function drawSlider(ctx, x, y, width, radius, dx) {
    // Clamp dx
    dx = Math.max(0, Math.min(1, dx));

    // Visual parameters
    const trackHeight = Math.max(6, Math.round(radius * 0.7)); // Höhe des Tracks
    const knobRadius = Math.max(8, Math.round(radius * 1.1));
    const padding = 0
    const innerX = x + padding;
    const innerWidth = Math.max(8, width - padding * 2);
    const trackY = y - (trackHeight / 2);

    // Position des Knopfzentrums
    const knobCx = innerX + dx * innerWidth;
    const knobCy = y;

    // -------------------------
    // Track: sanfter Verlauf + innerer "Groove"
    // -------------------------
    // Hintergrund des Tracks (leichter Schatten / Basis)
    ctx.save();
    // Außenabstand für weiche Kante
    ctx.shadowColor = "rgba(10,20,30,0.12)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    // abgerundeter Track
    const r = trackHeight / 2;
    roundRectPath(ctx, innerX, trackY, innerWidth, trackHeight, r);
    // Basisfüllung
    const baseGrad = ctx.createLinearGradient(innerX, 0, innerX + innerWidth, 0);
    baseGrad.addColorStop(0, "rgba(240,243,246,1)");
    baseGrad.addColorStop(1, "rgba(230,236,241,1)");
    ctx.fillStyle = baseGrad;
    ctx.fill();

    ctx.restore();

    // Innerer dunklerer Streifen (füllstand hinter dem Knopf)
    const filledWidth = knobCx - innerX;
    if (filledWidth > 2) {
        ctx.save();
        roundRectPath(ctx, innerX, trackY, filledWidth, trackHeight, r);
        const fillGrad = ctx.createLinearGradient(innerX, 0, innerX + filledWidth, 0);
        fillGrad.addColorStop(0, "rgba(80,160,255,0.98)");   // links
        fillGrad.addColorStop(1, "rgba(50,120,220,0.98)");   // rechts
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // leichter innerer Glanz (oben)
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        roundRectPath(ctx, innerX, trackY, filledWidth, trackHeight, r);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
    }

    // Subtle groove (thin darker line in center)
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(10,20,30,0.06)";
    roundRectPath(ctx, innerX + 0.5, trackY + trackHeight / 2 - 0.5, innerWidth - 1, 1, 0.5);
    ctx.stroke();
    ctx.restore();

    // -------------------------
    // Ticks (optional, decorative) - small marks under the track
    // -------------------------
    ctx.save();
    const ticks = 9;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(10, 20, 30, 0.44)";
    for (let i = 0; i < ticks; i++) {
        const tx = innerX + (i / (ticks - 1)) * innerWidth;
        ctx.beginPath();
        ctx.moveTo(tx, y + trackHeight * 0.75);
        ctx.lineTo(tx, y + trackHeight * 1.75);
        ctx.stroke();
    }
    ctx.restore();

    // -------------------------
    // Knopf (3D-ish, mit Shadow, Rand und Highlight)
    // -------------------------
    ctx.save();
    // Schatten
    ctx.shadowColor = "rgba(20,40,80,0.18)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // Hauptkörper
    ctx.beginPath();
    ctx.arc(knobCx, knobCy, knobRadius, 0, Math.PI * 2);
    ctx.closePath();

    // Knopf-Verlauf (leicht metallisch)
    const knobGrad = ctx.createLinearGradient(knobCx - knobRadius, knobCy - knobRadius, knobCx + knobRadius, knobCy + knobRadius);
    knobGrad.addColorStop(0, "#ffffff");
    knobGrad.addColorStop(0.45, "#f2f6fb");
    knobGrad.addColorStop(0.55, "#e6f0ff");
    knobGrad.addColorStop(1, "#dbeafc");
    ctx.fillStyle = knobGrad;
    ctx.fill();

    // Rand
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = "rgba(18,40,80,0.12)";
    ctx.stroke();

    ctx.restore();

    // Knopf innerer Ring (dünner kontrast)
    ctx.save();
    ctx.beginPath();
    ctx.arc(knobCx, knobCy, Math.max(4, knobRadius - 6), 0, Math.PI * 2);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.stroke();
    ctx.restore();

    // Knopf Top-Highlight (specular)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(knobCx - knobRadius * 0.28, knobCy - knobRadius * 0.38, knobRadius * 0.6, knobRadius * 0.42, Math.PI * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
    ctx.restore();

    // -------------------------
    // Value-Label oberhalb des Knopfs (klein, optional)
    // -------------------------
    ctx.save();
    ctx.font = "12px system-ui,Segoe UI,Roboto,Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(10,20,30,0.7)";
    const displayValue = Math.round(dx * 100);
    ctx.fillText(displayValue + "%", knobCx, knobCy);
    ctx.restore();
}

/* Rundes Rechteck Pfad-Helper (verwendet in drawSlider) */
function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}
