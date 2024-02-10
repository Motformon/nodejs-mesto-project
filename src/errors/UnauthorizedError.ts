import { constants } from 'node:http2';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

export default UnauthorizedError;
