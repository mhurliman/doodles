import { Vector2, Matrix3x3 } from "./math.js"

function roundRect(ctx, x0, y0, x1, y1, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    
    if (typeof radius === 'undefined') {
        radius = 5;
    }

    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } 
    else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    ctx.beginPath();
    ctx.moveTo(x0 + radius.tl, y0);
    ctx.lineTo(x1 - radius.tr, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + radius.tr);
    ctx.lineTo(x1, y1 - radius.br);
    ctx.quadraticCurveTo(x1, y1, x1 - radius.br, y1);
    ctx.lineTo(x0 + radius.bl, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - radius.bl);
    ctx.lineTo(x0, y0 + radius.tl);
    ctx.quadraticCurveTo(x0, y0, x0 + radius.tl, y0);
    ctx.closePath();

    if (typeof stroke != 'undefined')
    {
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
    
    if (typeof fill != 'undefined')
    {
        ctx.fillStyle = fill;
        ctx.fill();
    }
}

export class Shape {
    draw(ctx, xfm, position, size, fill, stroke) { }
}

export class Rect extends Shape {
    draw(ctx, xfm, fill, stroke) {
        var corners = Rect.corners();
        for (var i = 0; i < corners.length; ++i) {
            corners[i] = Matrix3x3.transformPoint(xfm, corners[i]);
        }

        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        ctx.lineTo(corners[1].x, corners[1].y);
        ctx.lineTo(corners[2].x, corners[2].y);
        ctx.lineTo(corners[3].x, corners[3].y);
        ctx.closePath();

        if (typeof stroke != 'undefined')
        {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
        
        if (typeof fill != 'undefined')
        {
            ctx.fillStyle = fill;
            ctx.fill();
        }
    }

    static corners() {
        return [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(1, 1),
            new Vector2(0, 1),
        ]
    }
}

export class RoundRect extends Shape {
    draw(ctx, xfm, fill, stroke) {
        var corners = RoundRect.corners();
        for (var i = 0; i < corners.length; ++i) {
            corners[i] = Matrix3x3.transformPoint(xfm, corners[i]);
        }

        var radius = Matrix3x3.transformVec(xfm, new Vector2(0.0625, 0)).x;

        roundRect(ctx, corners[0].x, corners[1].y, corners[1].x, corners[0].y, radius, fill, stroke);
    }

    static corners() {
        return [
            new Vector2(0, 0),
            new Vector2(1, 1),
        ]
    }
}