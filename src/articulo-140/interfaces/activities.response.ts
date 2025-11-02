export interface ActivityResponse {
    message: string;
    data:    Data;
}

export interface Data {
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id:             string;
    title:          string;
    description:    string;
    startDate:      string;
    endDate:        string;
    voaeHours:      number;
    availableSpots: number;
    status:         string;
    isDeleted:      string;
    isDisabled:     string;
    Supervisor:     string;
    supervisorId:   string;
    scopes:         string[];
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}
