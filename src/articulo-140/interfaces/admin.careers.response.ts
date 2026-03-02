export interface CareersResponse {
  message: string
  data: Data
}

export interface Data { 
  data:      Career[]
  pagination: Pagination
}

export interface Career {
  id: number
  code: string
  name: string
  faculty: string
  isDisabled: string
}

export interface Pagination {
    total:     number;
    page:      string;
    limit:     string;
    totalPage: number;
}