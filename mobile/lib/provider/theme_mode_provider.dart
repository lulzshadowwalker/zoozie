import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/theme/zoozie_theme.dart';

final themeModeProvider = StateNotifierProvider<ThemeModeController, ThemeMode>(
    (ref) => ThemeModeController(ZoozieTheme.themeMode));

class ThemeModeController extends StateNotifier<ThemeMode> {
  ThemeModeController(super.mode);

  Future<void> mode(ThemeMode mode) async {
    // TODO: persist the theme mode for future sessions
    state = mode;
  }
}
