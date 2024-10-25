# @rohberg/volto-slate-glossary

Volto add-on `@rohberg/volto-slate-glossary` adds tooltips for glossary terms of [collective.glossary](https://github.com/collective/collective.glossary)

[![npm](https://img.shields.io/npm/v/@rohberg/volto-slate-glossary)](https://www.npmjs.com/package/@rohberg/volto-slate-glossary)
[![Unit tests](https://github.com/rohberg/volto-slate-glossary/actions/workflows/unit.yml/badge.svg)](https://github.com/rohberg/volto-slate-glossary/actions/workflows/unit.yml)
[![Code analysis checks](https://github.com/rohberg/volto-slate-glossary/actions/workflows/code.yml/badge.svg)](https://github.com/rohberg/volto-slate-glossary/actions/workflows/code.yml)


![Tooltips @rohberg/volto-slate-glossary](https://github.com/rohberg/volto-slate-glossary/raw/main/docs/volto-slate-glossary-tooltips.png)

Install Plone add-on [collective.glossary](https://github.com/collective/collective.glossary) in your backend.
This provides the content type `glossary`.

Determine where to apply tooltips in your project by match configuration:

```javascript
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

```
config.settings.glossary.caseSensitive = true;
```

Regardless of this setting, when you have a fully uppercase term, for example `REST` (Representational State Transfer), always only the exact word `REST` gets a tooltip, not `rest` or `Rest`.

By default we show tooltips for all occurrences of a term.

Since version 2.0.0 you can configure to only show tooltips for the first occurence on a page.

```js
config.settings.glossary.matchOnlyFirstOccurence = true;
```


User can opt-out by setting glossarytooltips to false.
Add a boolean member field *glossarytooltips* for it.
