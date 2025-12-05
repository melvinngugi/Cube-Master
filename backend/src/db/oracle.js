import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

//Initialize Oracle client with wallet
try {
  oracledb.initOracleClient({ configDir: process.env.WALLET_PATH });
  console.log("Oracle client initialized");
} catch (err) {
  console.error("Error initializing Oracle client:", err);
}

//DB config from environment variables
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectionString: process.env.ORACLE_CONNECTION_STRING,
};

//Get a raw connection
export async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to Oracle DB");
    return connection;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

//Execute a single SQL statement with bind parameters
export async function execute(sql, binds = {}, options = {}) {
  let connection;
  options.outFormat = options.outFormat || oracledb.OUT_FORMAT_OBJECT;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(sql, binds, options);

    if (options.autoCommit || sql.trim().toUpperCase().startsWith("INSERT") || sql.trim().toUpperCase().startsWith("UPDATE") || sql.trim().toUpperCase().startsWith("DELETE")) {
      await connection.commit();
    }

    return result;
  } catch (err) {
    console.error("SQL execution error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
