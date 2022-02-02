interface ErrorHandler extends Error {
  statusCode?: number;
  message: string;
}

class ErrorHandler extends Error {
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
  
export default ErrorHandler;


 


