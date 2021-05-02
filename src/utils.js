// TODO serializeNodes
import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { flatten, isEqual, reverse } from 'lodash';
import { Button, Popup } from 'semantic-ui-react';
import { Node, Text } from 'slate';

import { Element, Leaf } from 'volto-slate/editor/render';

const addGlossaryTooltips = (txt) => {
  const glossaryterms = useSelector(
    (state) => state.search.subrequests.glossaryterms?.items,
  );
  let result = [{ type: 'text', val: txt }];
  if (glossaryterms !== undefined) {
    glossaryterms.forEach((term) => {
      result = result.map((chunk) => {
        if (chunk.type === 'text') {
          let splittedtext = chunk.val.split(term.title);
          if (splittedtext.length > 1) {
            chunk = [{ type: 'text', val: splittedtext[0] }];
            splittedtext.splice(0, 1);
            splittedtext.forEach((t) => {
              chunk.push({
                type: 'popup',
                val: term.title,
              });
              chunk.push({ type: 'text', val: t });
            });
          }
        }
        return chunk;
      });
      result = flatten(result);
    });
  }
  result = flatten(result);
  return result;
};

const serializeData = (node) => {
  return JSON.stringify({ type: node.type, data: node.data });
};

export const serializeNodes = (nodes, getAttributes) => {
  const editor = { children: nodes || [] };
  const glossaryterms = useSelector(
    (state) => state.search.subrequests.glossaryterms?.items,
  );

  const _serializeNodes = (nodes) => {
    return (nodes || []).map(([node, path], i) => {
      return Text.isText(node) ? (
        <Leaf path={path} leaf={node} text={node} mode="view" key={path}>
          {addGlossaryTooltips(node.text).map((el, j) => {
            if (el.type === 'text') {
              return <span key={j}>{el.val}</span>;
            } else {
              let idx = glossaryterms.findIndex((gt) => gt.title === el.val);
              let descr = glossaryterms[idx]['description'];
              return (
                <Popup
                  trigger={<span className="glossarytooltip">{el.val}</span>}
                  key={j}
                >
                  <Popup.Content>
                    <div>
                      <b>{el.val}</b>
                      <br />
                      <span>{descr}</span>
                    </div>
                  </Popup.Content>
                </Popup>
              );
            }
          })}
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
