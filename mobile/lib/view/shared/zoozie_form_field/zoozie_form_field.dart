// ignoreforfile: publicmemberapidocs, sortconstructorsfirst
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ZoozieFormField extends StatelessWidget {
  const ZoozieFormField({
    super.key,
    this.formFieldKey,
    this.initialValue,
    this.keyboardType,
    this.obscureText = false,
    this.validator,
    this.autocorrect = false,
    this.controller,
    this.maxLines = 1,
    this.hintText,
    this.label,
    this.labelText,
    this.prefixIcon,
    this.suffixIcon,
    this.inputFormatters,
    this.onSaved,
    this.onChanged,
    this.contentPadding,
    this.border,
    this.focusNode,
    this.enabled = true,
  });

  final String? initialValue;
  final TextInputType? keyboardType;
  final bool obscureText;
  final String? Function(String? value)? validator;
  final bool autocorrect;
  final TextEditingController? controller;
  final int? maxLines;
  final String? hintText;
  final Widget? label;
  final String? labelText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final List<TextInputFormatter>? inputFormatters;
  final void Function(String? value)? onSaved;
  final void Function(String value)? onChanged;
  final EdgeInsets? contentPadding;
  final InputBorder? border;
  final FocusNode? focusNode;
  final bool enabled;
  final Key? formFieldKey;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      key: formFieldKey,
      focusNode: focusNode,
      controller: controller,
      autocorrect: autocorrect,
      inputFormatters: inputFormatters,
      initialValue: initialValue,
      cursorWidth: 3,
      cursorRadius: const Radius.circular(50),
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      onSaved: onSaved,
      onChanged: onChanged,
      maxLines: maxLines,
      textAlignVertical: TextAlignVertical.center,
      decoration: InputDecoration(
        alignLabelWithHint: true,
        enabled: enabled,
        hintStyle: Theme.of(context)
            .textTheme
            .labelLarge
            ?.copyWith(color: Colors.grey.shade400),
        hintText: hintText,
        label: label,
        labelText: labelText,
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
      ),
    );
  }
}
