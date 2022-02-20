import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, BadRequestException, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
	data: T;
}

@Injectable()
export class ErrorHandler<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		return next.handle().pipe(map(data => {
			if(data.statusCode >= 400) {
				throw new HttpException(data.message ?? 'Unexpected error.', data.statusCode ?? 400);
			}

			return data;
		}));
	}
}