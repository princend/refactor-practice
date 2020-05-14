import { Invoice, Play, Performance } from "./models";

type hash<T> = { [key: string]: T };
export type Plays = hash<Play>;
type CbFn<T, P> = (value: T) => P;
type DramaType = hash<CbFn<number, number>>;

const currencyUSDsetting = { style: "currency", currency: "USD", minimumFractionDigits: 2 }
const currencyUSD = new Intl.NumberFormat("en-US", currencyUSDsetting)
const formatUSD = (value: number) => currencyUSD.format(value / 100);

const dramaDic: DramaType = {
    tragedy: (audience: number) => 40000 + (audience > 30 ? (1000 * (audience - 30)) : 0),
    comedy: (audience: number) => 40000 + 300 * audience + (audience > 20 ? 500 * (audience - 20) : -10000)
}

const resultDic = {
    init: (customer: string) => `Statement for ${customer}\n`,
    order: (arr: Performance[], plays: hash<Play>) => arrReduce<string>(arr.map(perf => getInvoiceInfo(plays, perf))),
    end: (totalAmount: number, volumeCredits: number) => `Amount owed is ${formatUSD(totalAmount)}\nYou earned ${volumeCredits} credits!\n`
}

const arrReduce = <T>(arr: Array<T>) => arr.reduce((a: any, b: any) => a + b);
const getVolumnCredits = (audience: number, type: string) => Math.max(audience - 30, 0) + ("comedy" === type ? Math.floor(audience / 5) : 0)
const getInvoiceInfo = (plays: hash<Play>, perf: Performance) => ` ${plays[perf.playID].name}: ${formatUSD(calcAmount(perf.audience, plays[perf.playID].type))} (${perf.audience} seats)\n`;
const calcAmount = (audience: number, type: string) => { if (dramaDic[type]) return dramaDic[type](audience); throw new Error(`unknown type: ${type}`) }

export default function statement(invoice: Invoice, plays: Plays): string {
    const volumnCreditsArr: number[] = invoice.performances.map(perf => getVolumnCredits(perf.audience, plays[perf.playID].type));
    const AmountArr: number[] = invoice.performances.map(perf => calcAmount(perf.audience, plays[perf.playID].type))
    return resultDic['init'](invoice.customer) + resultDic['order'](invoice.performances, plays) + resultDic['end'](arrReduce<number>(AmountArr), arrReduce<number>(volumnCreditsArr));
}
