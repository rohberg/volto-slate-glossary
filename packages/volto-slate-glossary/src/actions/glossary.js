import { GET_GLOSSARYTERMS, GET_TOOLTIPTERMS } from '../constants/ActionTypes';

export function getGlossaryTerms(pathname = null) {
  return {
    type: GET_GLOSSARYTERMS,
    request: {
      op: 'get',
      path: (pathname ? `${pathname}` : '') + '/@glossary_terms',
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
