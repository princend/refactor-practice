import { Invoice, Play, Performance } from "./models";


type Plays = { [key: string]: Play };

export default function statement(invoice: Invoice, plays: Plays): string {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = resultDic['init'](invoice.customer);

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        thisAmount = calcAmount(play.type, perf.audience);

        //add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        //add extra credit for every ten comedy attendees
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        //print line for this order
        result += resultDic['order'](play.name, thisAmount, perf.audience);
        totalAmount += thisAmount;
    }

    result += resultDic['end'](totalAmount, volumeCredits);
    return result;
}


const currencyUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
})

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


type dramaType = { [key: string]: (value: number) => number };

const dramaDic: dramaType = {
    tragedy: (audience: number) => audience > 30 ? (40000 + 1000 * (audience - 30)) : 40000,
    comedy: (audience: number) => audience > 20 ? 40000 + 500 * (audience - 20) + 300 * audience : 30000 + 300 * audience
}

const resultDic = {
    init: (customer: string) => `Statement for ${customer}\n`,
    order: (name: string, thisAmount: number, audience: number) => ` ${name}: ${formatUSD(thisAmount)} (${audience} seats)\n`,
    end: (totalAmount: number, volumeCredits: number) => `Amount owed is ${formatUSD(totalAmount)}\nYou earned ${volumeCredits} credits!\n`
}

