import { Tooltips } from '@rohberg/volto-slate-glossary/components';
import DescriptionBlockViewWithTooltips from './components/DescriptionBlockViewWithTooltips';
import TeaserViewWithTooltips from './components/TeaserViewWithTooltips';
import TitleBlockViewWithTooltips from './components/TitleBlockViewWithTooltips';
import AccordionBlockViewWithTooltips from './components/AccordionBlockViewWithTooltips';

const applyConfig = (config) => {
  /**
   * Tooltip configuration
   */
  config.settings.glossary.caseSensitive = false;
  config.settings.glossary.matchOnlyFirstOccurence = false;
  config.settings.glossary.mentionTermInTooltip = true;
  // Further configuration
  config.settings.glossary.includeAccordionBlock = true;
  if (config.blocks.blocksConfig.accordion) {
    config.blocks.blocksConfig.accordion.view = AccordionBlockViewWithTooltips;
  }

  // description block with tooltips
  // Uncomment the following lines and import the custom DescriptionBlockView component to enable tooltips in the description block
  config.blocks.blocksConfig.description.view =
    DescriptionBlockViewWithTooltips;

  // teaser block with tooltips (teaser and teaser in grid block)
  // Uncomment the following lines and import the custom TeaserView component to enable tooltips in the teaser block
  config.blocks.blocksConfig.teaser.view = TeaserViewWithTooltips;
  config.blocks.blocksConfig.gridBlock.blocksConfig.teaser.view =
    TeaserViewWithTooltips;

  // title block with tooltips
  // Uncomment the following lines and import the custom TitleBlockView component to enable tooltips in the title block
  config.blocks.blocksConfig.title.view = TitleBlockViewWithTooltips;

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
