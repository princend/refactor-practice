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
    let { totalAmount, result } = forrr(invoice, plays);

    let volumeCredits = invoice.performances.map(perf => getVolumnCredits(perf.audience, plays[perf.playID].type)).reduce((a, b) => a + b);
    result += resultDic['end'](totalAmount, volumeCredits);
    return result;
}

const currencyUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
})

function forrr(invoice: Invoice, plays: hash<Play>) {
    let totalAmount = 0;
    let result = resultDic['init'](invoice.customer);
    for (let perf of invoice.performances) {
        ({ totalAmount, result } = getInvoiceInfo(plays, perf, totalAmount, result));
    }
    return { totalAmount, result };
}

function getInvoiceInfo(plays: hash<Play>, perf: Performance, totalAmount: number, result: string) {
    const play = plays[perf.playID];
    let thisAmount = calcAmount(play.type, perf.audience);
    totalAmount += thisAmount;
    result += resultDic['order'](play.name, thisAmount, perf.audience);
    return { totalAmount, result };
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




