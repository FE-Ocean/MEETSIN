import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto, SuccessResponse } from "../interfaces/response.interface";

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
        );
    }
}
