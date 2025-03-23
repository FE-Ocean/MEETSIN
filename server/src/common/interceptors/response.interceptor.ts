import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ResponseDto, SuccessResponse, ErrorResponse } from "../interfaces/response.interface";
import { throwError } from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        return next.handle().pipe(
            map((response) => {
                const responseData = response as ResponseDto<T>;
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    data: responseData?.data ?? response,
                    message: responseData?.message ?? "success",
                } as SuccessResponse<T>;
            }),
            catchError((err) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = err.status || 500;

                // class-validator 에러 처리
                if (err?.response?.message && Array.isArray(err.response.message)) {
                    const errorResponse = {
                        statusCode,
                        message: err.response.message[0],
                        error: err instanceof HttpException ? (err.getResponse() as any).error : "Bad Request"
                    };
                    response.status(statusCode).json(errorResponse);
                    return throwError(() => errorResponse);
                }

                // 일반 에러 처리
                const errorResponse = {
                    statusCode,
                    message: err.message || "Internal server error",
                    error: err instanceof HttpException ? (err.getResponse() as any).error : "Error"
                };
                response.status(statusCode).json(errorResponse);
                return throwError(() => errorResponse);
            })
        );
    }
}
