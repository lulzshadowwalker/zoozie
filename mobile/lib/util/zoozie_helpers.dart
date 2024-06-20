import 'package:logger/logger.dart';
import 'package:zoozie/util/zoozie_log_printer.dart';

final class ZoozieHelpers {
  /// Instantiate a [Logger] instance with the neseccary boilerplate code
  static Logger getLogger(String className) => Logger(
        printer: ZoozieLogPrinter(className),
        level: Level.all,
      );
}
