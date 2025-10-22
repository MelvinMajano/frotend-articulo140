export interface EstudentsResponse {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:            string;
    name:          string;
    accountNumber: number;
    entryTime:     Date;
    exitTime:      Date;
}
