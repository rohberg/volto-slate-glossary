import React from 'react';
import { Popup } from 'semantic-ui-react';

const makeTooltip = (glossarytermtitle) => {
  const free = glossarytermtitle ? glossarytermtitle + ' TODO makeTooltip' : '';

  return free;
};

export const TooltipElement = ({
  attributes,
  children,
  element,
  mode,
  ...rest
}) => {
  const { data = {} } = element;
  // const { uid = 'undefined' } = data;

  return (
    <>
      {mode === 'view' ? (
        <Popup
          position="bottom left"
          trigger={
            <span {...attributes} className="glossary-term">
              {children}
            </span>
          }
        >
          <Popup.Content>
            <div
              dangerouslySetInnerHTML={{
                __html: makeTooltip(data.glossarytermtitle),
              }}
            />{' '}
          </Popup.Content>
        </Popup>
      ) : (
        <span>TODO hier der unveränderte Begriff</span>
      )}
    </>
  );
};
