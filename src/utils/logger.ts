type LogLevel = "info" | "warn" | "error";

type LogMetadata = Record<string, unknown>;

function formatMetadata(metadata?: LogMetadata) {
  return metadata ? ` ${JSON.stringify(metadata)}` : "";
}

function writeLog(level: LogLevel, message: string, metadata?: LogMetadata) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}${formatMetadata(metadata)}`;

  if (level === "error") {
    console.error(logMessage);
    return;
  }

  if (level === "warn") {
    console.warn(logMessage);
    return;
  }

  console.log(logMessage);
}

export const logger = {
  info(message: string, metadata?: LogMetadata) {
    writeLog("info", message, metadata);
  },

  warn(message: string, metadata?: LogMetadata) {
    writeLog("warn", message, metadata);
  },

  error(message: string, metadata?: LogMetadata) {
    writeLog("error", message, metadata);
  },
};
