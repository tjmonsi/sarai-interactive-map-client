import React from 'react';
import Landing from './components/landing.jsx';

export default (injectDeps, context) => {
  const {mount, page, qs} = context;
  const LandingCtx = injectDeps(Landing);

  const main = (ctx) => {
    const q = qs.parse(ctx.querystring);
    const searchWords = q.search && q.search.toLowerCase().trim() !== '' ?
      q.search.toLowerCase().trim().split(' ') : [];
    let searchRegex = q.search && q.search.toLowerCase().trim() !== '' ?
      `(${q.search.toLowerCase().replace(/( )+/g, '[\\w\\W]*( )*[\\w\\W]*')})` : '';
    for (let i = 0; i < searchWords.length; i++) {
      searchRegex += searchWords[i].trim() !== '' ? `|(${searchWords[i]})+` : '';
    }
    const query = q.search ? Object.assign({}, q, {
      searchRegex: new RegExp(searchRegex)
    }) : q;
    mount(LandingCtx, {
      displayName: 'LandingCtx',
      sections: [
      ]
    });
  };

  page.base('/');
  page('/', main);
  page();
};
