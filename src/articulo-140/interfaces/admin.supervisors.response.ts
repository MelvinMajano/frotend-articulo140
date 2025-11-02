export interface SupervisorsResponse {
  message: string;
  data:    Supervisor[];
}

export interface Supervisor {
  id:             string;
  name:           string;
  email:          string;
  accountNumber:  number;
  identityNumber: string;
  career:         string;
}
