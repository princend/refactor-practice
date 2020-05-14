import { Invoice, Play, Performance } from "./models";

type hash<T> = { [key: string]: T };
export type Plays = hash<Play>;
type CbFn<T, P> = (value: T) => P;
type DramaType = hash<CbFn<number, number>>;
type ArrReduce = <T>(arr: T[]) => T;

const currencyUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
})

const dramaDic: DramaType = {
    tragedy: (audience: number) => audience > 30 ? (40000 + 1000 * (audience - 30)) : 40000,
    comedy: (audience: number) => audience > 20 ? 40000 + 500 * (audience - 20) + 300 * audience : 30000 + 300 * audience
}

const resultDic = {
    init: (customer: string) => `Statement for ${customer}\n`,
    order: (arrReduce: ArrReduce, invoice: Invoice, plays: hash<Play>) => arrReduce<string>(invoice.performances.map(perf => getInvoiceInfo(plays, perf))),
    end: (totalAmount: number, volumeCredits: number) => `Amount owed is ${formatUSD(totalAmount)}\nYou earned ${volumeCredits} credits!\n`
}

export default function statement(invoice: Invoice, plays: Plays): string {
    const reducer = (a: any, b: any) => a + b;
    const arrReduce = <T>(arr: Array<T>) => arr.reduce(reducer)
    let volumeCredits = arrReduce<number>(invoice.performances.map(perf => getVolumnCredits(perf.audience, plays[perf.playID].type)));
    let totalAmount = arrReduce<number>(invoice.performances.map(perf => calcAmount(perf.audience, plays[perf.playID].type)));
    let result = resultDic['init'](invoice.customer) + resultDic['order'](arrReduce, invoice, plays) + resultDic['end'](totalAmount, volumeCredits);
    return result;
}

function getInvoiceInfo(plays: hash<Play>, perf: Performance) {
    return ` ${plays[perf.playID].name}: ${formatUSD(calcAmount(perf.audience, plays[perf.playID].type))} (${perf.audience} seats)\n`;
}

function getVolumnCredits(audience: number, type: string): number {
    return "comedy" === type ? Math.floor(audience / 5) + Math.max(audience - 30, 0) : Math.max(audience - 30, 0);;
}

function formatUSD(value: number): string {
    return currencyUSD.format(value / 100);
}

function calcAmount(audience: number, type: string): number {
    if (dramaDic[type]) {
        return dramaDic[type](audience);
    }
    else {
        throw new Error(`unknown type: ${type}`);
    }
}




