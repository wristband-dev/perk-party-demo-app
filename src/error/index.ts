export class FetchError<Response> extends Error {
  res?: Response;
  statusCode: number;

  constructor(statusCode = 500, message = 'Internal Server Error', res: Response) {
    super(message);
    this.name = 'FetchError';
    this.statusCode = statusCode;
    this.res = res;
  }
}
