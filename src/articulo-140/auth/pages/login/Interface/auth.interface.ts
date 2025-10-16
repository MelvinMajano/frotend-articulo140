export interface AuthResponse {
    message: string;
    data:    Data;
}

export interface Data {
    user:  User;
    token: string;
}

export interface User {
    id:        string;
    name:      string;
    email:     string;
    role:      string;
    isDeleted: string;
}
