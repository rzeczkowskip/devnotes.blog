import slugify from 'slugify';

export default class SlugGenerator {
  public slugify(value: string): string {
    return value
      .split('/')
      .map((part) => slugify(part, {
        lower: true,
        trim: true,
        strict: true,
      }))
      .join('/');
  }
}
