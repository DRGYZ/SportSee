import fixtures from "./demoData.json";

export const mockService = {
  getUserMainData: (userId) => getMockData(fixtures.users, userId, "id"),
  getUserActivity: (userId) => getMockData(fixtures.activity, userId),
  getUserAverageSessions: (userId) => getMockData(fixtures.averageSessions, userId),
  getUserPerformance: (userId) => getMockData(fixtures.performance, userId),
};

async function getMockData(records, userId, idKey = "userId") {
  const data = records.find((item) => item[idKey] === Number(userId));
  if (!data) {
    const error = new Error("Profil introuvable.");
    error.status = 404;
    throw error;
  }

  return { data };
}
