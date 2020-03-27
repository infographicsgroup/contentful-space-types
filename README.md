# contentful-space-types

Generate typings from your Contentful space/environment.

- Content Types become interfaces.
- Locales (and your default locale) become string types.
- Assets and Rich Text link to Contentful's types.

Thanks to and based on the awesome work of the people at [Intercom][Intercom]
> we use this in our [marketing site][Intercom] to increase developer confidence and productivity,
> ensure that breaking changes to our Content Types don't cause an outage, and because it's neat.

We based our modified version on [their work](https://github.com/intercom/contentful-typescript-codegen)
with a bit of modification to suite our use case better and to allow robust configuration in different projects
(with minimal configuration possible, and to work flexibly with both Deliver/Management Contentful APIs).

## Usage

```sh
yarn add --dev contentful-space-types
```

Then, add the following to your `package.json`:

```jsonc
{
  // ...
  "scripts": {
    ...
    "generate:types": "contentful-space-types --output src/types/contentful.d.ts",
    ...
  }
}
```

Feel free to change the output path to whatever you like.

Codegen is shipped with a client that needs the following environment variables to query the contentful preview API
and generate the types
 - `CONTENTFUL_SPACE_ID`
 - `CONTENTFUL_ACCESS_TOKEN` content delivery API access token
 - `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` personal management access token
 - `CONTENTFUL_ENVIRONMENT` defaults to `"master"` if not provided

 If the `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` is provided, the [management client][1] would be used which has
 more capabilities than the [delivery client][2].

 The [management client][1] can query validations and add them to the type-checking. But if it's not provided,
 we will fall back to the [Contentful Delivery/Preview Client][2] that provide less stricter type-checking types.

### Command line options

```
Usage
  $ contentful-typescript-codegen --output <file> <options>

Options
  --output,      -o  Where to write to
  --poll,        -p  Continuously refresh types
  --interval N,  -i  The interval in seconds at which to poll (defaults to 15)
```

## Example output

Here's an idea of what the output will look like for a Content Type:

```ts
interface IBlogPostFields {
  /** Title */
  title: string

  /** Body */
  body: Document

  /** Author link */
  author: IAuthor

  /** Image */
  image: Asset

  /** Published? */
  published: boolean | null

  /** Tags */
  tags: string[]

  /** Blog CTA variant */
  ctaVariant: "new-cta" | "old-cta"
}

/**
 * A blog post.
 */
export interface IBlogPost extends Entry<IBlogPostFields> {}
```

You can see that a few things are handled for you:

- Documentation comments are automatically generated from Contentful descriptions.
- Links, like `author`, are resolved to other TypeScript interfaces.
- Assets are handled properly.
- Validations on symbols and text fields are expanded to unions.
- Non-required attributes automatically have `| null` appended to their type.
- The output is formatted using **your** Prettier config.

[1]: ./src/clients/contentfulManagementClient.ts
[2]: ./src/clients/contentfulClient.ts
[Intercom]: https://www.intercom.com
