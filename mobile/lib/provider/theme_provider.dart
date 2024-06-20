import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/theme/zoozie_theme.dart';

final themeProvider = Provider<ZoozieTheme>((ref) {
  return ZoozieTheme(ref);
});
