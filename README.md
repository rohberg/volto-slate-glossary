# Volto Add-On @rohberg/volto-slate-glossary

## Add tooltips for glossary terms of [collective.glossary](https://github.com/collective/collective.glossary)

![Tooltips @rohberg/volto-slate-glossary](https://github.com/rohberg/volto-slate-glossary/blob/6deebe7ecfa5a6265e2ead8f5902cfd2243329ca/public/tooltips.png)

## work-in-progress

Include in your project with

    import { Tooltips } from '@rohberg/volto-slate-glossary/components';

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

Hack: Use the customized *serializeNodes* in *TextBlockView* instead of that from volto-slate. **TODO** Find a way to hook into rendering of blocks. A block tranformer is not appropriate as it manipulates the block data permanently. We want the blocks data to be untouched.

Install Plone Add-On [collective.glossary branch Plone5.2](https://github.com/collective/collective.glossary) in your backend.
