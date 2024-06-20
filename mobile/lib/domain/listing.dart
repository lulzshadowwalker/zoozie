import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zoozie/domain/agency.dart';
import 'package:zoozie/domain/listing_availability.dart';
import 'package:zoozie/domain/listing_extra_feature.dart';
import 'package:zoozie/domain/listing_picture.dart';
import 'package:zoozie/domain/location.dart';
import 'package:zoozie/domain/phone_number.dart';

part 'listing.freezed.dart';
part 'listing.g.dart';

@freezed
class Listing with _$Listing {
  factory Listing({
    required int? id,
    required String? slug,
    required Agency? agency,

    // TODO: might wahna use an enum
    required String? type,
    required String? description,
    required List<ListingExtraFeature>? extraFeatures,
    required List<ListingPicture>? pictures,
    required List<ListingAvailability>? availabilities,
    required Object property,
    required Location? location,
    required bool? favorite,
  }) = _Listing;

  factory Listing.fromJson(Map<String, Object?> json) =>
      _$ListingFromJson(json);
}
