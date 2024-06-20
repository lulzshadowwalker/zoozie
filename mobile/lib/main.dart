import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/zoozie.dart';

void main() => runApp(
      const ProviderScope(
        child: Zoozie(),
      ),
    );
