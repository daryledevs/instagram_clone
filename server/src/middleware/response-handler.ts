import { Request, Response, NextFunction } from 'express';

async function responseHandler(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  let isConverted = false;
  res.send = function (body: any) {
    const noAccessToken = typeof body === "object" && !body?.accessToken;
    const isSuccessStatus = res.statusCode >= 200 && res.statusCode <= 299;
    if (!isConverted && noAccessToken && isSuccessStatus) {
      isConverted = true;
      const dataKeys = Object.keys(body);
      const converted: object = destructureObject(body, dataKeys);
      return originalSend.call(res, converted);
    } else {
      return originalSend.call(res, body);
    }
  };
  next();
}

function destructureObject(data: any, dataKeys: any): object {
  let instance: object = {};
  for (const index in dataKeys) {
    const key = dataKeys[index];
    const value = data[key];
    if(value && Array.isArray(value)) {
      // way to get the RowDataPacket's values
      const parsedArr = value.map((item:any) => JSON.parse(JSON.stringify(item)));
      const result = parsedArr.map((item: any) => convert(item));
      instance = { ...instance, [key] : result };
    } else if (data.hasOwnProperty(key) && typeof value === "object" && value) {
      const result = destructureObject(value, dataKeys);
      const converted = convert(result);
      const length = Object.keys(converted).length;
      const newValue = Array.isArray(value) ? length ? [converted] : [] : converted;
      instance = { ...instance, [key]: newValue };
    } else {
      instance = { ...instance, ...data };
    };
  };
  return instance;
};

function convert(data: any) {
  let modified: object = { };
  Object.keys(data).forEach((key: any, index: any) => {
    const lowerCaseKey = key.toLowerCase();
    modified = {
      ...modified,
      [lowerCaseKey]: data[`${key}`],
    };
  });
  return modified;
};

export default responseHandler;

