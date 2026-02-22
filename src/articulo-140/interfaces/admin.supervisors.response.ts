export interface SupervisorsResponse {
  message: string;
  data:    Data;
}

export interface Data {
  data:       Datum[];
  pagination: Pagination;
}

export interface Datum {
  id:             string;
  name:           string;
  email:          string;
  accountNumber:  number;
  identityNumber: string;
  career:         string;
  isDeleted:      string;
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}
