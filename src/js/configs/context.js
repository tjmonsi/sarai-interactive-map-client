import {mount} from 'react-mounter';
import page from 'page';
import qs from 'qs';
import _ from 'underscore';

export const initContext = () => {
  return {
    mount,
    page,
    qs,
    _
  };
};
