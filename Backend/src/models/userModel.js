const store = require("./inMemoryStore");

const findUserByUid = (uid) => store.users.find((user) => user.uid === uid);

const upsertUser = (payload) => {
  const index = store.users.findIndex((user) => user.uid === payload.uid);
  if (index >= 0) {
    store.users[index] = { ...store.users[index], ...payload };
    return store.users[index];
  }
  const user = {
    groupHistory: [],
    contributionHistory: [],
    ...payload,
  };
  store.users.push(user);
  return user;
};

const addGroupHistory = (uid, historyEntry) => {
  const user = findUserByUid(uid);
  if (!user) return null;
  user.groupHistory = user.groupHistory || [];
  user.groupHistory.push(historyEntry);
  return user;
};

const addContributionHistory = (uid, entry) => {
  const user = findUserByUid(uid);
  if (!user) return null;
  user.contributionHistory = user.contributionHistory || [];
  user.contributionHistory.push(entry);
  return user;
};

module.exports = {
  findUserByUid,
  upsertUser,
  addGroupHistory,
  addContributionHistory,
};
