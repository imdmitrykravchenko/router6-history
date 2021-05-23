import { createBrowserHistory, BrowserHistoryOptions } from 'history';
import url from 'url';
import { RouteMiddleware } from 'router6/src';

const historyMiddleware =
  (options?: BrowserHistoryOptions): RouteMiddleware =>
  (router) => {
    const history = createBrowserHistory(options);

    history.listen(({ action, location }) => {
      if (action === 'POP') {
        router.navigateToPath(`${location.pathname}${location.search}`, {
          type: 'pop',
        });
      }
    });

    return ({ to, type }, next) => {
      const { search, pathname } = url.parse(
        url.format({ pathname: to.path, query: to.query }),
      );

      const payload = { search: search || '', pathname };

      if (type === 'replace') {
        history.replace(payload);
      }
      if (type === 'push') {
        history.push(payload);
      }
      return next();
    };
  };

export default historyMiddleware;
