import { Invoice, Plays, format, Statement, drama } from "./models";

export default function statement(invoice: Invoice, plays: Plays): string {
    let statement: Statement = new Statement();
    statement.getInitResult(invoice.customer);
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        const perfDrama = drama[play.type];
        const thisAmount = calcAmount(play.type, perf.audience);
        const amountDescription = formatThisAmount(thisAmount);
        let credit = perfDrama.calcVolumeCredit(perf.audience)
        statement.accumulateVolumeCredits(credit);
        statement.accumulateTotalAmount(thisAmount);
        statement.getPerformanceResult(play.name, amountDescription, perf.audience)
    }
    statement.getEndResult();
    return statement.result;
}

const formatThisAmount = (thisAmount: number): string => format(thisAmount / 100);

function calcAmount(type: string, audience: number) {
    if (drama[type]) {
        return drama[type].calcAmount(audience);
    }
    else {
        throw new Error(`unknown type: ${type}`);
    }
}

