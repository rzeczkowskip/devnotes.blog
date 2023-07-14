import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { LoadedContent } from '@/services/content/types';

export default class ContentLoader {
  readonly #contentDir: string;

  constructor(contentDir: string) {
    this.#contentDir = contentDir;
  }

  public loadContent(): LoadedContent[] {
    const filesToLoad = this.getFilesToLoad();
    return filesToLoad.map((filePath) => this.loadRawContent(filePath));
  }

  private getFilesToLoad(): string[] {
    return globSync('./**/*.md', {
      cwd: this.#contentDir,
      dot: false,
      nodir: true,
      absolute: false,
    });
  }

  private loadRawContent(relativeFilePath: string): LoadedContent {
    const absolutePath = path.join(this.#contentDir, relativeFilePath);
    const content = fs
      .readFileSync(absolutePath, { encoding: 'utf-8' })
      .toString();

    return {
      path: relativeFilePath,
      content,
    };
  }
}
