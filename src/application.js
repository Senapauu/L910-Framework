const http = require('http');
const { Router } = require('./router');
const { Request } = require('./request');
const { Response } = require('./response');

class Application {
  constructor() {
    this.router = new Router();
    this.middleware = [];
  }

  use(fn) {
    this.middleware.push(fn);
    return this;
  }

  get(path, handler) {
    this.router.get(path, handler);
    return this;
  }

  post(path, handler) {
    this.router.post(path, handler);
    return this;
  }

  put(path, handler) {
    this.router.put(path, handler);
    return this;
  }

  patch(path, handler) {
    this.router.patch(path, handler);
    return this;
  }

  delete(path, handler) {
    this.router.delete(path, handler);
    return this;
  }

  parseUrl(url) {
    const urlObj = new URL(url, `http://localhost`);
    return {
      pathname: urlObj.pathname,
      query: Object.fromEntries(urlObj.searchParams)
    };
  }

  async parseBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if (body) {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        } else {
          resolve({});
        }
      });
    });
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

  async handleRequest(req, res) {
    const { pathname, query } = this.parseUrl(req.url);
    const method = req.method.toLowerCase();

    const body = await this.parseBody(req);

    const request = new Request(req, body, query, pathname);
    const response = new Response(res);

    const middlewareChain = [
      ...this.middleware,
      (req, res) => this.router.dispatch(req, res, pathname, method)
    ];

    let index = 0;
    
    const next = async () => {
      if (index >= middlewareChain.length) {
        return;
      }
      
      const middleware = middlewareChain[index++];
      
      try {
        await middleware(request, response, next);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    };

    await next();
  }

  listen(port, callback) {
    const server = http.createServer(async (req, res) => {
      await this.handleRequest(req, res);
    });

    server.listen(port, () => {
      if (callback) {
        callback();
      }
    });

    return server;
  }
}

module.exports = { Application };
