# @rohberg/volto-slate-glossary

Volto Add-On `@rohberg/volto-slate-glossary` adds tooltips for glossary terms of [collective.glossary](https://github.com/collective/collective.glossary)

![Tooltips @rohberg/volto-slate-glossary](https://github.com/rohberg/volto-slate-glossary/raw/main/public/volto-slate-glossary-tooltips.png)


Install Plone Add-On [collective.glossary](https://github.com/collective/collective.glossary) in your backend.


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

By default we show tooltips for all occurences of a term.

Since version 2.0.0 you can configure to only show tooltips for the first occurence on a page.

```js
config.settings.glossary.matchOnlyFirstOccurence = true;
```

User can opt-out by setting glossarytooltips to false.
Add a boolean member field *glossarytooltips* for it.


## Compatibility

| volto-slate-glossary version | Volto version |
|-------------|---------------|
|   1.x.x  |   >= Volto 16.0.0-alpha.15  |
|   2.x.x  |   >= Volto 18.0.0-alpha.48  |
