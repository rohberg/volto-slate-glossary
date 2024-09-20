import GlossaryView from './components/GlossaryView';
import TermView from './components/TermView';
import { glossarytermsReducer, glossarytooltiptermsReducer } from './reducers';
import { TextWithGlossaryTooltips } from './utils';

export default (config) => {
  config.settings.glossary = {
    caseSensitive: false,
    matchOnlyFirstOccurence: false,
  };
  config.settings.slate.leafs = {
    text: ({ children }) => <TextWithGlossaryTooltips text={children} />,
  };
  config.views = {
    ...config.views,
    contentTypesViews: {
      ...config.views.contentTypesViews,
      Glossary: GlossaryView,
      Term: TermView,
    },
  };

  config.addonReducers = {
    ...config.addonReducers,
    glossaryterms: glossarytermsReducer,
    glossarytooltipterms: glossarytooltiptermsReducer,
  };

  return config;
};
