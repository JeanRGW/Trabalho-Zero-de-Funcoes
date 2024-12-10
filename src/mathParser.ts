export const parseFunction = (
    mathF: string,
    variables: { symbol: string; value: number }[]
): number | null => {
    mathF = mathF.replaceAll(/-(\w+|\([^()]+\))\^(\d+|\([^()]+\))/g, "-($1^$2)"); // Encapsular operações onde ^ é precedido por -

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
        mathF = mathF.replace(
            new RegExp(`\\b${variable.symbol}\\b`, "g"),
            `(${variable.value})`
        );
    }

    try {
        const resultUnparsed = eval(mathF);

        if (
            typeof resultUnparsed !== "number" ||
            Number.isNaN(resultUnparsed) ||
            !Number.isFinite(resultUnparsed)
        ) {
            return null;
        }

        return Number(resultUnparsed); // Garante retorno com precisão
    } catch (e) {
        console.log("Error: " + e);
        console.log(mathF);
        return null;
    }
};

// Resolve com única variável x implícita
export const simpleParseFunction = (mathF: string, xValue: number) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};

export default parseFunction;
