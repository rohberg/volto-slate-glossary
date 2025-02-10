# @rohberg/volto-slate-glossary

Volto add-on `@rohberg/volto-slate-glossary` adds tooltips for glossary terms of [collective.glossary](https://github.com/collective/collective.glossary)

[![npm](https://img.shields.io/npm/v/@rohberg/volto-slate-glossary)](https://www.npmjs.com/package/@rohberg/volto-slate-glossary)
[![Unit tests](https://github.com/rohberg/volto-slate-glossary/actions/workflows/unit.yml/badge.svg)](https://github.com/rohberg/volto-slate-glossary/actions/workflows/unit.yml)
[![Code analysis checks](https://github.com/rohberg/volto-slate-glossary/actions/workflows/code.yml/badge.svg)](https://github.com/rohberg/volto-slate-glossary/actions/workflows/code.yml)


![Tooltips @rohberg/volto-slate-glossary](https://github.com/rohberg/volto-slate-glossary/raw/main/docs/volto-slate-glossary-tooltips.png)

Install Plone add-on [collective.glossary](https://github.com/collective/collective.glossary) in your backend.
This provides the content type `glossary`.

Determine where to apply tooltips in your project by match configuration:

```js
    import { Tooltips } from '@rohberg/volto-slate-glossary/components';

    export default function applyConfig(config) {
        config.settings.appExtras = [
            ...config.settings.appExtras,
            {
            match: '/documentation',
            component: Tooltips,
            },
            {
            match: '/news',
            component: Tooltips,
            },
        ];

        return config;
    }
```

By default we show a tooltip when a word matches case insensitively: when the term is "Hello" or "hello", a tooltip is shown for "Hello", "hello", "HELLO", "hElLo", etcetera.

You can configure this to be case sensitive for all terms, so "Hello" only matches for "Hello":

```js
config.settings.glossary.caseSensitive = true;
```

Regardless of this setting, when you have a fully uppercase term, for example `REST` (Representational State Transfer), always only the exact word `REST` gets a tooltip, not `rest` or `Rest`.

By default we show tooltips for all occurrences of a term.

You can configure to only show tooltips for the first occurence on a page.

```js
config.settings.glossary.matchOnlyFirstOccurence = true;
```

Hide alphabet navigation of glossary view:

```js
config.settings.glossary.showAlphabetNavigation = false;
```

Show glossary term in tooltips header:

```js
config.settings.glossary.mentionTermInTooltip = true;
```

Show tooltips also in text blocks of an [accordion block](https://github.com/eea/volto-accordion-block):

```js
config.settings.glossary.includeAccordionBlock = true;
```


### Show tooltips also in a teaser block

Per default only texts of slate blocks are equipped with tooltips.
`TextWithGlossaryTooltips` can be used to enhance other texts with tooltip markup.

Create a custom `TeaserView` component in your project:

```js
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
        },
      }}
    />
  );
};

export default withBlockExtensions(TeaserView);
```

Register your `TeaserView` component:

```js
import TeaserViewWithTooltips from './components/TeaserViewWithTooltips'; // import by speaking name

const applyConfig = (config) => {
  // your project configuration…

  // teaser block with tooltips 
  config.blocks.blocksConfig.teaser.view = TeaserViewWithTooltips;
  // teaser block in grid block also with tooltips 
  config.blocks.blocksConfig.gridBlock.blocksConfig.teaser.view =
    TeaserViewWithTooltips;

  return config;
};

export default applyConfig;
```

You can find the code also via `packages/policy/src/index.js`.


### Show tooltips also in a description block

Per default only texts of slate blocks are equipped with tooltips.
`TextWithGlossaryTooltips` can be used to enhance other texts with tooltip markup.

Create a custom `DescriptionBlockView` in your project:

```js
import { TextWithGlossaryTooltips } from '@rohberg/volto-slate-glossary/utils';

const DescriptionBlockView = ({ properties, metadata, id }) => {
  let description = (metadata || properties)['description'] || '';
  description = TextWithGlossaryTooltips({ text: description });

  return <p className="documentDescription">{description}</p>;
};

export default DescriptionBlockView;
````

Register your `DescriptionBlockView` component:

```js
config.blocks.blocksConfig.description.view = DescriptionBlockViewWithTooltips; // import by speaking name
```

You can find the code also via `packages/policy/src/index.js`.


### Register Custom tooltip component

The tooltip component can be replaced by a custom one.

```js
  config.registerComponent({
    name: 'TooltipPopup',
    component: CustomTooltipPopup,
  });
  ````

## Demo

To see the add-on in action, set up backend and frontend of this package.

backend:

```shell
make backend-install
make backend-create-site
make backend-start
```

frontend:

```shell
make install
make start
```


## Opt-out for users

A user can opt-out by setting glossarytooltips to false.
Add a boolean member field `glossarytooltips` to provide this.
