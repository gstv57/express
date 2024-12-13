export const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} = ${request.url} - ${new Date().toString()}`);
  console.log("Finished Logging");
  next();
};
