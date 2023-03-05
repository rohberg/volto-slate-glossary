# @rohberg/volto-slate-glossary

Volto Add-On `@rohberg/volto-slate-glossary` adds tooltips for glossary terms of [collective.glossary](https://github.com/collective/collective.glossary)

![Tooltips @rohberg/volto-slate-glossary](https://github.com/rohberg/volto-slate-glossary/raw/main/public/volto-slate-glossary-tooltips.png)

Determine where to apply tooltips in your project by match configuration:

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


Install Plone Add-On [collective.glossary](https://github.com/collective/collective.glossary) in your backend.


User can opt-out by setting glossarytooltips to false.
Add a boolean member field *glossarytooltips* for it.


This add-on requires Volto with Slate editor. Be sure to upgrade to Volto >= 16.0.0-alpha.15.
