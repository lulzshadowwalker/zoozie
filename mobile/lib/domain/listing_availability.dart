import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zoozie/domain/price.dart';

part 'listing_availability.freezed.dart';
part 'listing_availability.g.dart';

@freezed
class ListingAvailability with _$ListingAvailability {
  factory ListingAvailability({
    required String? availability,
    required Price? price,
  }) = _ListingAvailability;

  factory ListingAvailability.fromJson(Map<String, Object?> json) =>
      _$ListingAvailabilityFromJson(json);
}
