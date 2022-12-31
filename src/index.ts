import { createBrowserHistory, BrowserHistoryOptions } from 'history';
import url from 'url';
import { RouteMiddleware } from 'router6';

const historyMiddleware =
  (options?: BrowserHistoryOptions): RouteMiddleware =>
  (router) => {
    const history = createBrowserHistory(options);
    let silent = false;

    history.listen(({ action, location }) => {
      if (action === 'POP') {
        silent = true;
        router.navigateToPath(`${location.pathname}${location.search}`, {
          type: 'push',
        });
      }
    });

    return ({ to, type }, next) => {
      const { search, pathname } = url.parse(
        url.format({ pathname: to.path, query: to.query }),
      );

      const payload = { search: search || '', pathname };

      if (!silent && type === 'replace') {
        history.replace(payload);
      }
      if (!silent && type === 'push') {
        history.push(payload);
      }
      silent = false;

      return next();
    };
  };

export default historyMiddleware;
