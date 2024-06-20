import 'package:freezed_annotation/freezed_annotation.dart';

part 'listing_extra_feature.freezed.dart';
part 'listing_extra_feature.g.dart';

@freezed
class ListingExtraFeature with _$ListingExtraFeature {
  factory ListingExtraFeature({
    required int? id,
    required String? title,
    required bool? available,
  }) = _ListingExtraFeature;

  factory ListingExtraFeature.fromJson(Map<String, Object?> json) =>
      _$ListingExtraFeatureFromJson(json);
}
