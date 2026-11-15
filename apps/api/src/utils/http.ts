import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { respondJson } from "./jsonRes";

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHENTICATED: 401,
	UNAUTHORIZED: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	TOO_MANY_REQUESTS: 429,
	SERVER_ERROR: 500,
} as const;

export type THttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export type ApiSuccess<T> = {
	readonly data: { readonly success: true; readonly data: T };
	readonly status: ContentfulStatusCode;
};

export type ApiError = {
	readonly data: { readonly success: false; readonly error: string };
	readonly status: ContentfulStatusCode;
};

export type HandlerResult<T> = ApiSuccess<T> | ApiError;

export function okResponseData<T>(
	data: T,
	status: ContentfulStatusCode = HTTP_STATUS.OK,
): ApiSuccess<T> {
	return {
		data: { success: true, data },
		status,
	} as const;
}

export function errorResponseData(
	error: string,
	status: ContentfulStatusCode = HTTP_STATUS.BAD_REQUEST,
): ApiError {
	return {
		data: { success: false, error },
		status,
	} as const;
}

export function invalidRequestResponseData(message = "Invalid request"): ApiError {
	return errorResponseData(message, HTTP_STATUS.BAD_REQUEST);
}

export function notFoundResponseData(message = "Resource not found"): ApiError {
	return errorResponseData(message, HTTP_STATUS.NOT_FOUND);
}

export function serverErrorResponseData(message = "Internal Server Error"): ApiError {
	return errorResponseData(message, HTTP_STATUS.SERVER_ERROR);
}

export function conflictResponseData(message = "Conflict"): ApiError {
	return errorResponseData(message, HTTP_STATUS.CONFLICT);
}

export function invalidRequestResponse(ctx: Context, message?: string) {
	return respondJson(ctx, invalidRequestResponseData(message));
}

export function notFoundResponse(ctx: Context, message?: string) {
	return respondJson(ctx, notFoundResponseData(message));
}

export function serverErrorResponse(ctx: Context, message?: string) {
	return respondJson(ctx, serverErrorResponseData(message));
}
