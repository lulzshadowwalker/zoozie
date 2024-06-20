import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/l10n/l10n_imports.dart';
import 'package:zoozie/domain/phone_number.dart';
import 'package:zoozie/view/shared/country_code_picker/country_code_picker.dart';
import 'package:zoozie/view/shared/zoozie_form_field/zoozie_form_field.dart';

class PhoneNumberFormField extends HookWidget {
  const PhoneNumberFormField({
    this.onChanged,
    super.key,
  });

  final Function(PhoneNumber phoneNumber)? onChanged;
  @override
  Widget build(BuildContext context) {
    final countryCode =
        useState<String>(CountryCodePicker.defaultCountryCode.dialCode);
    final number = useState<String?>(null);

    useEffect(() {
      if (onChanged != null) {
        onChanged!(PhoneNumber(
          countryCode: countryCode.value,
          number: number.value ?? '',
        ));
      }

      return null;
    }, [countryCode.value, number.value]);

    return Column(
      children: [
        CountryCodePicker(
          onSelected: (value) => countryCode.value = value,
        ),
        ZoozieFormField(
          label: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                FontAwesomeIcons.mobile,
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                ZL.of(context).phoneNumber,
                style: context.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          hintText: '07● ●●● ●●●●',
          keyboardType: TextInputType.phone,
          onChanged: (value) => number.value = value,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return ZL.of(context).phoneNumberRequired;
            }

            return null;
          },
        ),
      ],
    );
  }
}
