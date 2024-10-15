import { Decimal } from "decimal.js";
const replaceBetween = (origin, startIndex, endIndex, insertion) => `${origin.substring(0, startIndex)}${insertion}${origin.substring(endIndex)}`;
export const parseFunction = (mathF, variables) => {
    mathF = parseSymbols(mathF, variables);
    mathF = parseFunctions(mathF);
    return parseFloat(parseExpression(mathF));
};
const parseFunctions = (mathF) => {
    mathF = replaceFunctions(mathF, "cos", highPrecisionCos);
    mathF = replaceFunctions(mathF, "sen", highPrecisionSin);
    mathF = replaceFunctions(mathF, "tg", highPrecisionTan);
    mathF = replaceFunctions(mathF, "ln", highPrecisionLn);
    return mathF;
};
const replaceFunctions = (mathF, funcName, trigFunc) => {
    while (mathF.includes(`${funcName}(`)) {
        const startIndex = mathF.indexOf(`${funcName}(`) + funcName.length + 1;
        const endIndex = findMatchingParenthesis(mathF, startIndex);
        const argument = mathF.substring(startIndex, endIndex);
        const parsedArgument = new Decimal(parseFunction(argument, []));
        const result = trigFunc(parsedArgument);
        mathF = replaceBetween(mathF, startIndex - funcName.length - 1, endIndex + 1, result.toString());
    }
    return mathF;
};
const highPrecisionCos = (x) => new Decimal(Math.cos(x.toNumber()));
const highPrecisionSin = (x) => new Decimal(Math.sin(x.toNumber()));
const highPrecisionTan = (x) => new Decimal(Math.tan(x.toNumber()));
const highPrecisionLn = (x) => new Decimal(Math.log(x.toNumber()));
const findMatchingParenthesis = (mathF, startIndex) => {
    let openParenthesis = 1;
    for (let i = startIndex; i < mathF.length; i++) {
        if (mathF[i] === "(")
            openParenthesis++;
        if (mathF[i] === ")")
            openParenthesis--;
        if (openParenthesis === 0)
            return i;
    }
    throw new Error("Mismatched parentheses");
};
const parseExpression = (mathF) => {
    try {
        while (mathF.includes("^")) {
            const [base, exponent] = extractOperation(mathF, "^");
            const evaluatedExponent = parseExpression(exponent);
            const result = new Decimal(base).pow(new Decimal(evaluatedExponent));
            mathF = mathF.replace(`${base}^${exponent}`, result.toString());
        }
        mathF = mathF.replaceAll("--", "+");
        return new Decimal(eval(mathF)).toString();
    }
    catch (error) {
        throw new Error("Error on parseExpression: " + error);
    }
};
const extractOperation = (expr, operator) => {
    const operatorIndex = expr.indexOf(operator);
    let left = "", right = "";
    let i = operatorIndex - 1;
    let parenthesisCount = 0;
    while (i >= 0 &&
        (parenthesisCount > 0 ||
            !isOperator(expr[i]) ||
            (expr[i] === "-" && i === 0)) &&
        expr[i] != "(") {
        if (expr[i] === ")")
            parenthesisCount++;
        if (expr[i] === "(")
            parenthesisCount--;
        left = expr[i] + left;
        i--;
    }
    i = operatorIndex + 1;
    parenthesisCount = 0;
    while (i < expr.length &&
        (parenthesisCount > 0 ||
            !isOperator(expr[i]) ||
            (expr[i] === "-" && i === operatorIndex + 1)) &&
        !(parenthesisCount < 1 && expr[i] === ")")) {
        if (expr[i] === "(")
            parenthesisCount++;
        if (expr[i] === ")")
            parenthesisCount--;
        right += expr[i];
        i++;
    }
    return [left.trim(), right.trim()];
};
const isOperator = (char) => {
    return ["+", "-", "*", "/", "^"].includes(char);
};
const parseSymbols = (mathF, variables) => {
    for (const variable of variables) {
        mathF = mathF.replace(new RegExp(`\\b${variable.symbol}\\b`, "g"), variable.value.toString());
    }
    mathF = mathF.replace(/\be\b/g, (2.7183).toString());
    return mathF;
};
export const simpleParseFunction = (mathF, xValue) => {
    return parseFunction(mathF, [{ symbol: "x", value: xValue }]);
};
export default parseFunction;
