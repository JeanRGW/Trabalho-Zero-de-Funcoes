export const parseFunction = (
    mathF: string,
    variables: { symbol: string; value: number }[]
): number | null => {
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
            resultUnparsed == Infinity
        ) {
            return null;
        }

        return Number(resultUnparsed); // Garante retorno com precisão
    } catch {
        console.log("Error");
        return null;
    }
};

// Resolve com única variável x implícita
export const simpleParseFunction = (mathF: string, xValue: number) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};

export default parseFunction;
