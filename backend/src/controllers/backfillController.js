import { execute } from "../db/oracle.js";
import {
  generateBeginner2LookCFOP,
  generateXCrossCFOP,
  generateXXCrossCFOP,
  generateXXXCrossCFOP,
} from "../services/cfopGenerator.js";

export async function backfillSolves(req, res) {
  try {
    const result = await execute(
      `SELECT sr.solve_id, s.scramble_text
       FROM SolveRecord sr
       JOIN Scramble s ON sr.scramble_id = s.scramble_id
       WHERE sr.BEGINNER_GENERATED_CROSS IS NULL
          OR sr.XCROSS_GENERATED_CROSS IS NULL
          OR sr.XXCROSS_GENERATED_CROSS IS NULL
          OR sr.XXXCROSS_GENERATED_CROSS IS NULL`
    );

    const rows = result.rows;
    console.log(`Found ${rows.length} solves to backfill`);

    for (const row of rows) {
      const solveId = row.SOLVE_ID;
      const scrambleText = row.SCRAMBLE_TEXT;

      console.log(`Backfilling solve_id=${solveId} scramble=${scrambleText}`);

      const beginner = await generateBeginner2LookCFOP(scrambleText);
      const xcross = await generateXCrossCFOP(scrambleText);
      const xxcross = await generateXXCrossCFOP(scrambleText);
      const xxxcross = await generateXXXCrossCFOP(scrambleText);

      await execute(
        `UPDATE SolveRecord
         SET BEGINNER_GENERATED_CROSS = :beginner,
             XCROSS_GENERATED_CROSS   = :xcross,
             XXCROSS_GENERATED_CROSS  = :xxcross,
             XXXCROSS_GENERATED_CROSS = :xxxcross
         WHERE solve_id = :solveId`,
        {
          beginner: beginner.moves,
          xcross: xcross.moves,
          xxcross: xxcross.moves,
          xxxcross: xxxcross.moves,
          solveId,
        },
        { autoCommit: true }
      );
    }

    res.json({ message: "Backfill complete", updated: rows.length });
  } catch (err) {
    console.error("Backfill error:", err);
    res.status(500).json({ error: "Backfill failed", details: err.message });
  }
}
