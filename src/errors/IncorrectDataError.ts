import { constants } from 'node:http2';

class IncorrectDataError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

export default IncorrectDataError;
