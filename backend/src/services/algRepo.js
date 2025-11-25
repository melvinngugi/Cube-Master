import { execute } from "../db/oracle.js";

async function clobToString(clob) {
  if (clob === null) return null;
  if (typeof clob === "string") return clob;
  if (typeof clob.getData === "function") {
    return await clob.getData();
  }
  // fallback: stream manually
  return new Promise((resolve, reject) => {
    let str = "";
    clob.setEncoding("utf8");
    clob.on("data", (chunk) => (str += chunk));
    clob.on("end", () => resolve(str));
    clob.on("error", reject);
  });
}

export async function getAlgorithmByName(name, category) {
  const sql = `
    SELECT MOVE_SEQUENCE
    FROM ALGORITHM
    WHERE NAME = :name AND CATEGORY = :category
  `;
  const result = await execute(sql, { name, category });
  if (!result.rows || result.rows.length === 0) return null;

  const row = result.rows[0];
  return await clobToString(row.MOVE_SEQUENCE);
}

export async function getAlgorithmsByCategory(category) {
  const sql = `
    SELECT NAME, MOVE_SEQUENCE
    FROM ALGORITHM
    WHERE CATEGORY = :category
  `;
  const result = await execute(sql, { category });
  if (!result.rows) return [];

  const converted = [];
  for (const row of result.rows) {
    converted.push({
      name: row.NAME,
      moves: await clobToString(row.MOVE_SEQUENCE),
    });
  }
  return converted;
}
