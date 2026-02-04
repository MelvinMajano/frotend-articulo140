export interface StudentsAttendance {
    message: Message;
    data:    null;
}

export interface Message {
    data:       Datum[];
    pagination: Pagination;
}

/**
 * Interfaz actualizada con attendanceId
 */
export interface Datum {
    attendanceId:  string;         // ID único del registro de asistencia
    name:          string;
    accountNumber: number;
    entryTime:     Date;
    exitTime:      Date;
    hoursAwarded:  number | null;
    Scope:         string;
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}
