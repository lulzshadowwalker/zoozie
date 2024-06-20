import 'package:freezed_annotation/freezed_annotation.dart';

part 'price.freezed.dart';
part 'price.g.dart';

@freezed
class Price with _$Price {
  factory Price({
    required double? amount,
    required String? currency,
  }) = _Price;

  factory Price.fromJson(Map<String, Object?> json) => _$PriceFromJson(json);
}
