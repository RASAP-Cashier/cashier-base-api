import { Request, ParameterizedContext } from "koa";

/**
 * @typedef {Object} KoaRequest
 * @template T
 * @extends Request
 * @property {T} body - The body of the request.
 * The KoaRequest interface extends the Request object from Koa.js, which represents an HTTP request.
 * The Request object includes properties and methods useful for dealing with HTTP requests such as
 * the request url, query string, headers, etc.
 */
export interface KoaRequest<T> extends Request {
  body: T;
}

/**
 * @typedef {Object} RequestInterface
 * @template T
 * @extends ParameterizedContext
 * @property {KoaRequest<T>} request - The Koa request object.
 * The RequestInterface extends the ParameterizedContext from Koa.js, which encapsulates node's request and response objects into
 * single object, providing many helpful methods for writing web applications and middleware.
 * The ParameterizedContext also provides properties such as 'request' and 'response' which are instances of KoaRequest and
 * KoaResponse respectively.
 */
export interface RequestInterface<T> extends ParameterizedContext {
  request: KoaRequest<T>;
}
