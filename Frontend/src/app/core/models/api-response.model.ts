export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp?: string;
}
