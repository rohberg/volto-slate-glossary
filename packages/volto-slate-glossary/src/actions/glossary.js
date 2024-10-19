import { GET_GLOSSARYTERMS, GET_TOOLTIPTERMS } from '../constants/ActionTypes';

export function getGlossaryTerms() {
  return {
    type: GET_GLOSSARYTERMS,
    request: {
      op: 'get',
      path: '/@glossary_terms',
    },
  };
}

export function getTooltipTerms() {
  return {
    type: GET_TOOLTIPTERMS,
    request: {
      op: 'get',
      path: '/@tooltip_terms',
    },
  };
}
