/**
 * Normalize user main data for UI consumption.
 * Supports both `todayScore` and `score`.
 * @param {object} rawUser
 * @returns {{
 *   id: number,
 *   firstName: string,
 *   lastName: string,
 *   age: number,
 *   score: number,
 *   keyData: {
 *     calorieCount: number,
 *     proteinCount: number,
 *     carbohydrateCount: number,
 *     lipidCount: number
 *   }
 * }}
 */
export function adaptUserMainData(rawUser) {
  const user = rawUser ?? {};
  const userInfos = user.userInfos ?? {};
  const keyData = user.keyData ?? {};

  const rawScore = Number(
    user.todayScore ?? user.score ?? 0
  );
  const normalizedScore = Number.isFinite(rawScore)
    ? Math.max(0, Math.min(1, rawScore))
    : 0;

  return {
    id: Number(user.id ?? 0),
    firstName: String(userInfos.firstName ?? ""),
    lastName: String(userInfos.lastName ?? ""),
    age: Number(userInfos.age ?? 0),
    score: normalizedScore,
    keyData: {
      calorieCount: Number(keyData.calorieCount ?? 0),
      proteinCount: Number(keyData.proteinCount ?? 0),
      carbohydrateCount: Number(keyData.carbohydrateCount ?? 0),
      lipidCount: Number(keyData.lipidCount ?? 0),
    },
  };
}
