import oracledb from "oracledb";
import { getConnection } from "../db/oracle.js";

export const createUser = async (username, email, password) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `INSERT INTO users (username, email, password)
       VALUES (:username, :email, :password)
       RETURNING id INTO :id`,
      { username, email, password, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );
    return result.outBinds.id[0];
  } finally {
    await conn.close();
  }
};

export const findUserByEmail = async (email) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `SELECT id, username, email, password FROM users WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows.length ? result.rows[0] : null;
  } finally {
    await conn.close();
  }
};
