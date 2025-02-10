import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { waitFor } from '@testing-library/react';

import ErrorBoundary from '@plone/volto/components/theme/Error/ErrorBoundary';
import View from '@plone/volto/components/theme/View/View';
import DefaultView from '@plone/volto/components/theme/View/DefaultView';
import AppExtras from '@plone/volto/components/theme/AppExtras/AppExtras';
import ViewTitleBlock from '@plone/volto/components/manage/Blocks/Title/View';
import installSlate from '@plone/volto-slate/editor';
import installTextBlock from '@plone/volto-slate/blocks/Text';
import TextBlockView from '@plone/volto-slate/blocks/Text/TextBlockView';
import Tooltips from './Tooltips';
import applyConfig from '../index';

import config from '@plone/volto/registry';

function installTooltips(config) {
  config.settings.appExtras = [
    // ...config.settings.appExtras,
    {
      match: '/test',
      component: Tooltips,
    },
  ];
  return config;
}

beforeAll(() => {
  config.set('views', {
    defaultView: DefaultView,
    layoutViews: {
      summary_view: () => <div id="SummaryView" />,
    },
    contentTypesViews: {
      Document: DefaultView,
    },
    errorViews: {
      ECONNREFUSED: () => <div className="ECONNREFUSED" />,
    },
  });

  config.settings.publicURL = 'https://plone.org';

  // Apply volto-slate configuration
  [installSlate, installTextBlock].reduce((acc, apply) => apply(acc), config);

  config.blocks.blocksConfig['title'] = {
    id: 'title',
    title: 'Title',
    view: ViewTitleBlock,
  };
  config.blocks.blocksConfig['slate'] = {
    id: 'slate',
    title: 'Text',
    view: TextBlockView,
  };

  // Apply volto-slate-glossary configuration
  [installTooltips, applyConfig].reduce((acc, apply) => apply(acc), config);
});

global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

const mockStore = configureStore();

jest.mock('@plone/volto/components/manage/Toolbar/Toolbar', () =>
  jest.fn(() => <div id="Portal" />),
);

jest.mock('@plone/volto/components/theme/Comments/Comments', () =>
  jest.fn(() => <div id="Comments" />),
);
jest.mock('@plone/volto/components/theme/Tags/Tags', () =>
  jest.fn(() => <div id="Tags" />),
);
jest.mock('@plone/volto/components/theme/SlotRenderer/SlotRenderer', () =>
  jest.fn(() => <div id="SlotRenderer" />),
);
jest.mock(
  '@plone/volto/components/theme/ContentMetadataTags/ContentMetadataTags',
  () => jest.fn(() => <div id="ContentMetadataTags" />),
);

const actions = {
  document_actions: [],
  object: [
    {
      icon: '',
      id: 'view',
      title: 'View',
    },
    {
      icon: '',
      id: 'edit',
      title: 'Edit',
    },
    {
      icon: '',
      id: 'folderContents',
      title: 'Contents',
    },
    {
      icon: '',
      id: 'history',
      title: 'History',
    },
    {
      icon: '',
      id: 'local_roles',
      title: 'Sharing',
    },
  ],
  object_buttons: [
    {
      icon: '',
      id: 'cut',
      title: 'Cut',
    },
    {
      icon: '',
      id: 'copy',
      title: 'Copy',
    },
    {
      icon: '',
      id: 'delete',
      title: 'Delete',
    },
    {
      icon: '',
      id: 'rename',
      title: 'Rename',
    },
    {
      icon: '',
      id: 'ical_import_enable',
      title: 'Enable icalendar import',
    },
  ],
  portal_tabs: [],
  site_actions: [
    {
      icon: '',
      id: 'sitemap',
      title: 'Site Map',
    },
    {
      icon: '',
      id: 'accessibility',
      title: 'Accessibility',
    },
    {
      icon: '',
      id: 'contact',
      title: 'Contact',
    },
  ],
  user: [
    {
      icon: '',
      id: 'preferences',
      title: 'Preferences',
    },
    {
      icon: '',
      id: 'dashboard',
      title: 'Dashboard',
    },
    {
      icon: '',
      id: 'plone_setup',
      title: 'Site Setup',
    },
    {
      icon: '',
      id: 'logout',
      title: 'Log out',
    },
  ],
};

const initialStore = {
  router: {
    location: { pathname: '/test' },
  },
  actions: { actions },
  content: {
    data: {
      '@type': 'Document',
      title: 'Python tutorial',
      blocks: {
        '1b1e29b6-5c16-48b7-ae63-d6dd70d9799c': {
          '@type': 'slate',
          plaintext: 'Morgen üben wir weiter.',
          value: [
            {
              children: [
                {
                  text: 'Morgen üben wir weiter.',
                },
              ],
              type: 'p',
            },
          ],
        },
        '5bdcc024-9715-4711-bb61-05019a4b8d1e': {
          '@type': 'slate',
          plaintext: 'Üben macht den Meister.',
          value: [
            {
              children: [
                {
                  text: 'Üben macht den Meister.',
                },
              ],
              type: 'p',
            },
          ],
        },
        '713f6a98-68af-4935-860b-9f17375368d8': {
          '@type': 'slate',
          plaintext:
            'Wir üben das. Die Abkürzung AB ist im Glossar erklärt. Wir verwenden AB ab Donnerstag.',
          value: [
            {
              children: [
                {
                  text: 'Wir üben das. Die Abkürzung AB ist im Glossar erklärt. Wir verwenden AB ab Donnerstag.',
                },
              ],
              type: 'p',
            },
          ],
        },
        '00000001-68af-4935-860b-9f17375368d8': {
          '@type': 'slate',
          plaintext:
            'Bij volledige elektrificatie: Canyon: Tot -57% of tot -17 µg NO2/m3',
          value: [
            {
              children: [
                {
                  text: 'Bij volledige elektrificatie: <strong>Canyon: Tot -57% of tot -17 µg NO2/m3</strong>',
                },
              ],
              type: 'p',
            },
          ],
        },
        '00000002-68af-4935-860b-9f17375368d8': {
          '@type': 'slate',
          plaintext: 'In automn, Aბㄱ is something you should care about.',
          value: [
            {
              children: [
                {
                  text: 'In automn, Aბㄱ is something you should care about.',
                },
              ],
              type: 'p',
            },
          ],
        },
        '00000003-68af-4935-860b-9f17375368d8': {
          '@type': 'slate',
          plaintext:
            'Het laatste 8-uurgemiddelde van een dag wordt berekend van 16:00 uur tot 24:00 uur.',
          value: [
            {
              children: [
                {
                  text: 'Het laatste 8-uurgemiddelde van een dag wordt berekend van 16:00 uur tot 24:00 uur.',
                },
              ],
              type: 'p',
            },
          ],
        },
        'e4ceaac9-669f-4df4-937a-fb762f7b289e': {
          '@type': 'title',
        },
      },
      blocks_layout: {
        items: [
          'e4ceaac9-669f-4df4-937a-fb762f7b289e',
          '5bdcc024-9715-4711-bb61-05019a4b8d1e',
          '713f6a98-68af-4935-860b-9f17375368d8',
          '00000001-68af-4935-860b-9f17375368d8',
          '00000002-68af-4935-860b-9f17375368d8',
          '00000003-68af-4935-860b-9f17375368d8',
          '1b1e29b6-5c16-48b7-ae63-d6dd70d9799c',
        ],
      },
    },
    get: { error: null },
  },
  userSession: { token: null },
  apierror: {},
  intl: {
    locale: 'en',
    messages: {},
  },
  glossarytooltipterms: {
    error: null,
    hasErrror: false,
    result: {
      items: [
        {
          definition: [
            '<p><span class="">Eine Tätigkeit ausführen um vertrauter mit ihr zu werden und sie zu meistern.</span></p>',
          ],
          term: 'üben',
        },
        {
          definition: [
            '<p><span class="">Microgram of één miljoenste gram.</span></p>',
          ],
          term: 'µg',
        },
        {
          definition: [
            '<p><span class="">No clue what that should be!?</span></p>',
          ],
          term: 'Aბㄱ',
        },
        {
          definition: ['<p><span class="">Arbeitsbegleitung</span></p>'],
          term: 'AB',
        },
        {
          definition: [
            '<p><span class="">Voor het hoogste 8-uurgemiddelde van een dag berekenen we voor elke 8 uur het gemiddelde en nemen dan de hoogste waarde.  Het eerste 8-urgemiddelde van een dag loopt van 17:00 uur op de dag daarvoor tot 1:00 uur op de dag zelf.</span></p>',
          ],
          term: '8-uurgemiddelde',
        },
      ],
      items_total: 1,
    },
    loadingResults: false,
  },
};

describe('Tooltips in general', () => {
  let baseStore = initialStore;

  it(" – NO tooltips if route doesn't match configuration", () => {
    const store = mockStore(baseStore);
    config.settings.appExtras = [];
    const { container } = render(
      <Provider store={store}>
        <ErrorBoundary>
          <View location={{ pathname: '/test' }} />
          <div id="toolbar"></div>
        </ErrorBoundary>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Üben macht den Meister');
  });

  it(' – component Tooltips is rendered in AppExtras', () => {
    const store = mockStore(baseStore);
    config.settings.appExtras = [
      {
        match: '/test',
        component: Tooltips,
      },
    ];
    const { container } = render(
      <Provider store={store}>
        <ErrorBoundary>
          <AppExtras
            pathname="/test"
            content={initialStore.content.data}
          ></AppExtras>
        </ErrorBoundary>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('Tooltips', () => {
  let baseStore = initialStore;

  test('are generated for all occurrences', async () => {
    const store = mockStore(baseStore);
    const { container } = render(
      <Provider store={store}>
        <ErrorBoundary>
          <View location={{ pathname: '/test' }} />
          <div id="toolbar"></div>
          <AppExtras
            pathname="/test"
            content={initialStore.content.data}
          ></AppExtras>
        </ErrorBoundary>
      </Provider>,
    );

    await waitFor(() => {});
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Üben macht den Meister');
  });

  test('are generated only for first occurrences per page', async () => {
    const store = mockStore(baseStore);
    config.settings.glossary.matchOnlyFirstOccurence = true;
    const { container } = render(
      <Provider store={store}>
        <ErrorBoundary>
          <View location={{ pathname: '/test' }} />
          <div id="toolbar"></div>
          <AppExtras
            pathname="/test"
            content={initialStore.content.data}
          ></AppExtras>
        </ErrorBoundary>
      </Provider>,
    );

    await waitFor(() => {});
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Üben macht den Meister');
  });

  test('are generated only case sensitive', async () => {
    const store = mockStore(baseStore);
    config.settings.glossary.matchOnlyFirstOccurence = false;
    config.settings.glossary.caseSensitive = true;
    const { container } = render(
      <Provider store={store}>
        <ErrorBoundary>
          <View location={{ pathname: '/test' }} />
          <div id="toolbar"></div>
          <AppExtras
            pathname="/test"
            content={initialStore.content.data}
          ></AppExtras>
        </ErrorBoundary>
      </Provider>,
    );

    await waitFor(() => {});
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Üben macht den Meister');
  });
});
