import { ErrorTypes } from '@modules/common/enums';

export class CustomError extends Error {
  statusCode: number | null;

  type: ErrorTypes | null;

  constructor(message: string, statusCode: number | null = null, type?: ErrorTypes) {
    super(message);
    this.statusCode = statusCode;
    this.type = type || null;
  }
}
