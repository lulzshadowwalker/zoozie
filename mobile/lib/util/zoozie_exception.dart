import 'package:freezed_annotation/freezed_annotation.dart';

// part 'zoozie_error.freezed.dart';

// @freezed
final class ZoozieException implements Exception {
  const ZoozieException(
      {required this.userMessageKey, required this.debugMessage});

  final String userMessageKey;
  final String debugMessage;
  // const factory ZoozieException({
  //   /// The key to the message that should be displayed to the user.
  //   required String userMessageKey,

  //   /// The error code.
  //   required String debugMessage,
  // }) = _ZoozieException;
}
