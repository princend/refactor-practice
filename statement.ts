import { Invoice, Play, Performance } from "./models";

type hash<T> = { [key: string]: T };
export type Plays = hash<Play>;
type CbFn<T, P> = (value: T) => P;
type DramaType = hash<CbFn<number, number>>;

const dramaDic: DramaType = {
    tragedy: (audience: number) => audience > 30 ? (40000 + 1000 * (audience - 30)) : 40000,
    comedy: (audience: number) => audience > 20 ? 40000 + 500 * (audience - 20) + 300 * audience : 30000 + 300 * audience
}

const resultDic = {
    init: (customer: string) => `Statement for ${customer}\n`,
    order: (name: string, thisAmount: number, audience: number) => ` ${name}: ${formatUSD(thisAmount)} (${audience} seats)\n`,
    end: (totalAmount: number, volumeCredits: number) => `Amount owed is ${formatUSD(totalAmount)}\nYou earned ${volumeCredits} credits!\n`
}

export default function statement(invoice: Invoice, plays: Plays): string {
    let volumeCredits = invoice.performances.map(perf => getVolumnCredits(perf.audience, plays[perf.playID].type)).reduce((a, b) => a + b);
    let totalAmount = invoice.performances.map(perf => calcAmount(plays[perf.playID].type, perf.audience)).reduce((a, b) => a + b);
    let result = resultDic['init'](invoice.customer) + invoice.performances.map(perf => getInvoiceInfo(plays, perf)).reduce((a, b) => a + b) + resultDic['end'](totalAmount, volumeCredits);
    return result;
}

const currencyUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
})


function getInvoiceInfo(plays: hash<Play>, perf: Performance) {
    return resultDic['order'](plays[perf.playID].name, calcAmount(plays[perf.playID].type, perf.audience), perf.audience);
}

function getVolumnCredits(audience: number, type: string): number {
    return "comedy" === type ? Math.floor(audience / 5) + Math.max(audience - 30, 0) : Math.max(audience - 30, 0);;
}

function formatUSD(value: number): string {
    return currencyUSD.format(value / 100);
}

function calcAmount(type: string, audience: number): number {
    if (dramaDic[type]) {
        return dramaDic[type](audience);
    }
    else {
        throw new Error(`unknown type: ${type}`);
    }
}




