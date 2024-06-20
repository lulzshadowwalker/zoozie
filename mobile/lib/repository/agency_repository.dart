import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/domain/agency.dart';
import 'package:zoozie/provider/dio_provider.dart';
import 'package:zoozie/provider/storage_provider.dart';
import 'package:zoozie/util/zoozie_helpers.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'agency_repository.g.dart';

class AgencyRepository {
  AgencyRepository(this._ref);
  final Ref _ref;

  final _log = ZoozieHelpers.getLogger('AgencyRepository');

  Future<List<Agency>?> getAgencies() async {
    try {
      final dio = _ref.watch(lulzieApiClient);

      final response = await dio.get('/agencies');
      if (response.statusCode != 200) {
        throw Exception(response.statusMessage);
      }

      final agencies = (response.data?['data']?['agencies'] as List?)
          ?.map((e) => Agency.fromJson(e as Map<String, dynamic>))
          .toList();

      if (agencies == null) {
        throw Exception('invalid agencies response');
      }

      return agencies;
    } catch (e) {
      _log.e(e);
      return null;
    }
  }

  Future<Agency?> getAgencyBySlug(String slug) async {
    try {
      final locale = _ref.read(localeProvider).requireValue.languageCode;
      final dio = _ref.watch(lulzieApiClient);

      final response = await dio.get('/$locale/agencies', queryParameters: {
        'slug': slug,
      });
      if (response.statusCode != 200) {
        throw Exception(response.statusMessage);
      }

      final agency = Agency.fromJson(
          response.data?['data']?['agency'] as Map<String, dynamic>);

      if (agency == null) {
        throw Exception('invalid agency response');
      }

      return agency;
    } catch (e) {
      _log.e(e);
      return null;
    }
  }
}

@riverpod
AgencyRepository agencyRepository(AgencyRepositoryRef ref) {
  return AgencyRepository(ref);
}

@Riverpod(keepAlive: true)
Future<List<Agency>?> agencies(AgenciesRef ref) {
  return ref.read(agencyRepositoryProvider).getAgencies();
}

@riverpod
Future<Agency?> agency(AgencyRef ref, String slug) {
  return ref.read(agencyRepositoryProvider).getAgencyBySlug(slug);
}
