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
          let new_chunk = [];
          let regExpTerm;
          // regex word boundary \b ignores umlauts and other non ascii characters.
          // So we pass the 'v' flag for upgraded unicode support:
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
          // And we use '\p{L}' to match any unicode from the 'letter' category.
          // See https://javascript.info/regexp-unicode
          let myre = `(?<!\\p{L})(${term.term})(?!\\p{L})`;
          if (term.term === term.term.toUpperCase()) {
            // Search case sensitively: if term is 'REST', we don't want to highlight 'rest'.
            regExpTerm = RegExp(myre, "gv");
          } else {
            // Search case insensitively.
            regExpTerm = RegExp(myre, "giv");
          }
          let chunk_val = chunk.val;
          let index = 0;
          while (true) {
            let res = regExpTerm.exec(chunk.val);
            if (res === null) {
              new_chunk.push({ type: 'text', val: chunk_val.slice(index) });
              break;
            }
            if (res.index > 0) {
              new_chunk.push({ type: 'text', val: chunk_val.slice(index, res.index) });
            }
            new_chunk.push({
              type: 'glossarytermtooltip',
              val: res[0],
            });
            index = res.index + res[0].length;
          }
          chunk = new_chunk;
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
      let idx = glossaryterms.findIndex((variant) => variant.term.toLowerCase() === el.val.toLowerCase());
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
