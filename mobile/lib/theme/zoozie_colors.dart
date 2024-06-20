import 'package:flutter/material.dart';

final class ZoozieColors {
  static Color fromHex(String hexColor, [String opacity = 'FF']) {
    final String color = hexColor.replaceAll('#', '');
    return Color(int.parse(opacity + color, radix: 16));
  }

  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF242424);

  static const Color orange = Color(0xFFFFC26F);
  static const Color vividOrange = Color(0XFFFCBA03);
}
