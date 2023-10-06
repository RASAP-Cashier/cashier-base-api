import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

import config from "../../config";

const awsConfig = {
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  region: config.aws.region,
};

const lambda = new LambdaClient(awsConfig);

export const invokeLambda = async (fnName: string, payload?: Record<string, unknown>) => {
  const command = new InvokeCommand({
    InvocationType: "Event",
    FunctionName: fnName,
    Payload: payload ? Buffer.from(JSON.stringify(payload)) : undefined,
  });
  await lambda.send(command);
};
