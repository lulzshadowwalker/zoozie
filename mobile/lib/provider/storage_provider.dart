import 'dart:ui';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:zoozie/util/zoozie_config.dart';
import 'package:zoozie/util/zoozie_const.dart';

part 'storage_provider.g.dart';

@Riverpod(keepAlive: true)
Future<SharedPreferences> storage(StorageRef ref) async {
  return await SharedPreferences.getInstance();
}

// TODO: move this to a separate file and use an async notifier to expose a public API for switching the locale.
@Riverpod(keepAlive: true)
Future<Locale> locale(LocaleRef ref) async {
  final prefs = ref.watch(storageProvider).valueOrNull;
  final languageCode = prefs?.getString('languageCode') ??
      ZoozieConfig.defaultLocale.languageCode;

  return Locale(languageCode);
}
