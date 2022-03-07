import { serializeNodes } from './utils';
import GlossaryView from './components/GlossaryView';
import TermView from './components/TermView';
import { glossarytermsReducer, glossarytooltiptermsReducer } from './reducers';

// TODO restrict tooltips to paths and portal_types

export default (config) => {
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

export { serializeNodes };
