import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:zoozie/provider/storage_provider.dart';

class ApiClientOptions {
  final String baseUrl;
  final String? apiKey;

  const ApiClientOptions({
    required this.baseUrl,
    this.apiKey,
  });
}

final dioProvider = Provider.family<Dio, ApiClientOptions>(
  (ref, clientOptions) {
    final dio = Dio(
      BaseOptions(
        baseUrl: clientOptions.baseUrl,
        connectTimeout: const Duration(seconds: 3),
        sendTimeout: const Duration(seconds: 3),
      ),
    );

    dio.interceptors.add(PrettyDioLogger(
      requestHeader: kDebugMode,
      responseHeader: false,
      responseBody: false,
    ));

    if (clientOptions.apiKey != null) {
      dio.interceptors.add(InterceptorsWrapper(
        onRequest: (options, handler) {
          options.headers['Authorization'] = 'Bearer ${clientOptions.apiKey}';
          return handler.next(options);
        },
      ));
    }

    return dio;
  },
);

final lulzieApiClient = Provider<Dio>((ref) {
  final locale = ref.watch(localeProvider).requireValue.languageCode;

  final options = ApiClientOptions(
    baseUrl: 'http://localhost:42069/api/$locale',
    apiKey: '',
  );

  return ref.watch(dioProvider(options));
});

final strapiApiClient = Provider<Dio>((ref) {
  const options = ApiClientOptions(baseUrl: 'http://localhost:1337/api');
  return ref.watch(dioProvider(options));
});
