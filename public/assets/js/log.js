class Log {
  static d(log) {
    if (APP_DEBUG) {
      console.log(log);
    }
  }
}
