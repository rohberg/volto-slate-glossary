import ReactDOM from 'react-dom';
import { defineMessages } from 'react-intl'; // , defineMessages
import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { _insertElement } from 'volto-slate/components/ElementEditor/utils';

import { withGlossarytooltips } from './extensions';
import { GLOSSARYTOOLTIPS } from '../constants';
import { TooltipElement } from './render';

import './glossarytooltips.less';

const messages = defineMessages({
  schnupsi: {
    id: 'Edit glossarytooltip',
    defaultMessage: 'Edit footnote',
  },
});

export default function install(config) {
  const opts = {
    title: 'Glossary Tooltips',
    pluginId: GLOSSARYTOOLTIPS,
    elementType: GLOSSARYTOOLTIPS,
    element: TooltipElement,
    isInlineElement: true,
    // editSchema: FootnoteEditorSchema,
    extensions: [withGlossarytooltips],
    hasValue: (formData) => !!formData.glossarytooltipdescr,
    insertElement: (editor, data) => {
      // the default behavior is _insertElement,
      // it returns whether an element was possibly inserted
      if (!_insertElement(GLOSSARYTOOLTIPS)(editor, data)) {
        return;
      }
    },
    messages,
  };
  const [installFootnoteEditor] = makeInlineElementPlugin(opts);
  config = installFootnoteEditor(config);

  return config;
}
