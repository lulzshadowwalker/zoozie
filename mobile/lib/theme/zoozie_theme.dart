import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/theme/zoozie_colors.dart';

final class ZoozieTheme {
  ZoozieTheme(this.ref);
  final Ref ref;

  static final String? enFontFamily = GoogleFonts.inter().fontFamily;
  static final String? arFontFamily = GoogleFonts.inter().fontFamily;

  String? get _fontFamily =>
      // ref.read(asyncL10nProvider).value?.languageCode == SalmonConst.en
      //     ? enFontFamily
      //     : enFontFamily;
      // TODO: Use a localized font family
      enFontFamily;

  static final _dividerThemeData = DividerThemeData(
    thickness: 2,
    indent: 15,
    endIndent: 15,
    color: Colors.grey.shade400,
  );

  static final _elevatedButtonTheme = ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: _seedColor,
      foregroundColor: ZoozieColors.white,
      splashFactory: InkSplash.splashFactory,
      // overlayColor: ZoozieColors.vividOrange,
      // minimumSize: const Size.fromHeight(56),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      textStyle: const TextStyle(
        fontSize: 16,
      ),
    ),
  );

  static final _bottomNavBarTheme = BottomNavigationBarThemeData(
    backgroundColor: Colors.transparent,
    elevation: 0,
    unselectedIconTheme: IconThemeData(
      color: Colors.grey.shade400,
      size: 30,
    ),
    showUnselectedLabels: false,
    showSelectedLabels: false,
  );

  static final _outlinedButtonTheme = OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      side: const BorderSide(
        color: _seedColor,
      ),
      // minimumSize: const Size.fromHeight(42),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
  );

  static const _seedColor = ZoozieColors.orange;

  ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(
      brightness: Brightness.light,
      seedColor: _seedColor,
    ).copyWith(primary: _seedColor);

    return ThemeData.light().copyWith(
      //
      colorScheme: colorScheme.copyWith(
        surfaceContainerHighest: Colors.blueGrey.shade50,
      ),

      drawerTheme: const DrawerThemeData(
        backgroundColor: ZoozieColors.white,
      ),

      //
      iconTheme: const IconThemeData(
        color: ZoozieColors.black,
      ),

      //
      // inputDecorationTheme: ,
      inputDecorationTheme: InputDecorationTheme(
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: ZoozieColors.black),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade400),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.red.shade400),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.red),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey),
        ),
        errorStyle: TextStyle(color: Colors.red),
      ),

      //
      textTheme: ThemeData.light().textTheme.apply(
            fontFamily: _fontFamily,
            bodyColor: ZoozieColors.black,
            displayColor: ZoozieColors.black,
            decorationColor: ZoozieColors.black,
          ),

      //
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: ZoozieColors.black,
        elevation: 0,
        centerTitle: true,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),

      //
      scaffoldBackgroundColor: ZoozieColors.white,

      //
      dividerTheme: _dividerThemeData,

      //
      elevatedButtonTheme: _elevatedButtonTheme,

      //
      outlinedButtonTheme: _outlinedButtonTheme,

      //
      bottomNavigationBarTheme: _bottomNavBarTheme.copyWith(
        selectedIconTheme: IconThemeData(
          color: colorScheme.primary,
          size: 30,
        ),
      ),

      //
      splashColor: colorScheme.primaryContainer,
      highlightColor: Colors.transparent,
    );
  }

  ThemeData dark() {
    final colorScheme = ColorScheme.fromSeed(
      brightness: Brightness.dark,
      seedColor: const Color.fromARGB(255, 103, 146, 238),
    ).copyWith(
      surfaceContainerHighest: Colors.blueGrey.shade100,
    );

    return ThemeData.dark().copyWith(
      useMaterial3: true,

      //
      colorScheme: colorScheme,

      drawerTheme: const DrawerThemeData(
        backgroundColor: ZoozieColors.black,
      ),

      //
      iconTheme: const IconThemeData(
        color: ZoozieColors.white,
      ),

      //
      textTheme: ThemeData.dark().textTheme.apply(
            fontFamily: _fontFamily,
            bodyColor: ZoozieColors.white,
            displayColor: ZoozieColors.white,
            decorationColor: ZoozieColors.white,
          ),

      //
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: ZoozieColors.white,
        elevation: 0,
        centerTitle: true,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),

      //
      scaffoldBackgroundColor: ZoozieColors.black,

      //
      dividerTheme: _dividerThemeData,

      //
      elevatedButtonTheme: _elevatedButtonTheme,

      //
      outlinedButtonTheme: _outlinedButtonTheme,

      //
      bottomNavigationBarTheme: _bottomNavBarTheme.copyWith(
        selectedIconTheme: IconThemeData(
          color: colorScheme.primary,
          size: 30,
        ),
      ),

      //
      splashColor: colorScheme.primaryContainer,
      highlightColor: Colors.transparent,
    );
  }

  /// returns light by default, unless changed by the user in the settings.
  static ThemeMode get themeMode {
    // TODO: Implement theme mode
    return ThemeMode.light;
    // final themeMode = GetStorage().read<String>(SalmonConst.skThemeMode);
    // switch (themeMode) {
    //   case SalmonConst.systemDefault:
    //     return ThemeMode.system;
    //   case SalmonConst.light:
    //     return ThemeMode.light;
    //   case SalmonConst.dark:
    //     return ThemeMode.dark;
    //   default:
    //     return ThemeMode.light;
    // }
  }
}
