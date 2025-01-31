import { Tooltips } from '@rohberg/volto-slate-glossary/components';
// import DescriptionBlockViewWithTooltips from './components/DescriptionBlockViewWithTooltips';
// import TeaserViewWithTooltips from './components/TeaserViewWithTooltips';

const applyConfig = (config) => {
  /**
   * Tooltip configuration
   */
  config.settings.glossary.caseSensitive = false;
  config.settings.glossary.matchOnlyFirstOccurence = false;
  config.settings.glossary.mentionTermInTooltip = false;
  // Further configuration
  // config.settings.glossary.includeAccordionBlock = true;

  // // description block with tooltips
  // config.blocks.blocksConfig.description.view =
  //   DescriptionBlockViewWithTooltips;

  // // teaser block with tooltips (teaser and teaser in grid block)
  // config.blocks.blocksConfig.teaser.view = TeaserViewWithTooltips;
  // config.blocks.blocksConfig.gridBlock.blocksConfig.teaser.view =
  //   TeaserViewWithTooltips;

  // Tooltips everywhere
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: Tooltips,
    },
  ];

  /**
   * Glossary configuration
   */
  config.settings.glossary.showAlphabetNavigation = true;

  return config;
};

export default applyConfig;
