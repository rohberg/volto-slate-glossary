import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { getUser } from '@plone/volto/actions';
import { getTooltipTerms } from '../actions';

const Tooltips = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userSession?.token);

  useEffect(() => {
    dispatch(getTooltipTerms());
  }, [dispatch]);

  useEffect(() => {
    let userid = token ? jwtDecode(token).sub : '';
    if (token) {
      dispatch(getUser(userid));
    }
  }, [dispatch, token]);

  return <div className="hidden-helper"></div>;
};

export default Tooltips;
