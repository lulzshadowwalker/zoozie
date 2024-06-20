import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/domain/agency.dart';
import 'package:zoozie/domain/listing.dart';
import 'package:zoozie/provider/dio_provider.dart';
import 'package:zoozie/provider/storage_provider.dart';
import 'package:zoozie/util/zoozie_helpers.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'listings_repository.g.dart';

class ListingsRepository {
  ListingsRepository(this._ref);
  final Ref _ref;

  final _log = ZoozieHelpers.getLogger('ListingsRepository');

  Future<List<Listing>?> getListings() async {
    try {
      final dio = _ref.read(lulzieApiClient);
      final response = await dio.get('/listings');
      if (response.statusCode != 200) {
        throw Exception(response.statusMessage);
      }

      final listings = (response.data?['data']?['listings'] as List?)
          ?.map((e) => Listing.fromJson(e as Map<String, Object?>))
          .toList();

      if (listings == null) {
        throw Exception('invalid listings response');
      }

      return listings;
    } catch (e) {
      _log.e('failed to get listings because $e');
      return null;
    }
  }

  Future<Listing?> getListingBySlug(String slug) async {
    try {
      final dio = _ref.read(lulzieApiClient);
      final response = await dio.get('/listings', queryParameters: {
        'slug': slug,
        'populate': 'agency',
      });
      if (response.statusCode != 200) {
        throw Exception(response.statusMessage);
      }

      final listing = Listing.fromJson(
          response.data?['data']?['listing'] as Map<String, Object?>);

      return listing;
    } catch (e) {
      _log.e('failed to get listing with slug "$slug" because $e');
      return null;
    }
  }
}

@riverpod
ListingsRepository listingsRepository(ListingsRepositoryRef ref) {
  return ListingsRepository(ref);
}

@Riverpod(keepAlive: true)
Future<List<Listing>?> listings(ListingsRef ref) {
  return ref.read(listingsRepositoryProvider).getListings();
}

@riverpod
Future<Listing?> listing(ListingRef ref, String slug) {
  return ref.read(listingsRepositoryProvider).getListingBySlug(slug);
}
