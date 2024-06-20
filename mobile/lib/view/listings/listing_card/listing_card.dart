import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:zoozie/util/zoozie_extensions.dart';
import 'package:zoozie/view/listings/listing_card/components/feature-tile/feature-tile.dart';

class ListingCard extends StatelessWidget {
  const ListingCard({super.key});

  static const _borderRadius = 8.0;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 350,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(_borderRadius),
      ),
      child: Stack(
        clipBehavior: Clip.antiAliasWithSaveLayer,
        children: [
          Positioned.fill(
            child: Container(
              clipBehavior: Clip.antiAliasWithSaveLayer,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(_borderRadius),
              ),
              child: Image.network(
                'https://images.unsplash.com/photo-1716749188938-e66263f36728?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4MHx8fGVufDB8fHx8fA%3D%3D',
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  clipBehavior: Clip.antiAliasWithSaveLayer,
                  decoration: BoxDecoration(
                    color: context.cs.surface.withOpacity(0.8),
                    borderRadius: const BorderRadius.vertical(
                      bottom: Radius.circular(_borderRadius),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Row(
                            children: [
                              FaIcon(
                                FontAwesomeIcons.locationDot,
                                color: context.cs.onPrimaryContainer
                                    .withOpacity(0.9),
                              ),
                              const SizedBox(width: 6),
                              const Text(
                                'Amman, Abdoun',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          RichText(
                            text: TextSpan(
                              style: context.textTheme.bodyLarge,
                              children: [
                                const TextSpan(
                                  text: '80000',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                TextSpan(
                                  text: ' JOD',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Row(
                        children: [
                          FeatureTile(
                            icon: FontAwesomeIcons.bed,
                            title: '4',
                          ),
                          SizedBox(width: 12),
                          FeatureTile(
                            icon: FontAwesomeIcons.bed,
                            title: '4',
                          ),
                          SizedBox(width: 12),
                          FeatureTile(
                            icon: FontAwesomeIcons.bed,
                            title: '4',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
