export interface ResponseDto<T = any> {
    data: T;
    message?: string;
}

export interface SuccessResponse<T> {
    statusCode: number;
    data: T;
    message: string;
}

export interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string;
}

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;
