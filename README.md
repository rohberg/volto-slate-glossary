Volto Add-On @rohberg/volto-glossary

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


Install Plone Add-On https://github.com/collective/collective.glossary

