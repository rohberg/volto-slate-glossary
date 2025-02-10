import GlossaryView from './components/GlossaryView';
import TermView from './components/TermView';
import { glossarytermsReducer, glossarytooltiptermsReducer } from './reducers';
import { TextWithGlossaryTooltips } from './utils';
import { FetchTooltipTerms } from './components/Tooltips';
import TooltipPopup from './components/TooltipPopup';

const applyConfig = (config) => {
  config.settings.glossary = {
    caseSensitive: false,
    matchOnlyFirstOccurence: false,
    showAlphabetNavigation: true,
    mentionTermInTooltip: false,
    includeAccordionBlock: false,
  };

  config.settings.slate.leafs = {
    text: ({ children }) => <TextWithGlossaryTooltips text={children} />,
  };

  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: FetchTooltipTerms,
    },
  ];

  config.views = {
    ...config.views,
    contentTypesViews: {
      ...config.views.contentTypesViews,
      Glossary: GlossaryView,
      Term: TermView,
    },
  };

  config.registerComponent({
    name: 'TooltipPopup',
    component: TooltipPopup,
  });

  config.addonReducers = {
    ...config.addonReducers,
    glossaryterms: glossarytermsReducer,
    glossarytooltipterms: glossarytooltiptermsReducer,
  };

  return config;
};

export default applyConfig;
