export default class Config {
  static get environment() {
    return process.env.NODE_ENV;
  }
  static get baseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("env.NEXT_PUBLIC_BASE_URL is not set");
    }

    return baseUrl;
  }
  static get apiBaseUrl(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error("env.NEXT_PUBLIC_API_BASE_URL is not set");
    }

    return apiBaseUrl;
  }
  static get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("env.JWT_SECRET is not set");
    }

    return secret;
  }
  static get translationApiBaseUrl(): string | undefined {
    const url = process.env.NEXT_PUBLIC_TRANSLATION_API_BASE_URL;
    if (!url) {
      console.error("env.NEXT_PUBLIC_TRANSLATION_API_BASE_URL is not set");
      return undefined;
    }

    return url;
  }
}
