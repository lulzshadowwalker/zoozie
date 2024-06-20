import 'package:logger/logger.dart';

class ZoozieLogPrinter extends PrettyPrinter {
  ZoozieLogPrinter(this.className);

  final String className;

  @override
  List<String> log(LogEvent event) {
    final levelEmjois = PrettyPrinter.defaultLevelEmojis
      ..[Level.info] = '💡'
      ..[Level.trace] = '🫣😶‍🌫️'
      ..[Level.error] = '🤬'
      ..[Level.warning] = '🚧'
      ..[Level.fatal] = '🤦🏼‍♀️'
      ..[Level.debug] = '🐞';

    /// I don't think those colors are supported are supported in the vscode
    /// as stated in the package docs
    final color = PrettyPrinter.defaultLevelColors[event.level];
    final emoji = '\t${levelEmjois[event.level]}';

    return [color!('$emoji $className | ${event.message}')];
  }
}
