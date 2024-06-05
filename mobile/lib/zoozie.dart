import 'package:flutter/material.dart';
import 'package:zoozie/l10n/l10n_imports.dart';

class Zoozie extends StatelessWidget {
  const Zoozie({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zoozie',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: ZL.localizationsDelegates,
      supportedLocales: ZL.supportedLocales,
      home: Scaffold(
        body: Builder(
          builder: (context) {
            return Center(
              child: Text(ZL.of(context).hello("Lulzie")),
            );
          },
        ),
      ),
    );
  }
}
