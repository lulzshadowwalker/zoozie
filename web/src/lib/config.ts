export class Config {
  static get environment() {
    return process.env.NODE_ENV;
  }
  static get baseUrl() {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
}
