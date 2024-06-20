import 'package:freezed_annotation/freezed_annotation.dart';

part 'phone_number.g.dart';
part 'phone_number.freezed.dart';

@freezed
class PhoneNumber with _$PhoneNumber {
  factory PhoneNumber({
    required String? countryCode,
    @JsonKey(name: 'phoneNumber') required String? number,
  }) = _PhoneNumber;

  factory PhoneNumber.fromJson(Map<String, Object?> json) =>
      _$PhoneNumberFromJson(json);
}
