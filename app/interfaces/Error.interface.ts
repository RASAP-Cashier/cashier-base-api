/**
 * @typedef {Object} ErrorInterface
 * @property {number} httpStatus - Status code of the HTTP response.
 * @property {string} message - Error message.
 */
export interface ErrorInterface {
  httpStatus: number;
  message: string;
}
