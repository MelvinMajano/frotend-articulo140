export interface DeletedActivitiesResponse {
  message: string
  data: Data
}

export interface Data {
  data: Datum[],
  pagination: Pagination
}

export interface Datum {
    id:             string;
    title:          string;
    description:    string;
    supervisor:     string;
    startDate:      string;
    endDate:        string;
    voaeHours:      number;
    scopes:         string[];
    availableSpots: number;
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}


