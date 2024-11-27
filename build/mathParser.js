export const parseFunction = (mathF, variables) => {
    const replaces = [
        ["e", Math.E.toString()],
        ["^", "**"],
        ["cos", "Math.cos"],
        ["sen", "Math.sin"],
        ["tg", "Math.tan"],
    ];
    for (const [symbol, replacement] of replaces) {
        mathF = mathF.replace(symbol, replacement);
    }
    for (const variable of variables) {
        mathF = mathF.replace(new RegExp(`\\b${variable.symbol}\\b`, "g"), `(${variable.value})`);
    }
    try {
        const resultUnparsed = eval(mathF);
        if (typeof resultUnparsed !== "number" ||
            Number.isNaN(resultUnparsed) ||
            resultUnparsed == Infinity) {
            return null;
        }
        return Number(resultUnparsed);
    }
    catch {
        console.log("Error");
        return null;
    }
};
export const simpleParseFunction = (mathF, xValue) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};
export default parseFunction;
