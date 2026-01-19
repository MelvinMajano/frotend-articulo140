export interface AttendanceImportError {
  row?: number;
  issues?: string[];
  message?: string;
}
export interface AttendanceImportSummary {
  created: number;
  existing: number;
  registered: number;
  attendanceSaved: number;
  errors: AttendanceImportError[];
}
export interface AttendanceImportResponse {
  success?: boolean;
  message: string;
  data?: AttendanceImportSummary;
}