import 'package:fl_country_code_picker/fl_country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/l10n/l10n_imports.dart';
import 'package:zoozie/view/shared/zoozie_form_field/zoozie_form_field.dart';

class CountryCodePicker extends HookWidget {
  const CountryCodePicker({
    this.onSelected,
    super.key,
  });

  // ? is this affected by localization
  static const defaultCountryCode = CountryCode(
    name: "Jordan",
    code: "JO",
    dialCode: "+962",
  );

  final Function(String countryCode)? onSelected;
  @override
  Widget build(BuildContext context) {
    final controller =
        useTextEditingController(text: defaultCountryCode.dialCode);
    final selected = useState<CountryCode>(defaultCountryCode);

    final countryPickerWithParams = FlCountryCodePicker(
      localize: true,
      showDialCode: true,
      showSearchBar: true,
      searchBarDecoration: InputDecoration(
        hintText: ZL.of(context).countryCodeSearchPlaceholder,
        hintStyle: context.textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.w500,
          color: Colors.grey.shade400,
        ),
        suffixIcon: Icon(
          FontAwesomeIcons.magnifyingGlass,
          color: Colors.grey.shade400,
        ),
      ),
      title: Padding(
        padding: const EdgeInsets.fromLTRB(16, 28, 16, 16),
        child: Text(
          ZL.of(context).countryCode,
          style: context.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );

    return GestureDetector(
      onTap: () async {
        final picked = await countryPickerWithParams.showPicker(
          context: context,
          pickerMaxHeight: 650,
          scrollToDeviceLocale: true,
          backgroundColor: context.theme.scaffoldBackgroundColor,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(10),
            ),
          ),
        );

        if (picked != null) {
          controller.text = '${picked.dialCode} (${picked.name})';
          selected.value = picked;

          if (onSelected != null) {
            onSelected!(picked.dialCode);
          }
        }
      },
      child: ZoozieFormField(
        controller: controller,
        enabled: false,
        suffixIcon: const Icon(
          FontAwesomeIcons.angleDown,
          size: 16,
        ),
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            CountryCodeFlagWidget(
              width: 16,
              alignment: Alignment.centerLeft,
              countryCode: selected.value,
            ),
            const SizedBox(width: 8),
            Text(
              ZL.of(context).countryCode,
              style: context.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
