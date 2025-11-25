import { getAlgorithmByName } from "./algRepo.js";

/**
 * BEGINNER profile: enforce 2-look OLL and 2-look PLL.
 * In v1 we use placeholders for case names; plug in detection later.
 */

export async function compute2LookOLL(state /* TODO: use state when detector is ready */) {
  // Pick a 2-look OLL case by detection; stubbed as Sune for now.
  const caseName = "2-Look OLL Sune (Corners)";
  const seq = await getAlgorithmByName(caseName, "OLL");
  return { caseName, seq };
}

export async function compute2LookPLL(state /* TODO */) {
  // Pick a 2-look PLL case by detection; stubbed as Ua for now.
  const caseName = "2-Look PLL Ua (Edges)";
  const seq = await getAlgorithmByName(caseName, "PLL");
  return { caseName, seq };
}

/**
 * Replace the solver’s LL with DB-backed 2-look OLL + 2-look PLL sequences.
 * Returns combined LL and structured steps.
 */
export async function replaceLastLayerWithBeginner2Look(state /* TODO */) {
  const oll = await compute2LookOLL(state);
  const pll = await compute2LookPLL(state);

  const llCombined = [oll.seq, pll.seq]
    .filter(Boolean)
    .join(" ");

  const llSteps = [
    { label: oll.caseName, moves: oll.seq || "" },
    { label: pll.caseName, moves: pll.seq || "" },
  ];

  return { llCombined, llSteps };
}
