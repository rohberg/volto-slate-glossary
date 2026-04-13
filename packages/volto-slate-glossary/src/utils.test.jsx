import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { TextWithGlossaryTooltips } from './utils';

const mockStore = configureStore();

const baseStore = {
  router: {
    location: { pathname: '/test' },
  },
  intl: {
    locale: 'en',
    messages: {},
  },
  users: {
    user: {},
  },
};

const Wrapper = ({ store, children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('TextWithGlossaryTooltips', () => {
  it('renders text unchanged when no tooltips are available', () => {
    const store = mockStore(baseStore);
    const { container } = render(
      <Wrapper store={store}>
        <TextWithGlossaryTooltips text="Hello World" />
      </Wrapper>,
    );
    expect(container).toHaveTextContent('Hello World');
  });

  it('always wraps output in a span element for consistent SSR/client rendering', () => {
    // No tooltips configured — should still return a <span>
    const store = mockStore(baseStore);
    const { container } = render(
      <Wrapper store={store}>
        <TextWithGlossaryTooltips text="Some text" />
      </Wrapper>,
    );
    const span = container.querySelector('span');
    expect(span).not.toBeNull();
    expect(span).toHaveTextContent('Some text');
  });

  it('wraps output in span when pathname does not match', () => {
    const store = mockStore({
      ...baseStore,
      glossarytooltipterms: {
        result: { items: [], items_total: 0 },
      },
    });
    const { container } = render(
      <Wrapper store={store}>
        <TextWithGlossaryTooltips text="Mismatched path" />
      </Wrapper>,
    );
    const span = container.querySelector('span');
    expect(span).not.toBeNull();
    expect(span).toHaveTextContent('Mismatched path');
  });

  it('does not throw hooks error when number of instances changes between renders', () => {
    const store = mockStore(baseStore);

    // Parent component that renders a variable number of TextWithGlossaryTooltips
    const DynamicList = ({ items }) => (
      <div>
        {items.map((item, i) => (
          <p key={i}>
            <TextWithGlossaryTooltips text={item} />
          </p>
        ))}
      </div>
    );

    // First render: 2 items
    const { rerender } = render(
      <Wrapper store={store}>
        <DynamicList items={['First', 'Second']} />
      </Wrapper>,
    );

    // Re-render with 4 items — this would crash with the function-call pattern
    expect(() => {
      rerender(
        <Wrapper store={store}>
          <DynamicList items={['First', 'Second', 'Third', 'Fourth']} />
        </Wrapper>,
      );
    }).not.toThrow();

    // Re-render back to 1 item
    expect(() => {
      rerender(
        <Wrapper store={store}>
          <DynamicList items={['Only one']} />
        </Wrapper>,
      );
    }).not.toThrow();
  });
});
