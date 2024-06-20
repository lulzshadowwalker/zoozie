import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zoozie/domain/phone_number.dart';

part 'agency.freezed.dart';
part 'agency.g.dart';

@freezed
class Agency with _$Agency {
  factory Agency({
    required int? id,
    required PhoneNumber? phoneNumber,
    required String? emailAddress,
    required String? name,
    required String? slug,
    required String? logo,
    required String? description,
    required bool? following,
    required int? rating,
    required int? reviewsCount,
  }) = _Agency;

  factory Agency.fromJson(Map<String, Object?> json) => _$AgencyFromJson(json);
}
