import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { atom, useSetAtom } from 'jotai';
import _ from 'lodash';
import { Text } from 'slate';
import { v5 as uuidv5 } from 'uuid';
import { Popup } from 'semantic-ui-react';
import { getUser } from '@plone/volto/actions';
import { getTooltipTerms } from '../actions';
import { MY_NAMESPACE } from '../utils';
import config from '@plone/volto/registry';

// jotai store for tooltip enhanced slate leafs
export const tooltippedTextsAtom = atom({});

const Tooltips = () => {
  return (
    <>
      <Fetch />
      <CalculateTexts />
    </>
  );
};

const Fetch = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userSession?.token);

  useEffect(() => {
    dispatch(getTooltipTerms());
  }, [dispatch]);

  useEffect(() => {
    let userid = token ? jwtDecode(token).sub : '';
    if (token) {
      dispatch(getUser(userid));
    }
  }, [dispatch, token]);

  return <div className="hidden-AppExtras-Fetch"></div>;
};

const CalculateTexts = () => {
  const glossaryterms = useSelector(
    (state) => state.glossarytooltipterms?.result?.items,
  );
  const blocks_layout = useSelector(
    (state) => state.content.data?.blocks_layout,
  );
  const blocks = useSelector((state) => state.content.data?.blocks);
  const setTooltippedTexts = useSetAtom(tooltippedTextsAtom);

  useEffect(() => {
    if (glossaryterms) {
      let texts = calculateTexts(blocks, blocks_layout, glossaryterms);
      // Update jotai atom
      setTooltippedTexts(texts);
    }
  }, [blocks, blocks_layout, glossaryterms, setTooltippedTexts]);

  return <div className="hidden-AppExtras-CalculateTexts"></div>;
};

/**
 * import from @plone/volto-slate Leaf when ready there
 * @param {String} children text to be decorated
 */
export const applyLineBreakSupport = (children) => {
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

export const enhanceTextWithTooltips = (text, remainingGlossaryterms) => {
  const caseSensitive = config.settings.glossary.caseSensitive;
  const matchOnlyFirstOccurence =
    config.settings.glossary.matchOnlyFirstOccurence;
  let result = [{ type: 'text', val: text }];
  let matchedGlossaryTerms = [];
  if (remainingGlossaryterms.length > 0) {
    remainingGlossaryterms.forEach((term) => {
      result = result.map((chunk) => {
        if (chunk.type === 'text') {
          let new_chunk = [];
          let regExpTerm;
          // We pass the 'u' flag for unicode support
          // And we use '\p{L}' to match any unicode from the 'letter' category.
          // See https://javascript.info/regexp-unicode
          let myre = `(?<!\\p{L})(${term.term})(?!\\p{L})`;
          if (caseSensitive || term.term === term.term.toUpperCase()) {
            // Search case sensitively: if term is 'REST', we don't want to highlight 'rest'.
            // regExpTerm = RegExp(myre, 'gv');
            regExpTerm = RegExp(myre, 'gu');
          } else {
            // Search case insensitively.
            // regExpTerm = RegExp(myre, 'giv');
            regExpTerm = RegExp(myre, 'giu');
          }
          let chunk_val = chunk.val;
          let index = 0;
          while (true) {
            let res = regExpTerm.exec(chunk.val);
            if (
              res === null ||
              (matchOnlyFirstOccurence &&
                matchedGlossaryTerms.includes(term.term))
            ) {
              new_chunk.push({ type: 'text', val: chunk_val.slice(index) });
              break;
            }
            // Term matched. Update context!
            if (matchOnlyFirstOccurence) {
              matchedGlossaryTerms.push(term.term);
            }
            if (res.index > 0) {
              new_chunk.push({
                type: 'text',
                val: chunk_val.slice(index, res.index),
              });
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
      result = _.flatten(result);
    });
  }
  result = _.flatten(result);

  return [
    result.map((el, j) => {
      if (el.type === 'text') {
        return applyLineBreakSupport(el.val);
      } else {
        let idx = remainingGlossaryterms.findIndex(
          (variant) => variant.term.toLowerCase() === el.val.toLowerCase(),
        );
        let definition = remainingGlossaryterms[idx]?.definition || '';
        switch (definition.length) {
          case 0:
            definition = '';
            break;
          case 1:
            definition = definition[0];
            break;
          default:
            let arrayOfListNodes = definition
              .map((el) => `<li>${el}</li>`)
              .join('');
            definition = `<ol>${arrayOfListNodes}</ol>`;
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
    }),
    matchOnlyFirstOccurence
      ? remainingGlossaryterms.filter(
          (term) => !matchedGlossaryTerms.includes(term.term),
        )
      : remainingGlossaryterms,
  ];
};

const ConcatenatedString = (node) => {
  if (Text.isText(node)) {
    // return node.text.trim();
    return node.text;
  } else {
    return node.children.map(ConcatenatedString);
  }
};

const serializeNodes = (nodes) => {
  return nodes.map(ConcatenatedString);
};

const calculateTexts = (blocks, blocks_layout, glossaryterms) => {
  let remainingGlossaryterms = glossaryterms;
  let result = {};

  function iterateOverBlocks(blocks, blocks_layout) {
    blocks_layout?.items &&
      blocks_layout.items.forEach((blockid) => {
        if (blocks[blockid].value) {
          let arrayOfStrings = _.flattenDeep(
            serializeNodes(blocks[blockid].value),
          );
          arrayOfStrings.forEach((str) => {
            if (str.length === 0) {
              return;
            }
            let key = uuidv5(str, MY_NAMESPACE);
            let [value, newTerms] = enhanceTextWithTooltips(
              str,
              remainingGlossaryterms,
            );
            result[key] = value;
            remainingGlossaryterms = newTerms;
          });
        } else {
          if (blocks[blockid].blocks && blocks[blockid].blocks_layout) {
            iterateOverBlocks(
              blocks[blockid].blocks,
              blocks[blockid].blocks_layout,
            );
          }
        }
      });
  }
  iterateOverBlocks(blocks, blocks_layout);
  return result;
};

export default Tooltips;
