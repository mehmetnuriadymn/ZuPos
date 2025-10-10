// Base API Response types
export interface Response<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface Request<T = unknown> {
  data: T;
}

// Base error type
export interface ApiError {
  message: string;
  statusCode: number;
  details?: string;
}
