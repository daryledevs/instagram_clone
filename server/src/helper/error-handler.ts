import { ErrorRequestHandler, Request, Response } from "express";
import Exception from "../exception/exception";
import DatabaseException from "../exception/database";

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {

  if(err instanceof DatabaseException) {
    return res.status(500).send(err);
  }

  if(err instanceof Exception) {
    const { status, message } = err;
    return res.status(status).send({ message });
  }

  res.status(500).send({ message: "Something went wrong", error: err.message });
};

export default errorHandler;