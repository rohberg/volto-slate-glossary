import config from '@plone/volto/registry';
import { enhanceTextWithTooltips } from './Tooltips';

const TooltipPopup = ({ term, definition }) => (
  <span data-testid="tooltip-popup" data-definition={definition}>
    {term}
  </span>
);

beforeAll(() => {
  config.settings.glossary = {
    caseSensitive: false,
    matchOnlyFirstOccurence: false,
  };
  config.registerComponent({
    name: 'TooltipPopup',
    component: TooltipPopup,
  });
});

describe('enhanceTextWithTooltips – empty definition guard', () => {
  it('does not render a TooltipPopup when definition is undefined', () => {
    const [nodes] = enhanceTextWithTooltips('hello term world', [
      { term: 'term', definition: undefined },
    ]);
    const hasTooltip = nodes.some(
      (n) => n && n.props && n.props['data-testid'] === 'tooltip-popup',
    );
    expect(hasTooltip).toBe(false);
  });

  it('does not render a TooltipPopup when definition is an empty array', () => {
    const [nodes] = enhanceTextWithTooltips('hello term world', [
      { term: 'term', definition: [] },
    ]);
    const hasTooltip = nodes.some(
      (n) => n && n.props && n.props['data-testid'] === 'tooltip-popup',
    );
    expect(hasTooltip).toBe(false);
  });

  it('still renders a TooltipPopup when definition has content', () => {
    const [nodes] = enhanceTextWithTooltips('hello term world', [
      { term: 'term', definition: ['<p>a definition</p>'] },
    ]);
    const hasTooltip = nodes.some(
      (n) => n && n.props && n.props['data-testid'] === 'tooltip-popup',
    );
    expect(hasTooltip).toBe(true);
  });
});
