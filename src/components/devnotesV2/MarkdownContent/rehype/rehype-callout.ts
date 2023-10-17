import { Pluggable } from 'unified';
import { visitParents } from 'unist-util-visit-parents';

const rehypeCallout: Pluggable = () => (tree) => {
  visitParents(tree, 'element', (node) => {
    if (node.tagName !== 'blockquote' || !Array.isArray(node?.children)) {
      return;
    }

    const children = (node.children || []).filter(
      // @ts-ignore
      (child) => !(child.type === 'text' && child.value === '\n'),
    );
    const firstLine = children?.[0]?.value
      ? children?.[0]
      : children?.[0]?.children?.[0];

    if (
      !firstLine ||
      firstLine.type !== 'text' ||
      typeof firstLine.value !== 'string'
    ) {
      return;
    }

    const value = (firstLine.value as string).trim();
    const matches = value.match(/^\[!(\w+)] *(.*)\n/);

    if (!matches || matches.length < 3) {
      return;
    }

    const [toRemove, type, title] = matches;

    // eslint-disable-next-line no-param-reassign
    node.tagName = 'callout';
    // eslint-disable-next-line no-param-reassign
    node.properties = { title, type };
    firstLine.value = firstLine.value.replace(toRemove, '');
  });
};

export default rehypeCallout;
