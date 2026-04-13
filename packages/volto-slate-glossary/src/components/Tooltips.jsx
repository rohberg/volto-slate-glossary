import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { useSetAtom } from 'jotai';
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import { Text } from 'slate';
import { v5 as uuidv5 } from 'uuid';
import { getUser } from '@plone/volto/actions/users/users';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getTooltipTerms } from '../actions';
import { MY_NAMESPACE } from '../utils';
import { tooltippedTextsAtom } from '../utils';
import config from '@plone/volto/registry';

/**
 * Add to config.settings.appExtras
 */
export const FetchTooltipTerms = (props) => {
  const { content, token } = props;
  const dispatch = useDispatch();
  const currentNavroot = React.useRef(null);

  const navroot = content?.['@components']?.navroot?.navroot
    ? flattenToAppURL(content['@components'].navroot.navroot['@id'])
    : null;

  useEffect(() => {
    // Unfortunately component unmounts on changing route between LRFs
    // so we need to check if we already fetched terms for this navroot
    if (!currentNavroot.current) {
      currentNavroot.current = navroot;
      dispatch(getTooltipTerms(navroot));
    }
  }, [dispatch, navroot]);

  useEffect(() => {
    let userid = token ? jwtDecode(token).sub : '';
    if (token) {
      dispatch(getUser(userid));
    }
  }, [dispatch, token]);

  return <div className="hidden-AppExtras-Fetch"></div>;
};

/**
 * Add to config.settings.appExtras
 * with restriction to the routes where tooltips are wanted.
 */
const Tooltips = (props) => {
  const pathname = props.pathname;
  const glossaryterms = useSelector(
    (state) => state.glossarytooltipterms?.result?.items,
  );

  // We can't use atom Family as pathname is not known here.
  const setTooltippedTexts = useSetAtom(tooltippedTextsAtom);

  useEffect(() => {
    if (glossaryterms) {
      let texts = calculateTexts(props.content, glossaryterms);
      // Store texts and pathname in atom
      setTooltippedTexts({ pathname: pathname, texts: texts });
    }
  }, [glossaryterms, pathname, props.content, setTooltippedTexts]);

  return <div className="hidden-AppExtras-CalculateTexts"></div>;
};

/**
 * import from @plone/volto-slate Leaf when ready there
 * @param {string} children text to be decorated
 */
export const applyLineBreakSupport = (children) => {
  const klass = undefined;

  return typeof children === 'string'
    ? children.split('\n').map((toot, i) => {
        return (
          <React.Fragment key={`${i}`}>
            {children.indexOf('\n') > -1 &&
            children.split('\n').length - 1 > i ? (
              <>
                {klass ? <span className={klass}>{toot}</span> : toot}
                <br />
              </>
            ) : klass ? (
              <span className={klass}>{toot}</span>
            ) : (
              toot
            )}
          </React.Fragment>
        );
      })
    : children;
};

/**
 * Enhance leaf text with tooltips
 * @param {string} text Leaf text
 * @param {string|Array} remainingGlossaryterms Glossary terms not matched before
 * @returns Array of nodes
 */
export const enhanceTextWithTooltips = (text, remainingGlossaryterms) => {
  const caseSensitive = config.settings.glossary.caseSensitive;
  const { matchOnlyFirstOccurence } = config.settings.glossary;
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
      result = flatten(result);
    });
  }
  // Array of { type: 'text', val: text }, { type: 'glossarytermtooltip', val: text }
  result = flatten(result);

  return [
    result.map((el, j) => {
      if (el.type === 'text') {
        return applyLineBreakSupport(el.val);
      } else {
        let idx = remainingGlossaryterms.findIndex(
          (variant) => variant.term.toLowerCase() === el.val.toLowerCase(),
        );
        let definition = remainingGlossaryterms[idx]?.definition;
        if (
          !definition ||
          (Array.isArray(definition) && definition.length === 0)
        ) {
          return applyLineBreakSupport(el.val);
        }
        if (definition.length === 1) {
          definition = definition[0];
        } else {
          let arrayOfListNodes = definition
            .map((el) => `<li>${el}</li>`)
            .join('');
          definition = `<ol>${arrayOfListNodes}</ol>`;
        }
        const TooltipPopup = config.getComponent('TooltipPopup').component;
        return (
          <TooltipPopup term={el.val} definition={definition} idx={j} key={j} />
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

/**
 * calculate all markup of all slate blocks text, teaser blocks description and content description
 */
const calculateTexts = (content, glossaryterms) => {
  let remainingGlossaryterms = glossaryterms;
  let result = {};
  const blocks = content?.blocks;
  const blocks_layout = content?.blocks_layout;

  function processText(el) {
    if (!el) return;
    const key = uuidv5(el, MY_NAMESPACE);
    if (Object.keys(result).includes(key)) return;
    const [value, newTerms] = enhanceTextWithTooltips(
      el,
      remainingGlossaryterms,
    );
    result[key] = value;
    remainingGlossaryterms = newTerms;
  }

  function processSlateValue(slateValue) {
    const arrayOfStrings = flattenDeep(serializeNodes(slateValue));
    arrayOfStrings.forEach((str) => {
      if (str.length === 0) return;
      processText(str);
    });
  }

  function iterateOverBlocks(blocks, blocks_layout) {
    blocks_layout?.items &&
      blocks_layout.items.forEach((blockid) => {
        [blocks[blockid].title, blocks[blockid].description].forEach(
          processText,
        );
        if (blocks[blockid].value) {
          // Simple slate block
          processSlateValue(blocks[blockid].value);
        } else {
          // Nested blocks
          // block type 'gridBlock' or '"accordionPanel"
          if (blocks[blockid].blocks && blocks[blockid].blocks_layout) {
            iterateOverBlocks(
              blocks[blockid].blocks,
              blocks[blockid].blocks_layout,
            );
          }
          // block type 'accordion'
          if (
            config.settings.glossary.includeAccordionBlock &&
            blocks[blockid].data?.blocks &&
            blocks[blockid].data?.blocks_layout
          ) {
            iterateOverBlocks(
              blocks[blockid].data.blocks,
              blocks[blockid].data.blocks_layout,
            );
          }
        }
        // Slate content stored as 'content' property (e.g. InfoBox)
        if (blocks[blockid].content && Array.isArray(blocks[blockid].content)) {
          processSlateValue(blocks[blockid].content);
        }
        // Table cell values
        if (
          blocks[blockid].table?.rows &&
          Array.isArray(blocks[blockid].table.rows)
        ) {
          blocks[blockid].table.rows.forEach((row) => {
            row.cells?.forEach((cell) => {
              if (cell.value) {
                processSlateValue(cell.value);
              }
            });
          });
        }
        // Slider slide text
        if (blocks[blockid].slides && Array.isArray(blocks[blockid].slides)) {
          blocks[blockid].slides.forEach((slide) => {
            [slide.title, slide.description].forEach(processText);
          });
        }
        // CardSection column text
        if (blocks[blockid].columns && Array.isArray(blocks[blockid].columns)) {
          blocks[blockid].columns.forEach((column) => {
            [column.title, column.description].forEach(processText);
          });
        }
      });
  }
  iterateOverBlocks(blocks, blocks_layout);

  [content?.title, content?.description].forEach(processText);

  return result;
};

export default Tooltips;
