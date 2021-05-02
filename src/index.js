import { GLOSSARYTOOLTIPS } from './constants';
import installGlossarytooltipsEditor from './tooltips';

const applyConfig = (config) => {
  // config.settings.slate.inlineElements = [
  //   ...config.settings.slate.inlineElements,
  //   'abbr',
  // ];
  // config.settings.slate.elements = {
  //   ...config.settings.slate.elements,
  //   abbr: ({ attributes, children }) => <abbr {...attributes}>{children}</abbr>,
  // };

  config.settings.glossarytooltips = [
    ...(config.settings.glossarytooltips || []),
    GLOSSARYTOOLTIPS,
  ];

  config = installGlossarytooltipsEditor(config);

  return config;
};

export default applyConfig;
