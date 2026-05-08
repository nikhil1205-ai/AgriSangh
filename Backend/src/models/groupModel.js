const store = require("./inMemoryStore");

const listGroups = () => store.groups;
const findGroupById = (id) => store.groups.find((group) => group.id === id);
const saveGroup = (group) => {
  store.groups.push(group);
  return group;
};

module.exports = {
  listGroups,
  findGroupById,
  saveGroup,
};
