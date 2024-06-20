import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zoozie/domain/phone_number.dart';

part 'location.freezed.dart';
part 'location.g.dart';

@freezed
class Location with _$Location {
  factory Location({
    required Country country,
    required City city,
    required Area area,
  }) = _Location;

  factory Location.fromJson(Map<String, Object?> json) =>
      _$LocationFromJson(json);
}

@freezed
class Country with _$Country {
  const factory Country({
    required String name,
  }) = _Country;

  factory Country.fromJson(Map<String, Object?> json) =>
      _$CountryFromJson(json);
}

@freezed
class City with _$City {
  const factory City({
    required String name,
  }) = _City;

  factory City.fromJson(Map<String, Object?> json) => _$CityFromJson(json);
}

@freezed
class Area with _$Area {
  const factory Area({
    required String name,
  }) = _Area;

  factory Area.fromJson(Map<String, Object?> json) => _$AreaFromJson(json);
}
