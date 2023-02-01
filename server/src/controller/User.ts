import database from "../database";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Register = async (req: Request, res: Response) => {
  const { email, username, password, first_name, last_name } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  
  database.query(
    sql, 
    [email, username], 
    (err, data) => {
      if(err) return res.status(500).send(err);
      if(data.length) return res.status(409).send({ message: 'User is already exists' });

      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      const values = [
        username,
        email,
        hashPassword,
        first_name,
        last_name
      ];

      const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";

      database.query(
        sql, 
        [values], 
        (error, data) => {
          if (error) return res.status(500).send(error);
          return res.status(200).send({ message: "Registration is successful" });
      });
    }
  );
};

const Login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";

  database.query(
    sql,
    [username, email],
    (error, data) =>{
      if(error) return res.status(500).send(error);
      if(!data.length) return res.status(404).send({ message: "User not found" });

      let userDetails;
      // '!' non-null assertion operator 
      const secret = process.env.JWT_SECRET!;
      [userDetails] = data;

      if(bcrypt.compareSync(password, userDetails.password)){
        const token = jwt.sign(
          { user_id: userDetails.id, admin: userDetails.admin = 0 ? false : true },
          secret,
          { expiresIn: "1d" }
        );

        res.cookie(
          "authorization_key", 
          token,
          { httpOnly: true }
        ).status(200).send({ message: "Login successfully" });

        return; 
      } else {
        return res.status(404).send("Invalid email or password");
      }
    }
  );
};

export {
  Register,
  Login
};