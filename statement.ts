import { Tragedy, Invoice, Performance, Plays, format, Statement, Comedy, ADrama, Dramas } from "./models";


const drama: Dramas = { tragedy: new Tragedy(), comedy: new Comedy() }

export default function statement(invoice: Invoice, plays: Plays): string {
    let statement: Statement = new Statement();
    statement.getInitResult(invoice.customer);

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = calcAmount(play.type, perf.audience);;
        statement.volumeCredits += drama[play.type].calcVolumeCredit(perf.audience);
        statement.totalAmount += thisAmount;
        statement.result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    }

    statement.getEndResult();
    return statement.result;
}

function calcAmount(type: string, audience: number) {
    if (drama[type]) {
        return drama[type].calcAmount(audience);
    }
    else {
        throw new Error(`unknown type: ${type}`);
    }
}

