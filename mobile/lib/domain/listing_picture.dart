import 'package:freezed_annotation/freezed_annotation.dart';

part 'listing_picture.freezed.dart';
part 'listing_picture.g.dart';

@freezed
class ListingPicture with _$ListingPicture {
  factory ListingPicture({
    required int? id,
    required String? title,
    required String? url,
    required bool? highlighted,
  }) = _ListingPicture;

  factory ListingPicture.fromJson(Map<String, Object?> json) =>
      _$ListingPictureFromJson(json);
}
