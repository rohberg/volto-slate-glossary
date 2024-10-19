import { Tooltips } from '@rohberg/volto-slate-glossary/components';

const applyConfig = (config) => {
  // glossary tooltips
  config.settings.glossary.caseSensitive = true;
  config.settings.glossary.matchOnlyFirstOccurence = true;
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: Tooltips,
    },
  ];

  return config;
};

export default applyConfig;
