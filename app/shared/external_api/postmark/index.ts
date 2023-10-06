import * as postmark from "postmark";

import config from "../../../config";

const client = new postmark.ServerClient(config.postmark.token);

export const sendEmail = async (mailConfig: Partial<postmark.TemplatedMessage>) =>
  client.sendEmailWithTemplate({ ...mailConfig, From: config.postmark.from } as postmark.TemplatedMessage);
