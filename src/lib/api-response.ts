import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      errorCode: null,
      message: null,
    },
    { status }
  );
}

export function apiError(
  errorCode: ApiErrorCode,
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      errorCode,
      message,
    },
    { status }
  );
}
