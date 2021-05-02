# volto-slate-glossary

[Volto Slate](https://github.com/eea/volto-slate/tree/develop) Glossary

## Features

### Add tootips for glossary terms of [collective.glossary](https://pypi.org/project/collective.glossary/)


## Getting started

Install volto-slate-glossary.

Include in your project with

    import Tooltips from '@rohberg/volto-glossary/components';

    // All your imports required for the config here BEFORE this line
    import '@plone/volto/config';

    export default function applyConfig(config) {
        config.settings = {
            ...config.settings,
            appExtras: [
                ...config.settings.appExtras,
                {
                    match: '',
                    component: Tooltips,
                },
            ],
        };

        return config;
    }


Install Plone Add-On [collective.glossary](https://github.com/collective/collective.glossary)



> This add-on is for slate editor only, not draftJS editor.
