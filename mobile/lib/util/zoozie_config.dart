import 'dart:ui';

import 'package:envied/envied.dart';
import 'package:zoozie/util/zoozie_const.dart';

part 'zoozie_config.g.dart';

@Envied(path: '.env')
abstract class ZoozieConfig {
  @EnviedField(varName: 'API_BASE_URL')
  static const String apiBaseUrl = _ZoozieConfig.apiBaseUrl;

  @EnviedField(varName: 'TRANSLATION_API_BASE_URL')
  static const String translationApiBaseUrl =
      _ZoozieConfig.translationApiBaseUrl;

  @EnviedField(varName: 'POSTHOG_KEY')
  static const String postHogKey = _ZoozieConfig.postHogKey;

  @EnviedField(varName: 'POSTHOG_HOST')
  static const String postHogHost = _ZoozieConfig.postHogHost;

  @EnviedField(varName: 'POSTHOG_API_KEY')
  static const String postHogApiKey = _ZoozieConfig.postHogApiKey;

  @EnviedField(varName: 'STRAPI_BASE_URL')
  static const String strapiBaseUrl = _ZoozieConfig.strapiBaseUrl;

  @EnviedField(varName: 'STRAPI_ACCESS_TOKEN')
  static const String strapiAscessToken = _ZoozieConfig.strapiAscessToken;

  static const Locale defaultLocale = Locale(ZoozieConst.english);
}
