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


export type Plays = { [key: string]: Play };

export const currencySetting = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
};
export const format = new Intl.NumberFormat("en-US", currencySetting).format;