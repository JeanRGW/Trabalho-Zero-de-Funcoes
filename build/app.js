import { input, select, number } from "@inquirer/prompts";
import { bissec, mil, newtonRaphson, regulaFalsi, secante } from "./metodos.js";
import { simpleParseFunction } from "./mathParser.js";
const e = Math.E;
const x = 1.5209886671497657;
const result = e ** -(x ** 2) - Math.cos(x);
const expression = "e^-(x**2)-cos(x)";
const result2 = simpleParseFunction(expression, x);
console.log(result);
console.log(result2);
const mathF = await input({ message: "Insira a função" });
const prec = await number({
    message: "Insira a precisão desejada",
    step: "any",
});
const maxIt = await number({ message: "Insira o número max de iterações" });
const entradaBissec = async () => {
    const a = await number({
        message: "Insira o limite inferior",
        step: "any",
    });
    const b = await number({
        message: "Insira o limite superior",
        step: "any",
    });
    return bissec(mathF, a, b, prec, maxIt);
};
const entradaMIL = async () => {
    const strFi = await input({ message: "Insira a função fi" });
    const x0 = await number({ message: "Insira x0", step: "any" });
    return mil(mathF, strFi, x0, prec, maxIt);
};
const entradaSecante = async () => {
    const x0 = await number({
        message: "Insira x0",
        step: "any",
    });
    const x1 = await number({
        message: "Insira x1",
        step: "any",
    });
    return secante(mathF, x0, x1, prec, maxIt);
};
const entradaRegulaFalsi = async () => {
    const x0 = await number({
        message: "Insira x0",
        step: "any",
    });
    const x1 = await number({
        message: "Insira x1",
        step: "any",
    });
    return regulaFalsi(mathF, x0, x1, prec, maxIt);
};
const entradaNewton = async () => {
    const strDerivada = await input({ message: "Insira a derivada da função" });
    const x0 = await number({ message: "Insira x0", step: "any" });
    return newtonRaphson(mathF, strDerivada, x0, prec, maxIt);
};
while (true) {
    const metodoSelecionado = await select({
        message: "Qual método você deseja utilizar?",
        choices: [
            { value: entradaBissec, name: "Bisseção" },
            { value: entradaMIL, name: "MIL" },
            { value: entradaNewton, name: "Newton" },
            { value: entradaSecante, name: "Secante" },
            { value: entradaRegulaFalsi, name: "Regula Falsi" },
        ],
    });
    const result = await metodoSelecionado();
    console.log(result);
}
