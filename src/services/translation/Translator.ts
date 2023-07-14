export default class Translator {
  readonly #locale: string;

  readonly #messages: Record<string, string>;

  constructor(locale: string, messages: Record<string, string>) {
    this.#locale = locale;
    this.#messages = messages;
  }

  get locale(): string {
    return this.#locale;
  }

  public trans(
    key: string,
    replacements?: Record<string, string>,
    fallback?: string,
  ): string {
    const message = this.#messages?.[key] || fallback;

    if (!message) {
      return '';
    }

    if (replacements) {
      return Object.entries(replacements).reduce(
        (text, [search, replace]) => text.replace(search, replace),
        message,
      );
    }

    return message;
  }
}
