export interface StudentsResponse {
  message: string
  data: Data
}

export interface Data {
  data:       Student[]
  pagination: Pagination
}

export interface Pagination { 
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}

export interface Student {
  id: string
  name: string
  email: string
  accountNumber: number
  identityNumber: string
  career: string
}