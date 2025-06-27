import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedSharedImage extends Schema.Component {
  collectionName: 'components_shared_shared_images';
  info: {
    displayName: 'Shared Image';
    icon: 'landscape';
  };
  attributes: {
    media: Attribute.Media<'images'> & Attribute.Required;
    alt: Attribute.String & Attribute.Required;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'chartBubble';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 55;
      }>;
    metaDescription: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 70;
        maxLength: 150;
      }>;
    keywords: Attribute.Text & Attribute.Required;
    preventIndexing: Attribute.Boolean & Attribute.DefaultTo<false>;
    sharedImage: Attribute.Component<'shared.shared-image'>;
  };
}

export interface PostRelatedPosts extends Schema.Component {
  collectionName: 'components_post_related_posts';
  info: {
    displayName: 'Related Posts';
    icon: 'rotate';
    description: '';
  };
  attributes: {
    posts: Attribute.Relation<
      'post.related-posts',
      'oneToMany',
      'api::post.post'
    >;
    title: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.shared-image': SharedSharedImage;
      'shared.seo': SharedSeo;
      'post.related-posts': PostRelatedPosts;
    }
  }
}
