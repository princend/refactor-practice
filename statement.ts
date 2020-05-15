import { Invoice, Play, Performance, DramaType, hash, Plays } from "./models";

const currencyUSDsetting = { style: "currency", currency: "USD", minimumFractionDigits: 2 }
const currencyUSD = new Intl.NumberFormat("en-US", currencyUSDsetting)
const formatUSD = (value: number) => currencyUSD.format(value / 100);

const dramaDic: DramaType = {
    tragedy: (audience: number) => 40000 + (audience > 30 ? (1000 * (audience - 30)) : 0),
    comedy: (audience: number) => 40000 + 300 * audience + (audience > 20 ? 500 * (audience - 20) : -10000)
}

const resultDic = {
    init: (customer: string) => `Statement for ${customer}\n`,
    order: (arr: Performance[], plays: hash<Play>) => arrReduce<string>(arr.map(perf => getInvoiceInfo(perf.audience, getPerformanceType(plays, perf), getPerformanceName(plays, perf)))),
    end: (totalAmount: number, volumeCredits: number) => `Amount owed is ${formatUSD(totalAmount)}\nYou earned ${volumeCredits} credits!\n`
}

const getPerformanceType = (plays: Plays, perf: Performance) => plays[perf.playID].type;
const getPerformanceName = (plays: Plays, perf: Performance) => plays[perf.playID].name;
const arrReduce = <T>(arr: Array<T>) => arr.reduce((a: any, b: any) => a + b);
const getVolumnCredits = (audience: number, type: string) => Math.max(audience - 30, 0) + ("comedy" === type ? Math.floor(audience / 5) : 0)
const getInvoiceInfo = (audience: number, type: string, name: string) => ` ${name}: ${formatUSD(calcAmount(audience, type))} (${audience} seats)\n`;
const calcAmount = (audience: number, type: string) => { if (dramaDic[type]) return dramaDic[type](audience); throw new Error(`unknown type: ${type}`) }

export default function statement(invoice: Invoice, plays: Plays): string {
    const volumnCreditsArr: number[] = invoice.performances.map(perf => getVolumnCredits(perf.audience, getPerformanceType(plays, perf)));
    const AmountArr: number[] = invoice.performances.map(perf => calcAmount(perf.audience, getPerformanceType(plays, perf)))
    return resultDic['init'](invoice.customer) + resultDic['order'](invoice.performances, plays) + resultDic['end'](arrReduce<number>(AmountArr), arrReduce<number>(volumnCreditsArr));
}
