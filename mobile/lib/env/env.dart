import 'package:envied/envied.dart';

part 'env.g.dart';

@Envied(path: '.env')
abstract class Env {
  @EnviedField(varName: 'API_BASE_URL', obfuscate: true)
  static final String apiBaseUrl = _Env.apiBaseUrl;

  @EnviedField(varName: 'TRANSLATION_API_BASE_URL', obfuscate: true)
  static final String translationApiBaseUrl = _Env.translationApiBaseUrl;

  @EnviedField(varName: 'POSTHOG_KEY', obfuscate: true)
  static final String postHogKey = _Env.postHogKey;

  @EnviedField(varName: 'POSTHOG_HOST', obfuscate: true)
  static final String postHogHost = _Env.postHogHost;

  @EnviedField(varName: 'POSTHOG_API_KEY', obfuscate: true)
  static final String postHogApiKey = _Env.postHogApiKey;

  @EnviedField(varName: 'STRAPI_BASE_URL', obfuscate: true)
  static final String strapiBaseUrl = _Env.strapiBaseUrl;

  @EnviedField(varName: 'STRAPI_ACCESS_TOKEN', obfuscate: true)
  static final String strapiAscessToken = _Env.strapiAscessToken;
}
