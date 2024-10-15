import { Decimal } from "decimal.js";

const replaceBetween = (
    origin: string,
    startIndex: number,
    endIndex: number,
    insertion: string
) =>
    `${origin.substring(0, startIndex)}${insertion}${origin.substring(
        endIndex
    )}`;

export const parseFunction = (
    mathF: string,
    variables: { symbol: string; value: number }[]
): number => {
    mathF = parseSymbols(mathF, variables);
    mathF = parseFunctions(mathF);

    return parseFloat(parseExpression(mathF));
};

const parseFunctions = (mathF: string): string => {
    mathF = replaceFunctions(mathF, "cos", highPrecisionCos);
    mathF = replaceFunctions(mathF, "sen", highPrecisionSin);
    mathF = replaceFunctions(mathF, "tg", highPrecisionTan);
    mathF = replaceFunctions(mathF, "ln", highPrecisionLn);

    return mathF;
};

const replaceFunctions = (
    mathF: string,
    funcName: string,
    trigFunc: (arg: Decimal) => Decimal
): string => {
    while (mathF.includes(`${funcName}(`)) {
        const startIndex = mathF.indexOf(`${funcName}(`) + funcName.length + 1;
        const endIndex = findMatchingParenthesis(mathF, startIndex);
        const argument = mathF.substring(startIndex, endIndex);

        const parsedArgument = new Decimal(parseFunction(argument, []));

        const result = trigFunc(parsedArgument);
        mathF = replaceBetween(
            mathF,
            startIndex - funcName.length - 1,
            endIndex + 1,
            result.toString()
        );
    }
    return mathF;
};

const highPrecisionCos = (x: Decimal) => new Decimal(Math.cos(x.toNumber()));
const highPrecisionSin = (x: Decimal) => new Decimal(Math.sin(x.toNumber()));
const highPrecisionTan = (x: Decimal) => new Decimal(Math.tan(x.toNumber()));
const highPrecisionLn = (x: Decimal) => new Decimal(Math.log(x.toNumber()));

const findMatchingParenthesis = (mathF: string, startIndex: number): number => {
    let openParenthesis = 1;
    for (let i = startIndex; i < mathF.length; i++) {
        if (mathF[i] === "(") openParenthesis++;
        if (mathF[i] === ")") openParenthesis--;
        if (openParenthesis === 0) return i;
    }
    throw new Error("Mismatched parentheses");
};

const parseExpression = (mathF: string): string => {
    try {
        while (mathF.includes("^")) {
            const [base, exponent] = extractOperation(mathF, "^");

            const evaluatedExponent = parseExpression(exponent);

            const result = new Decimal(base).pow(
                new Decimal(evaluatedExponent)
            );
            mathF = mathF.replace(`${base}^${exponent}`, result.toString());
        }

        mathF = mathF.replaceAll("--", "+");

        return new Decimal(eval(mathF)).toString();
    } catch (error) {
        throw new Error("Error on parseExpression: " + error);
    }
};

const extractOperation = (expr: string, operator: string): [string, string] => {
    const operatorIndex = expr.indexOf(operator);
    let left = "",
        right = "";

    let i = operatorIndex - 1;
    let parenthesisCount = 0;
    while (
        i >= 0 &&
        (parenthesisCount > 0 ||
            !isOperator(expr[i]) ||
            (expr[i] === "-" && i === 0)) &&
        expr[i] != "("
    ) {
        if (expr[i] === ")") parenthesisCount++;
        if (expr[i] === "(") parenthesisCount--;
        left = expr[i] + left;
        i--;
    }

    i = operatorIndex + 1;
    parenthesisCount = 0;
    while (
        i < expr.length &&
        (parenthesisCount > 0 ||
            !isOperator(expr[i]) ||
            (expr[i] === "-" && i === operatorIndex + 1)) &&
        !(parenthesisCount < 1 && expr[i] === ")")
    ) {
        if (expr[i] === "(") parenthesisCount++;
        if (expr[i] === ")") parenthesisCount--;
        right += expr[i];
        i++;
    }

    return [left.trim(), right.trim()];
};

const isOperator = (char: string): boolean => {
    return ["+", "-", "*", "/", "^"].includes(char);
};

const parseSymbols = (
    mathF: string,
    variables: { symbol: string; value: number }[]
): string => {
    for (const variable of variables) {
        mathF = mathF.replace(
            new RegExp(`\\b${variable.symbol}\\b`, "g"),
            variable.value.toString()
        );
    }

    mathF = mathF.replace(/\be\b/g, (2.7183).toString());

    return mathF;
};

export const simpleParseFunction = (mathF: string, xValue: number) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};

export default parseFunction;
