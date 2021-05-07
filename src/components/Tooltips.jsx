import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { getUser, searchContent } from '@plone/volto/actions';

const Tooltips = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userSession?.token);

  useEffect(() => {
    dispatch(
      searchContent(
        '/',
        {
          portal_type: ['Term'],
          review_state: ['published'],
          sort_on: 'id',
          sort_order: 'descending',
          b_size: 1000,
        },
        'glossaryterms',
      ),
    );
  }, [dispatch]);

  React.useEffect(() => {
    let userid = token ? jwtDecode(token).sub : '';
    dispatch(getUser(userid));
  }, [dispatch, token]);

  return <div className="hidden-helper"></div>;
};

export default Tooltips;
