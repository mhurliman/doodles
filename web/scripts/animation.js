import { Vector2 } from "./math.js"
import * as ease from "./easing.js"

const ANIM_INTERP_LINEAR = 0;
const ANIM_INTERP_COS = 0;
const ANIM_INTERP_CUBIC = 0;


export class Animation {
    static get ANIM_INTERP_LINEAR() {
        return ANIM_INTERP_LINEAR;
    }

    static get ANIM_INTERP_COS() {
        return ANIM_INTERP_COS;
    }

    static get ANIM_INTERP_CUBIC() {
        return ANIM_INTERP_CUBIC;
    }

    constructor(duration, start, end, tInterp, xInterp) {
        if (!Array.isArray(start)) {
            start = [start];
        }
        if (!Array.isArray(end)) {
            end = [end];
        }

        if (!Array.isArray(tInterp)) {
            tInterp = [tInterp];
        }

        if (!Array.isArray(xInterp)) {
            xInterp = [xInterp];
        }
        
        this.elapsed = 0;
        this.duration = duration;

        this.start = start;
        this.end = end;
        this.tInterp = tInterp;
        this.xInterp = xInterp;
    }

    update(dt) {
        self.elapsed += dt;
        t = elapsed / duration;

        for (var i = 0; i < this.values.length; ++i) {
            
            this.values[i]
        }
    }
}