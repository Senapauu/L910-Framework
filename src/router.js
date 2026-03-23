class Router {
  constructor() {
    this.routes = {
      get: [],
      post: [],
      put: [],
      patch: [],
      delete: []
    };
  }

  get(path, handler) {
    this.routes.get.push({ path, handler });
  }

  post(path, handler) {
    this.routes.post.push({ path, handler });
  }

  put(path, handler) {
    this.routes.put.push({ path, handler });
  }

  patch(path, handler) {
    this.routes.patch.push({ path, handler });
  }

  delete(path, handler) {
    this.routes.delete.push({ path, handler });
  }

  matchRoute(routePath, reqPath) {
    const routeParts = routePath.split('/');
    const reqParts = reqPath.split('/');
    
    if (routeParts.length !== reqParts.length) {
      return null;
    }

    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].substring(1)] = reqParts[i];
      } else if (routeParts[i] !== reqParts[i]) {
        return null;
      }
    }
    
    return Object.keys(params).length > 0 ? params : {};
  }

  async dispatch(req, res, pathname, method) {
    const routes = this.routes[method];
    
    if (!routes || routes.length === 0) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }

    for (const route of routes) {
      const params = this.matchRoute(route.path, pathname);
      
      if (params !== null) {
        req.params = params;
        await route.handler(req, res);
        return;
      }
    }

    res.status(404).json({ error: 'Not Found' });
  }
}

module.exports = { Router };
