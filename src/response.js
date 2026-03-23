class Response {
  constructor(httpResponse) {
    this.httpResponse = httpResponse;
    this.statusCode = 200;
    this.headers = {};
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  send(data) {
    this.httpResponse.writeHead(this.statusCode, {
      'Content-Type': 'text/plain',
      ...this.headers
    });
    this.httpResponse.end(data.toString());
    return this;
  }

  json(data) {
    const jsonString = JSON.stringify(data);
    this.httpResponse.writeHead(this.statusCode, {
      'Content-Type': 'application/json',
      ...this.headers
    });
    this.httpResponse.end(jsonString);
    return this;
  }

  set(name, value) {
    this.headers[name] = value;
    return this;
  }
}

module.exports = { Response };
