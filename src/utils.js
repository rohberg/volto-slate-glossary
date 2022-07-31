import React from 'react';
import { useSelector } from 'react-redux';
import { flatten } from 'lodash';
import { Popup } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';

/**
 * import from @plone/volto-slate Leaf when ready there
 * @param {String} children text to be decorated
 */
const applyLineBreakSupport = (children) => {
  const klass = undefined;

  return typeof children === 'string'
    ? children.split('\n').map((t, i) => {
        return (
          <React.Fragment key={`${i}`}>
            {children.indexOf('\n') > -1 &&
            children.split('\n').length - 1 > i ? (
              <>
                {klass ? <span className={klass}>{t}</span> : t}
                <br />
              </>
            ) : klass ? (
              <span className={klass}>{t}</span>
            ) : (
              t
            )}
          </React.Fragment>
        );
      })
    : children;
};

export const TextWithGlossaryTooltips = ({ text }) => {
  const glossaryterms = useSelector(
    (state) => state.glossarytooltipterms?.result?.items,
  );
  const location = useLocation();

  // no tooltips if user opted out
  const currentuser = useSelector((state) => state.users?.user);
  const glossarytooltips = currentuser?.glossarytooltips ?? true;
  if (!glossarytooltips) {
    return text;
  }
  const isEditMode = location.pathname.slice(-5) === '/edit';
  const isAddMode = location.pathname.slice(-4) === '/add';
  if (isEditMode || isAddMode || location.pathname === '/' || !__CLIENT__) {
    return text;
  }

  let result = [{ type: 'text', val: text }];
  if (glossaryterms !== undefined) {
    glossaryterms.forEach((term) => {
      result = result.map((chunk) => {
        if (chunk.type === 'text') {
          var splittedtext;
          // regex word boundary does ignore umlauts and other non ascii
          if (['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü'].includes(term.term[0])) {
            // let myre = `(?<!\w)${term.term}(?!\w)`;
            let myre = `(?<=[ ,\.])${term.term}(?=[ ,\.])`;
            let regExpTerm = new RegExp(myre, 'g');
            splittedtext = chunk.val.split(regExpTerm).reverse();
          } else {
            let myre = `\\b${term.term}\\b`;
            let regExpTerm = new RegExp(myre);
            splittedtext = chunk.val.split(regExpTerm).reverse();
          }
          chunk = [{ type: 'text', val: splittedtext.pop() }];
          while (splittedtext.length > 0) {
            chunk.push({
              type: 'glossarytermtooltip',
              val: term.term,
            });
            chunk.push({ type: 'text', val: splittedtext.pop() });
          }
        }
        return chunk;
      });
      result = flatten(result);
    });
  }
  result = flatten(result);

  return result.map((el, j) => {
    if (el.type === 'text') {
      return applyLineBreakSupport(el.val);
    } else {
      let idx = glossaryterms.findIndex((variant) => variant.term === el.val);
      let definition = glossaryterms[idx]?.definition || '';
      switch (definition.length) {
        case 0:
          definition = '';
          break;
        case 1:
          definition = definition[0];
          break;
        default:
          let foo = definition.map((el) => `<li>${el}</li>`).join('');
          definition = `<ol>${foo}</ol>`;
      }
      return (
        <Popup
          wide
          position="bottom left"
          trigger={<span className="glossarytooltip">{el.val}</span>}
          key={j}
          className="tooltip"
        >
          <Popup.Content>
            <div
              className="tooltip_content"
              dangerouslySetInnerHTML={{
                __html: definition,
              }}
            />
          </Popup.Content>
        </Popup>
      );
    }
  });
};
