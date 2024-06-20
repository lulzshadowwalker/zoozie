import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/l10n/l10n_imports.dart';

class Home extends ConsumerWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Builder(
        builder: (context) {
          return const Center(
            child: Text('hello, lulzie.'),
          );
        },
      ),
    );
  }
}
