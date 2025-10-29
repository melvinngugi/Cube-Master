import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

try {
  oracledb.initOracleClient({ libDir: process.env.WALLET_PATH });
} catch (err) {
  console.error('Error initializing Oracle client:', err);
}

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectionString: process.env.ORACLE_CONNECTION_STRING,
};

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Connected to Oracle DB');
    return connection;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err;
  }
}
