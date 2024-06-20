import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:pinput/pinput.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/theme/zoozie_colors.dart';

class OtpVerification extends HookWidget {
  const OtpVerification({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CachedNetworkImage(
                  imageUrl:
                      'https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1717718400&semt=sph'),
              Text(
                'OTP Verification',
                style: context.textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                'Enter the 4-digit code sent to +91 xxxx43210',
                style: context.textTheme.bodyMedium?.copyWith(
                  color: Colors.blueGrey.shade300,
                ),
              ),
              const SizedBox(height: 32),
              const Center(child: PinInput()),
              const SizedBox(height: 16),
              const SizedBox(height: 24),
              ElevatedButton(onPressed: () {}, child: const Text('Verify')),
              Text('Resend OTP', style: context.textTheme.bodyMedium),
            ],
          ),
        ),
      ),
    );
  }
}

class PinInput extends HookWidget {
  const PinInput({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = useTextEditingController();
    final focusNode = useFocusNode();

    const length = 4;
    const borderColor = Color.fromRGBO(196, 203, 209, 0.569);
    const errorColor = Color.fromRGBO(255, 234, 238, 1);
    const fillColor = Color.fromRGBO(222, 231, 240, .57);
    final defaultPinTheme = PinTheme(
      width: 56,
      height: 60,
      decoration: BoxDecoration(
        color: fillColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.transparent),
      ),
    );

    return SizedBox(
      height: 68,
      child: Pinput(
        length: length,
        controller: controller,
        focusNode: focusNode,
        defaultPinTheme: defaultPinTheme,
        onCompleted: (pin) {},
        focusedPinTheme: defaultPinTheme.copyWith(
          height: 68,
          width: 64,
          decoration: defaultPinTheme.decoration!.copyWith(
            border: Border.all(color: borderColor),
          ),
        ),
        errorPinTheme: defaultPinTheme.copyWith(
          decoration: BoxDecoration(
            color: errorColor,
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
    );
  }
}
