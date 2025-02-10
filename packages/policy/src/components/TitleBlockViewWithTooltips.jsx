import { TextWithGlossaryTooltips } from '@rohberg/volto-slate-glossary/utils';

const BlockView = ({ properties, metadata, id }) => {
  let title = (metadata || properties)['title'] || '';
  title = TextWithGlossaryTooltips({ text: title });
  return <h1 className="documentFirstHeading">{title}</h1>;
};

export default BlockView;
