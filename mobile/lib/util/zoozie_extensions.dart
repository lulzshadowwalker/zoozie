import 'package:flutter/material.dart';
import 'package:zoozie/util/zoozie_const.dart';

import '../l10n/l10n_imports.dart';

extension NullAwareString on String? {
  int get length => '$this'.length;

  String get maybeAsEmpty => this ?? '';

  bool get isEmpty => this == null || !this!.isNotEmpty;
}

/// returns a list without the [null] values if any
extension CompactMap<T> on Iterable<T?> {
  Iterable<T> get toCompactMap =>
      map((e) => e).where((e) => e != null).toList().cast();
}

/// Extension method to remove null values from a map.
extension Compact<T, S> on Map<T, S> {
  /// Returns a new map with null values removed.
  Map<T, S> get compact =>
      Map.from(this)..removeWhere((key, value) => value == null);
}

extension DurationOperations on Duration {
  Duration operator +(Duration other) => Duration(
        days: inDays + other.inDays,
        hours: inHours + other.inHours,
        minutes: inMinutes + other.inMinutes,
        seconds: inSeconds + other.inSeconds,
        milliseconds: inMilliseconds + other.inMilliseconds,
        microseconds: inMicroseconds + other.inMicroseconds,
      );

  Duration operator -(Duration other) => Duration(
        days: inDays - other.inDays,
        hours: inHours - other.inHours,
        minutes: inMinutes - other.inMinutes,
        seconds: inSeconds - other.inSeconds,
        milliseconds: inMilliseconds - other.inMilliseconds,
        microseconds: inMicroseconds - other.inMicroseconds,
      );
}

extension ContextHeleprs on BuildContext {
  TextTheme get textTheme => Theme.of(this).textTheme;

  TextDirection get directionality => Directionality.of(this);

  // bool get canAnyPop => canPop() || Navigator.of(this).canPop();

  ThemeData get theme => Theme.of(this);

  MediaQueryData get mq => MediaQuery.of(this);

  ColorScheme get cs => Theme.of(this).colorScheme;

  ZL get sl => ZL.of(this);

  bool get isEn => ZL.of(this).localeName == ZoozieConst.english;
}
