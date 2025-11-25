export const logger = {
  info(message: string, meta: any = {}) {
    console.log(JSON.stringify({
      level: "info",
      time: new Date().toISOString(),
      message,
      ...meta,
    }));
  },

  warn(message: string, meta: any = {}) {
    console.warn(JSON.stringify({
      level: "warn",
      time: new Date().toISOString(),
      message,
      ...meta,
    }));
  },

  error(message: string, meta: any = {}) {
    console.error(JSON.stringify({
      level: "error",
      time: new Date().toISOString(),
      message,
      ...meta,
    }));
  },
};