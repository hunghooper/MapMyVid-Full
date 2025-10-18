import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/error-messages.js';

export class CustomValidationException extends HttpException {
  constructor(message: string | string[]) {
    super(
      {
        message: Array.isArray(message) ? message : [message],
        error: 'Validation Error',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CustomNotFoundException extends HttpException {
  constructor(resource: string) {
    super(
      {
        message: [`${resource} not found`],
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CustomUnauthorizedException extends HttpException {
  constructor(message: string = ERROR_MESSAGES.AUTH.UNAUTHORIZED_ACCESS) {
    super(
      {
        message: [message],
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class CustomForbiddenException extends HttpException {
  constructor(message: string = ERROR_MESSAGES.AUTH.ACCESS_FORBIDDEN) {
    super(
      {
        message: [message],
        error: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
