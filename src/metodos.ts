import { simpleParseFunction as func } from "./mathParser.js";

export interface Result {
    its: number;
    x: number;
}

export const bissec = (
    strFunc: string,
    a: number,
    b: number,
    prec: number,
    maxIt: number
): Result | null => {
    let fa = func(strFunc, a);
    let fb = func(strFunc, b);

    if (fa * fb >= 0) {
        console.error(
            "Os valores iniciais não cercam a raiz (f(a) e f(b) têm o mesmo sinal)."
        );
        return null;
    }

    let it = 0;
    let c = (a + b) / 2;

    while (Math.abs(b - a) > prec && it < maxIt) {
        c = (a + b) / 2;
        const fc = func(strFunc, c);

        if (fa * fc < 0) {
            b = c; // A raiz está entre a e c
            fb = fc;
        } else {
            a = c; // A raiz está entre c e b
            fa = fc;
        }

        it++;
    }

    if (Math.abs(b - a) <= prec) {
        return { x: c, its: it };
    } else {
        console.error("O método da Bisseção não convergiu.");
        return null;
    }
};

export const mil = (
    strFunc: string,
    strFi: string,
    x: number,
    prec: number,
    maxIts: number
): Result | null => {
    let it = 0;

    while (Math.abs(func(strFunc, x)) > prec && it < maxIts) {
        x = func(strFi, x);
        it++;
    }

    return {
        its: it,
        x: x,
    };
};

export const secante = (
    strFunc: string,
    x0: number,
    x1: number,
    prec: number,
    maxIt: number
): Result | null => {
    let f0 = func(strFunc, x0);
    let f1 = func(strFunc, x1);
    let it = 0;

    while (Math.abs(f1) > prec && it < maxIt) {
        const denom = f1 - f0;
        if (denom === 0) {
            console.error("Divisão por zero, método da secante falhou.");
            return null;
        }

        const x2 = x1 - (f1 * (x1 - x0)) / denom;

        x0 = x1;
        f0 = f1;
        x1 = x2;
        f1 = func(strFunc, x1);

        it++;
    }

    if (Math.abs(f1) <= prec) {
        return { x: x1, its: it };
    } else {
        console.error("O método da Secante não convergiu.");
        return null;
    }
};

export const regulaFalsi = (
    strFunc: string,
    x0: number,
    x1: number,
    prec: number,
    maxIt: number
): Result | null => {
    let f0 = func(strFunc, x0);
    let f1 = func(strFunc, x1);
    let it = 0;

    if (f0 * f1 >= 0) {
        return null; // Raiz não cercada
    }

    while (Math.abs(x1 - x0) > prec && it < maxIt) {
        const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
        const f2 = func(strFunc, x2);

        it++;

        if (Math.abs(f2) <= prec) {
            return { x: x2, its: it };
        }

        if (f0 * f2 < 0) {
            x1 = x2;
            f1 = f2;
        } else {
            x0 = x2;
            f0 = f2;
        }
    }

    if (Math.abs(x1 - x0) <= prec) {
        return { x: (x0 + x1) / 2, its: it };
    } else {
        return null;
    }
};

export const newtonRaphson = (
    strFunc: string,
    strDerivada: string,
    x0: number,
    prec: number,
    maxIt: number
): Result | null => {
    let f0 = func(strFunc, x0);
    let df0 = func(strDerivada, x0);
    let it = 0;

    while (Math.abs(f0) > prec && it < maxIt) {
        if (df0 === 0) {
            console.error("Divisão por zero.");
            return null;
        }

        x0 = x0 - f0 / df0;
        f0 = func(strFunc, x0);
        df0 = func(strDerivada, x0);

        it++;
    }

    if (Math.abs(f0) <= prec) {
        return { x: x0, its: it };
    } else {
        console.error("O método de Newton-Raphson não convergiu.");
        return null;
    }
};