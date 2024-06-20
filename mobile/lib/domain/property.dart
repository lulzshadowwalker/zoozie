// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:freezed_annotation/freezed_annotation.dart';

part 'property.freezed.dart';
part 'property.g.dart';

@freezed
class Property with _$Property {
  factory Property({
    required DescribedValue<int>? bedrooms,
    required DescribedValue<int>? bathrooms,
    required DescribedValue<int>? area,
    required DescribedValue<bool>? furnished,
    required DescribedValue<int>? yearBuilt,
  }) = _Property;

  factory Property.fromJson(Map<String, Object?> json) =>
      _$PropertyFromJson(json);
}

class DescribedValue<T> {
  final T? value;
  final String? description;
  DescribedValue({
    this.value,
    this.description,
  });

  DescribedValue<T> copyWith({
    T? value,
    String? description,
  }) {
    return DescribedValue<T>(
      value: value ?? this.value,
      description: description ?? this.description,
    );
  }

  factory DescribedValue.fromMap(Map<String, dynamic> map) {
    final value = map['value'];
    return DescribedValue<T>(
      value: value as T,
      description:
          map['description'] != null ? map['description'] as String : null,
    );
  }

  factory DescribedValue.fromJson(String source) =>
      DescribedValue.fromMap(json.decode(source) as Map<String, dynamic>);

  Map<String, dynamic> toMap() {
    return {
      'value': value,
      'description': description,
    };
  }

  String toJson() => json.encode(toMap());

  @override
  String toString() =>
      'DescribedValue(value: $value, description: $description)';

  @override
  bool operator ==(covariant DescribedValue<T> other) {
    if (identical(this, other)) return true;

    return other.value == value && other.description == description;
  }

  @override
  int get hashCode => value.hashCode ^ description.hashCode;
}
