import { execute } from "../db/oracle.js";

/**
 * Fetch a single algorithm by name and category (OLL/PLL).
 */
export async function getAlgorithmByName(name, category) {
  const sql = `
    SELECT MOVE_SEQUENCE
    FROM ALGORITHM
    WHERE NAME = :name AND CATEGORY = :category
  `;
  const result = await execute(sql, { name, category });
  return result.rows?.[0]?.MOVE_SEQUENCE || null;
}

/**
 * Fetch all algorithms in a category (optional helper).
 */
export async function getAlgorithmsByCategory(category) {
  const sql = `
    SELECT NAME, MOVE_SEQUENCE
    FROM ALGORITHM
    WHERE CATEGORY = :category
  `;
  const result = await execute(sql, { category });
  return result.rows || [];
}
