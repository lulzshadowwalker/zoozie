import 'package:cached_network_image/cached_network_image.dart';
import 'package:fl_country_code_picker/fl_country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/view/shared/country_code_picker/country_code_picker.dart';
import 'package:zoozie/view/shared/phone_number_form_field/phone_number_form_field.dart';
import 'package:zoozie/view/shared/zoozie_form_field/zoozie_form_field.dart';

class Login extends StatelessWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 56),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome back, login to your account',
                  style: context.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Enter your phone number to continue',
                  style: context.textTheme.bodyLarge?.copyWith(
                    color: Colors.grey.shade500,
                    fontWeight: FontWeight.w300,
                  ),
                ),
                const PhoneNumberFormField(),
                const SizedBox(height: 36),
                ElevatedButton(
                  onPressed: () {},
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Continue"),
                      SizedBox(width: 8),
                      Icon(FontAwesomeIcons.arrowRight, size: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
