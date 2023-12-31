import axios from 'axios';
import {StatusCodes} from 'http-status-codes';

export class ServiceError extends Error {
  statusCode: StatusCodes;
  constructor(message: string, statusCode: number, options?: ErrorOptions) {
    super(message, options);
    this.statusCode = statusCode;
  }
}

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(error);
    throw new ServiceError(
      `${error.code} ${error.message}`,
      error.status || StatusCodes.INTERNAL_SERVER_ERROR,
    );
  } else {
    console.error(error);
    throw error;
  }
};
