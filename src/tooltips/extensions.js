import { GLOSSARYTOOLTIPS } from '../constants';
import { nanoid } from 'volto-slate/utils';
import { Transforms } from 'slate';

export const withGlossarytooltips = (editor) => {
  const { normalizeNode, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === GLOSSARYTOOLTIPS ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (node.type === GLOSSARYTOOLTIPS && !node.data?.uid) {
      Transforms.setNodes(
        editor,
        {
          data: {
            uid: nanoid(5),
            footnote: node.data?.footnote,
          },
        },
        {
          at: path,
        },
      );
    }
    return normalizeNode(entry);
  };

  return editor;
};
