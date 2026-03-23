class Request {
  constructor(httpRequest, body = {}, query = {}, path = '') {
    this.httpRequest = httpRequest;
    this.body = body;
    this.query = query;
    this.params = {};
    this.path = path;
    this.method = httpRequest.method;
    this.headers = httpRequest.headers;
  }
}

module.exports = { Request };
