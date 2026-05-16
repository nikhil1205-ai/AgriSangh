import api from "./api";

export const fetchGroups = async () => (await api.get("/groups")).data.data;
export const discoverGroups = async (params) => (await api.get("/groups", { params })).data.data;
export const getGroupRoom = async (groupId) => (await api.get(`/groups/${groupId}`)).data.data;
export const createGroup = async (payload) => (await api.post("/groups", payload)).data.data;
export const joinGroup = async (payload) => (await api.post("/groups/join", payload)).data.data;
export const updateGroup = async (groupId, payload) =>
  (await api.patch(`/groups/${groupId}`, payload)).data.data;
export const removeMember = async (groupId, memberUid) =>
  (await api.delete(`/groups/${groupId}/members/${memberUid}`)).data.data;

export const updateCropPlan = async (groupId, payload) =>
  (await api.patch(`/groups/${groupId}/crop-plan`, payload)).data.data;
export const updateIrrigation = async (groupId, payload) =>
  (await api.patch(`/groups/${groupId}/irrigation`, payload)).data.data;
export const updateTechnology = async (groupId, payload) =>
  (await api.patch(`/groups/${groupId}/technology`, payload)).data.data;

export const getJoinRequests = async (groupId) =>
  (await api.get(`/groups/${groupId}/requests`)).data.data;
export const decideJoinRequest = async (groupId, payload) =>
  (await api.patch(`/groups/${groupId}/requests/decision`, payload)).data.data;

export const addContribution = async (payload) =>
  (await api.post("/contributions/create", payload)).data.data;
export const updateContribution = async (contributionId, payload) =>
  (await api.put(`/contributions/${contributionId}`, payload)).data.data;
export const getContributions = async (groupId) =>
  (await api.get(`/contributions/group/${groupId}`)).data.data;
export const getContributionById = async (contributionId) =>
  (await api.get(`/contributions/id/${contributionId}`)).data.data;
export const deleteContribution = async (contributionId) =>
  (await api.delete(`/contributions/${contributionId}`)).data.data;

export const createBatch = async (payload) => (await api.post("/batches", payload)).data.data;
export const getBatches = async (groupId) => (await api.get(`/batches/group/${groupId}`)).data.data;
export const verifyBatch = async (batchId) => (await api.get(`/batches/verify/${batchId}`)).data.data;
export const getBatchDetails = async (batchId) => (await api.get(`/batches/${batchId}`)).data.data;

export const getLeaderDashboard = async (groupId) =>
  (await api.get(`/dashboard/leader/${groupId}`)).data.data;
export const getFarmerDashboard = async () => (await api.get("/dashboard")).data.data;
export const leaveGroup = async (groupId) =>
  (await api.patch(`/groups/${groupId}/leave`)).data.data;
export const archiveGroup = async (groupId) =>
  (await api.patch(`/groups/${groupId}/archive`)).data.data;

export const getRevenues = async (groupId) =>
  (await api.get(`/revenue/group/${groupId}`)).data.data;
export const createRevenue = async (payload) =>
  (await api.post("/revenue/create", payload)).data.data;
export const calculateRevenue = async (payload) =>
  (await api.post("/revenue/calculate", payload)).data.data;
export const getRevenueStats = async (groupId) =>
  (await api.get(`/revenue/stats/${groupId}`)).data.data;
export const getRevenueById = async (revenueId) =>
  (await api.get(`/revenue/id/${revenueId}`)).data.data;
