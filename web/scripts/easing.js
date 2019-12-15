// from https://github.com/warrenm/AHEasing/blob/master/AHEasing/easing.c

export function linearInterp(t) {
    return t;
}

export function quadraticEaseIn(t) {
    return t * t;
}

export function quadraticEaseOut(t) {
    return -t * (t - 2);
}

export function quadraticEaseInOut(t) {
    return t < 0.5 ? 2*t*t : -2*t*t + 4*t - 1;
}

export function cubicEaseIn(t) {
    return t**3;
}

export function cubicEaseOut(t) {
    return (t - 1)**3 + 1;
}

export function cubicEaseInOut(t) {
    return t < 0.5 ? 4 * t**3 : 0.5 * (2*t - 2)**3 + 1;
}

export function quarticEaseIn(t) {
    return t**4;
}

export function quarticEaseOut(t) {
    return (t - 1)**3 * (1 - t) + 1;
}

export function quarticEaseInOut(t) {
    return t < 0.5 ? 8 * t**4 : -8 * (t - 1)**4 + 1;
}

export function quinticEaseIn(t) {
    return t**5;
}

export function quinticEaseOut(t) {
    return (t - 1)**5 + 1;
}

export function quinticEaseInOut(t) {
    return t < 0.5 ? 16 * t**5 : 0.5 * (2*t - 2)**5 + 1;
}

export function sinEaseIn(t) {
    return Math.sin((t - 1) * 0.5 * Math.PI) + 1;
}

export function sinEaseOut(t) {
    return Math.sin(t * 0.5 * Math.PI);
}

export function sinEaseInOut(t) {
    return 0.5 * (1 - Math.cos(t * Math.PI));
}

export function circularEaseIn(t) {
    return 1 - Math.sqrt(1 - t*t);
}

export function circularEaseOut(t) {
    return Math.sqrt((2 - t) * t);
}

export function circularEaseInOut(t) {
    return t < 0.5 ? 0.5 * (1 - Math.sqrt(1 - 4*t*t)) : 0.5 * (Math.sqrt(-(2*t - 3) * (2*t - 1)) + 1);
}

export function exponentialEaseIn(t) {
    return t == 0 ? t : 2 ** (10 * (t - 1));
}

export function exponentialEaseOut(t) {
    return t == 1 ? t : 1 - 2 ** (-10 * t);
}

export function exponentialEaseInOut(t) {
    if (t == 0 || t == 1)
        return t;

    return t < 0.5 ? 0.5 * 2 ** (20*t - 10) : -0.5 * 2 ** (-20*t + 10) + 1;
}

export function elasticEaseIn(t) {
    return Math.sin(-13 * 0.5 * Math.PI * (t + 1)) * 2 **(-10*t) + 1;
}

export function elasticEaseOut(t) {
    return Math.sin(-13 * 0.5 * Map.PI * (t + 1)) * 2 **(-10*t) + 1;
}

export function elasticEaseInOut(t) {
    return t < 0.5 ? 
        0.5 * Math.sin(13 * 0.5 * Math.PI * 2*t) * 2 ** (10 * (2*t - 1)) :
        0.5 * (Math.sin(-13 * 0.5 * Math.PI * 2*t) * 2 ** (-10 * (2*t - 1)) + 2);
}

export function backEaseIn(t) {
    return t**3 - t * Math.sin(t * Math.PI);
}

export function backEaseOut(t) {
    return 1 - (1 - t)**3 + (1 - t) * Math.sin((1 - t) * Math.PI);
}

export function backEaseInOut(t) {
    return t < 0.5 ? 
        0.5 * ((2*t)**3 - 2*t * Math.sin(2*t * Math.PI)) :
        0.5 * (1 - (2 - 2*t)**3 - (2 - 2*t) * Math.sin((2 - 2 * t) * Math.PI)) + 0.5;
}

export function bounceEaseIn(t) {
    return 1 - bounceEaseOut(1 - t);
}

export function bounceEaseOut(t) {
    if (t < 4/11) {
        return (121 * t * t) / 16;
    }
    else if (t < 8/11) {
        return (363/40 * t * t) - (99/10 * t) + 17/5;
    }
    else if (t < 9/10) {
        return (4356/361 * t * t) - (35442/1805 * t) + 16061/1805;
    }
    else {
        return (54/5 * t * t) - (513/25 * t) + 268/25;
    }
}

export function bounceEaseInOut(t) {
    return t < 0.5 ? 0.5 * bounceEaseIn(2*t) : 0.5 * bounceEaseOut(2*t - 1) + 0.5;
}