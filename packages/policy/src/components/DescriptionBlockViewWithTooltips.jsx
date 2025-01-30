import { TextWithGlossaryTooltips } from '@rohberg/volto-slate-glossary/utils';

const DescriptionBlockView = ({ properties, metadata, id }) => {
  let description = (metadata || properties)['description'] || '';
  description = TextWithGlossaryTooltips({ text: description });

  return <p className="documentDescription">{description}</p>;
};

export default DescriptionBlockView;
