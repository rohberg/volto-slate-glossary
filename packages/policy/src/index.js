import { Tooltips } from '@rohberg/volto-slate-glossary/components';

const applyConfig = (config) => {
  // glossary tooltips
  config.settings.glossary.caseSensitive = false;
  config.settings.glossary.matchOnlyFirstOccurence = true;

  // Tootips everywhere
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: Tooltips,
    },
  ];

  // DEBUG Toltips only in /documentation and /hints
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/documentation',
      component: Tooltips,
    },
    // {
    //   match: '/hints',
    //   component: Tooltips,
    // },
  ];

  return config;
};

export default applyConfig;
