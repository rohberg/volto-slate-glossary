import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchContent } from '@plone/volto/actions';

const Tooltips = () => {
  const dispatch = useDispatch();
  // console.log('Tooltipscomponent: glossaryterms', glossaryterms);

  useEffect(() => {
    dispatch(
      searchContent(
        '/',
        {
          portal_type: ['Term'],
          review_state: ['published'],
          sort_on: 'id',
          sort_order: 'descending',
        },
        'glossaryterms',
      ),
    );
  }, [dispatch]);

  return <div className="hidden-helper"></div>;
};

export default Tooltips;
