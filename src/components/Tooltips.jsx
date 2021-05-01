import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { searchContent } from '@plone/volto/actions';

const Tooltips = () => {
  const dispatch = useDispatch();
  const glossaryterms = useSelector(
    (state) => state.search.subrequests.glossaryterms?.items,
  );
  console.log('glossaryterms', glossaryterms);

  useEffect(() => {
    const portalTypes = ['Term'];
    const workflows = ['published'];
    dispatch(
      searchContent(
        '/',
        {
          portal_type: portalTypes,
          review_state: workflows,
          sort_on: 'title',
        },
        'glossaryterms',
      ),
    );
  }, [dispatch]);

  return __CLIENT__ && <div>I am Tooltips component</div>;
};

export default Tooltips;
