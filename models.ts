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