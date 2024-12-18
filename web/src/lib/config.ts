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
  static get strapiBaseUrl(): string {
    return ""
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
    if (!strapiBaseUrl) {
      throw new Error("env.NEXT_PUBLIC_STRAPI_BASE_URL is not set");
    }

    // return strapiBaseUrl;
  }
  static get strapiAccessToken(): string {
    return ""
    // const token = process.env.STRAPI_ACCESS_TOKEN;
    // if (!token) {
    //   throw new Error("env.STRAPI_ACCESS_TOKEN is not set");
    // }

    // return token;
  }
  static get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("env.JWT_SECRET is not set");
    }

    return secret;
  }
  static get translationApiBaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_TRANSLATION_API_BASE_URL;
    if (!url) {
      throw new Error("env.NEXT_PUBLIC_TRANSLATION_API_BASE_URL is not set");
    }

    return url;
  }
  static get postHogKey(): string {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) {
      throw new Error("env.NEXT_PUBLIC_POSTHOG_KEY is not set");
    }

    return key;
  }
  static get postHogHost(): string {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!host) {
      throw new Error("env.NEXT_PUBLIC_POSTHOG_HOST is not set");
    }

    return host;
  }
  static get postHogApiKey(): string {
    const key = process.env.POSTHOG_API_KEY;
    if (!key) {
      throw new Error("env.POSTHOG_API_KEY is not set");
    }

    return key;
  }
}
