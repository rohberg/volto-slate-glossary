/**
 * customization of serializeNodes from volto-slate to apply glossary tooltips in text blocks
 * TODO find better solution without overriding serializeNodes. Something like a configurable Leaf.
 * See https://community.plone.org/t/slate-rendering/13787/4
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { flatten, isEqual } from 'lodash';
import { Popup } from 'semantic-ui-react';
import { Node, Text } from 'slate';

import { Element, Leaf } from 'volto-slate/editor/render';

const TextWithGlossaryTooltips = ({ text }) => {
  const glossaryterms = useSelector(
    (state) => state.glossarytooltipterms?.result?.items,
  );

  // no tooltips if user opted out
  const currentuser = useSelector((state) => state.users?.user);
  const glossarytooltips = currentuser?.glossarytooltips ?? true;
  if (!glossarytooltips) {
    return <span>{text}</span>;
  }

  let result = [{ type: 'text', val: text }];
  if (glossaryterms !== undefined) {
    glossaryterms.forEach((term) => {
      result = result.map((chunk) => {
        if (chunk.type === 'text') {
          let myre = `\\b${term.term}\\b`;
          let regExpTerm = new RegExp(myre);
          let splittedtext = chunk.val.split(regExpTerm).reverse();
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
      return <span key={j}>{el.val}</span>;
    } else {
      let idx = glossaryterms.findIndex((variant) => variant.term === el.val);
      let definition = glossaryterms[idx]?.definition || '';
      // TODO convert definition to ul
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

const serializeData = (node) => {
  return JSON.stringify({ type: node.type, data: node.data });
};

export const serializeNodes = (nodes, getAttributes) => {
  const editor = { children: nodes || [] };

  const _serializeNodes = (nodes) => {
    return (nodes || []).map(([node, path], i) => {
      return Text.isText(node) ? (
        <Leaf path={path} leaf={node} text={node} mode="view" key={path}>
          <TextWithGlossaryTooltips text={node.text} />
        </Leaf>
      ) : (
        <Element
          path={path}
          element={node}
          mode="view"
          key={path}
          data-slate-data={node.data ? serializeData(node) : null}
          attributes={
            isEqual(path, [0])
              ? getAttributes
                ? getAttributes(node, path)
                : null
              : null
          }
        >
          {_serializeNodes(Array.from(Node.children(editor, path)))}
        </Element>
      );
    });
  };

  return _serializeNodes(Array.from(Node.children(editor, [])));
};
