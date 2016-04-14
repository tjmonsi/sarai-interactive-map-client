import React from 'react';
import Landing from './components/landing.jsx';
import SaraiMap from './components/sarai-map.jsx';

export default (injectDeps, context) => {
  const {mount, page, qs} = context;
  const LandingCtx = injectDeps(Landing);

  const main = (ctx) => {
    const query = qs.parse(ctx.querystring);
    mount(LandingCtx, {
      displayName: 'LandingCtx',
      sections: [
        () => (React.createElement(SaraiMap, {
          displayName: 'SaraiMap',
          query
        }))
      ]
    });
  };

  page.base('/');
  page('/', main);
  page();
};
