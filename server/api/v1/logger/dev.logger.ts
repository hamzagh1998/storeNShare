import winston from "winston";

const logFormat = winston.format.printf(({ level, message, stack, timestamp }) => {
  return `[${timestamp}]: ${level}: ${message || stack}`;
});

export function devLogger(): winston.Logger {

  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(), 
      winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),  
      winston.format.errors({stack: true}),
      logFormat
    ),
    transports: [
        new winston.transports.Console()
      ]
  });
};