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

export type hash<T> = { [key: string]: T };
export type Plays = hash<Play>;
export type CbFn<T, P> = (value: T) => P;
export type DramaType = hash<CbFn<number, number>>;