import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:zoozie/repository/listings_repository.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/view/listings/listing_card/components/feature-tile/feature-tile.dart';
import 'package:zoozie/view/listings/listing_card/listing_card.dart';
import 'package:zoozie/view/shared/zoozie_form_field/zoozie_form_field.dart';

class Listings extends ConsumerWidget {
  const Listings({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final listings = ref.watch(listingsProvider);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome heading
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Welcome Back, Lulzie.',
                    style: context.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    height: 36,
                    width: 36,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: context.cs.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(50),
                    ),
                    child: const FaIcon(
                      FontAwesomeIcons.solidBell,
                      size: 18,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Seach and Filtering
              Row(
                children: [
                  const Expanded(
                      child: ZoozieFormField(
                    prefixIcon: Icon(FontAwesomeIcons.magnifyingGlass),
                    hintText: 'Search for listings',
                  )),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: context.cs.primary.withOpacity(0.85),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.all(13),
                    child: const Icon(
                      FontAwesomeIcons.sliders,
                      size: 26,
                    ),
                  )
                ],
              ),

              const SizedBox(height: 24),

              // Property Filter cards
              SizedBox(
                height: 64,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: 100,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (BuildContext context, int index) => AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      decoration: BoxDecoration(
                        color: context.cs.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        FontAwesomeIcons.house,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 36),

              // Featured Listings
              Text(
                'Featured Listings',
                style: context.textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 250,
                child: ListView.separated(
                  itemCount: 100,
                  scrollDirection: Axis.horizontal,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (BuildContext context, int index) =>
                      const AspectRatio(
                    aspectRatio: 1,
                    child: Placeholder(),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Explore More
              Text(
                'Explore More',
                style: context.textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Expanded(
                child: ListView.separated(
                  itemCount: 100,
                  separatorBuilder: (_, __) => const SizedBox(height: 16),
                  itemBuilder: (BuildContext context, int index) => ListTile(
                    leading: const AspectRatio(
                      aspectRatio: 1,
                      child: Placeholder(),
                    ),
                    title: Text('Listing $index'),
                    subtitle: Text('Description of listing $index'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
