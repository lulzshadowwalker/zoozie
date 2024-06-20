import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/l10n/l10n_imports.dart';
import 'package:zoozie/provider/storage_provider.dart';
import 'package:zoozie/provider/theme_provider.dart';
import 'package:zoozie/provider/theme_mode_provider.dart';
import 'package:fl_country_code_picker/fl_country_code_picker.dart' as flc;
import 'package:zoozie/util/zoozie_config.dart';
import 'package:zoozie/view/listings/listings.dart';

class Zoozie extends StatelessWidget {
  const Zoozie({super.key});

  @override
  Widget build(BuildContext context) {
    return _EagerInitialization(
      child: Consumer(
        builder: (context, ref, child) {
          final locale = ref.watch(localeProvider);
          final theme = ref.watch(themeProvider);
          final themeMode = ref.watch(themeModeProvider);

          return MaterialApp(
            title: 'Zoozie',
            debugShowCheckedModeBanner: false,
            localizationsDelegates: const [
              ...ZL.localizationsDelegates,
              flc.CountryLocalizations.delegate,
            ],
            locale: locale.value ?? ZoozieConfig.defaultLocale,
            supportedLocales: [
              ...ZL.supportedLocales,
              ...flc.CountryLocalizations.supportedLocales.map(Locale.new),
            ],
            theme: theme.light(),
            darkTheme: theme.dark(),
            themeMode: themeMode,
            home: const Listings(),
          );
        },
      ),
    );
  }
}

class _EagerInitialization extends ConsumerWidget {
  const _EagerInitialization({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(localeProvider);
    return child;
  }
}
