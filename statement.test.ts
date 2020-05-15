import statement from "./statement";
import {Play, Invoice} from "./models";

test('Test in js file', () => {
    const invoice: Invoice =
        {
            customer: "BigCo",
            performances: [
                {playID: "hamlet", audience: 55},
                {playID: "as-like", audience: 35},
                {playID: "othello", audience: 40}
            ]
        };

    const plays: { [key: string]: Play } = {
        "hamlet": {name: "Hamlet", type: "tragedy"},
        "as-like": {name: "As You Like It", type: "comedy"},
        "othello": {name: "Othello", type: "tragedy"}
    };

    expect(statement(invoice, plays))
        .toBe('Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits!\n')
})



