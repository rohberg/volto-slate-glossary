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

export function getTooltipTerms(navroot = null) {
  return {
    type: GET_TOOLTIPTERMS,
    request: {
      op: 'get',
      path: (navroot ? `${navroot}` : '') + '/@tooltip_terms',
    },
  };
}
