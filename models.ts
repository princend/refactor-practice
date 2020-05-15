export interface Play {
    name: string;
    type: string;
}

export interface Performance {
    playID: string;
    audience: number;
}

export interface Invoice {
    customer: string;
    performances: Performance[];
}



export type hash<T> = { [key: string]: T }
export type Plays = hash<Play>;
export type Dramas = hash<ADrama>;

export const currencySetting = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
};
export const format = new Intl.NumberFormat("en-US", currencySetting).format;


export abstract class AStateMent {
    totalAmount = 0;
    volumeCredits = 0;
    result = '';

    getInitResult(...arg: any[]) { }
    getEndResult(...arg: any[]) { }
}

export class Statement extends AStateMent {

    getInitResult(customer: string) { this.result = `Statement for ${customer}\n` };
    getEndResult() {
        this.result += `Amount owed is ${format(this.totalAmount / 100)}\n`;
        this.result += `You earned ${this.volumeCredits} credits!\n`;
    };
}

export abstract class ADrama {
    calcAmount(audience: number, ...arg: any[]): any { }
    calcVolumeCredit(audience: number, ...arg: any[]): number { return Math.max(audience - 30, 0); }
}

export class Tragedy extends ADrama {
    calcAmount(audience: number) {
        return 40000 + (audience > 30 ? 1000 * (audience - 30) : 0)
    }

}

export class Comedy extends ADrama {
    calcAmount(audience: number) {
        return 40000 + 300 * audience + (audience > 20 ? 500 * (audience - 20) : -10000)
    }

    calcVolumeCredit(audience: number) {
        return Math.max(audience - 30, 0) + Math.floor(audience / 5)
    }
}
