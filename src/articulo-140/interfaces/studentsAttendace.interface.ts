export interface StudentsAttendance {
    message: Message;
    data:    null;
}

export interface Message {
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    name:          string;
    accountNumber: number;
    entryTime:     Date;
    exitTime:      Date;
    hoursAwarded:  null;
    Scope:         string;
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}
