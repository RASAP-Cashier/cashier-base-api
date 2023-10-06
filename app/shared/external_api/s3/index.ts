import { Readable } from "stream";

import { read } from "jimp";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getContentType } from "content-type-to-ext";
import { StatusCodes } from "http-status-codes";
import uuid = require("uuid");

import config from "../../../config";

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export interface IS3Upload {
  ETag: string;
  Location: string;
  key?: string;
  Key?: string;
  Bucket: string;
}

const parseImage = (data: string) => {
  const reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
  const match = data.match(reg);
  const baseType = {
    jpg: "jpg",
    png: "png",
    gif: "gif",
    svg: "svg",
    "svg+xml": "svg",
  };
  if (!match) {
    throw new Error("image base64 data error");
  }
  const found = Object.entries(baseType).find(([key]) => key === match[1]);
  const extName = found ? found[1] : match[1];
  return {
    mimeType: getContentType(extName as any),
    buffer: match[2],
    extName: `.${extName}`,
  };
};

export const deleteImage = async (fileName: string) => {
  const key = fileName.replace(/https?:\/\/([a-zA-Z.0-9]*)\//, "");
  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
  });
  return s3.send(command);
};

export async function uploadImage(imageBuffer?: string): Promise<string> {
  if (!imageBuffer) {
    return null;
  }

  const { mimeType, buffer, extName } = parseImage(imageBuffer);
  const fileName = uuid.v1();
  const key = `images/${fileName}${extName}`;

  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: Buffer.from(buffer, "base64"),
    ACL: "public-read",
    ContentType: mimeType,
  });

  try {
    const response = await s3.send(command);

    return `https://${config.aws.bucket}.s3.${s3.config.region}.amazonaws.com/${key}`;
  } catch (error) {
    throw error;
  }
}

export const uploadFile = async (
  key: string,
  body: Buffer | Readable,
  s3Params: Partial<PutObjectCommandInput> = {},
  bucket?: string,
): Promise<string> => {
  const command = new PutObjectCommand({
    Key: key,
    Body: body,
    Bucket: bucket || config.aws.bucket,
    ACL: "public-read",
    ...s3Params,
  });

  try {
    const response = await s3.send(command);
    return `https://${bucket || config.aws.bucket}.s3.amazonaws.com/${key}`;
  } catch (err) {
    throw err;
  }
};

export const checkFileExists = async (params: { Key: string; Bucket: string }): Promise<boolean> => {
  const command = new HeadObjectCommand({ Key: params.Key, Bucket: params.Bucket ?? config.aws.bucket });

  try {
    await s3.send(command);
    return true;
  } catch (err) {
    if (err.statusCode === StatusCodes.NOT_FOUND) {
      return false;
    } else {
      throw err;
    }
  }
};

export const deleteObject = async (bucket: string, key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await s3.send(command);
  } catch (err) {
    throw err;
  }
};

const resizeImage = async (buffer: string, width: number, height: number): Promise<Buffer | null> => {
  try {
    const r = await read(Buffer.from(buffer, "base64"));
    const [resizedWidth, resizedHeight] = getResizedImageSize(r.getWidth(), r.getHeight(), width, height);

    return new Promise((res) => {
      r.resize(resizedWidth, resizedHeight)
        .quality(60)
        .getBuffer(getContentType("jpg"), (err, data) => {
          if (err) {
            return res(null);
          }

          return res(data);
        });
    });
  } catch {
    return null;
  }
};

function getResizedImageSize(originWidth: number, originHeight: number, maxWidth: number, maxHeight: number) {
  let resizeWidth = originWidth;
  let resizeHeight = originHeight;

  let aspect = resizeWidth / resizeHeight;

  if (resizeWidth > maxWidth) {
    resizeWidth = maxWidth;
    resizeHeight = resizeWidth / aspect;
  }
  if (resizeHeight > maxHeight) {
    aspect = resizeWidth / resizeHeight;
    resizeHeight = maxHeight;
    resizeWidth = resizeHeight * aspect;
  }

  return [resizeWidth, resizeHeight];
}

export async function uploadResizedImage(imageBuffer: string, width: number, height: number): Promise<string | null> {
  const { mimeType, buffer, extName } = parseImage(imageBuffer);

  const resizedBuffer = await resizeImage(buffer, width, height);
  if (!resizedBuffer) return null;

  const fileName = uuid.v1();
  const key = `images/${fileName}${extName}`;

  try {
    await uploadFile(key, resizedBuffer, {
      ACL: "public-read",
      ContentType: mimeType,
    });

    return `https://${config.aws.bucket}.s3.amazonaws.com/${key}`;
  } catch (error) {
    if (key) {
      await deleteImage(key);
    }
    throw error;
  }
}
