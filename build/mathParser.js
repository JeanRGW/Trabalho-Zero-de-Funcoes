export const parseFunction = (mathF, variables) => {
    mathF = mathF.replaceAll(/-(\w+|\([^()]+\))\^(\d+|\([^()]+\))/g, "-($1^$2)");
    const replaces = [
        ["e", Math.E.toString()],
        ["^", "**"],
        ["cos", "Math.cos"],
        ["sen", "Math.sin"],
        ["sqrt", "Math.sqrt"],
        ["cbrt", "Math.cbrt"],
        ["tg", "Math.tan"]
    ];
    for (const [symbol, replacement] of replaces) {
        mathF = mathF.replaceAll(symbol, replacement);
    }
    for (const variable of variables) {
        mathF = mathF.replace(new RegExp(`\\b${variable.symbol}\\b`, "g"), `(${variable.value})`);
    }
    try {
        const resultUnparsed = eval(mathF);
        if (typeof resultUnparsed !== "number" ||
            Number.isNaN(resultUnparsed) ||
            !Number.isFinite(resultUnparsed)) {
            return null;
        }
        console.log("Retorno válido: " + resultUnparsed + "; Função: " + mathF);
        return Number(resultUnparsed);
    }
    catch (e) {
        console.log("Error: " + e);
        console.log(mathF);
        return null;
    }
};
export const simpleParseFunction = (mathF, xValue) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};
export default parseFunction;
