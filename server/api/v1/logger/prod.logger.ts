import winston from "winston";
import path from "path";

export function prodLogger(): winston.Logger {
  
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),  
      winston.format.errors({stack: true}),
      winston.format.json()
    ),
    transports: [
        new winston.transports.File({
          filename: path.resolve(__dirname, "..", "..", "..", "public", "logs/info.log"),
          level: "info",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
        new winston.transports.File({
          filename: path.resolve(__dirname, "..", "..", "..", "public", "logs/warn.log"),
          level: "warn",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
        new winston.transports.File({
          filename: path.resolve(__dirname, "..", "..", "..", "public", "logs/error.log"),
          level: "error",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ]
  });
}