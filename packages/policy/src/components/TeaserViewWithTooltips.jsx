import TeaserBody from '@plone/volto/components/manage/Blocks/Teaser/Body';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import { TextWithGlossaryTooltips } from '@rohberg/volto-slate-glossary/utils';

const TeaserView = (props) => {
  return (
    <TeaserBody
      {...{
        ...props,
        data: {
          ...props.data,
          description: TextWithGlossaryTooltips({
            text: props.data.description,
          }),
          title: TextWithGlossaryTooltips({ text: props.data.title }),
        },
      }}
    />
  );
};

export default withBlockExtensions(TeaserView);
