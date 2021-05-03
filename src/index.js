import { serializeNodes } from './utils';
import { searchContent } from '@plone/volto/actions';

const searchoptions = [
  '/',
  {
    portal_type: ['Term'],
    review_state: ['published'],
    sort_on: 'id',
    sort_order: 'descending',
    b_size: 1000,
  },
  'glossaryterms',
];

export default (config) => {
  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'glossaryterms',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'glossaryterms',
            promise: ({ location, store: { dispatch } }) =>
              __SERVER__ && dispatch(searchContent(searchoptions)),
          });
        }
        return dispatchActions;
      },
    },
  ];

  return config;
};

export { serializeNodes };
