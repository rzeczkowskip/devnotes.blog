export default class Translator {
  readonly #messages: Record<string, string>;

  constructor(messages: Record<string, string>) {
    this.#messages = messages;
  }

  public trans(key: string, replacements?: Record<string, string>, fallback?: string): string {
    const message = this.#messages?.[key] || fallback;

    if (!message) {
      return '';
    }

    if (replacements) {
      return Object.entries(replacements)
        .reduce((text, [search, replace]) => text.replace(search, replace), message);
    }

    return message;
  }
}
