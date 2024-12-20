import { Popup } from 'semantic-ui-react';
import config from '@plone/volto/registry';

const TooltipPopup = ({ term, definition, idx = 0 }) => {
  const mentionTermInTooltip = config.settings.glossary.mentionTermInTooltip;
  return (
    <Popup
      wide
      position="bottom left"
      trigger={<span className="glossarytooltip">{term}</span>}
      className="tooltip"
      key={idx}
    >
      {mentionTermInTooltip ? <Popup.Header>{term}</Popup.Header> : null}
      <Popup.Content>
        <div
          className="tooltip_content"
          dangerouslySetInnerHTML={{ __html: definition }}
        />
      </Popup.Content>
    </Popup>
  );
};

export default TooltipPopup;
