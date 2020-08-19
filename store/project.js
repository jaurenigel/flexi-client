export const state = () => ({
  backlogId: "",
  projectId: "",
  projectRaw: [],
  Users: [],
  assignees: [],
  allUsers: [],
  backlogsRaw: [],
  backlogsRawProgress: [],
  backlogsRawCompleted: [],
  backlogsRawTesting: []
});

export const mutations = {
  addBacklogId(state, newValue) {
    state.backlogId = newValue;
  },
  addProjectId(state, newValue) {
    state.projectId = newValue;
  },
  setProject(state, newValue) {
    state.projectRaw = newValue;
  },
  setBacklogs(state, newValue) {
    state.backlogsRaw = newValue;
  },
  setBacklogsProgress(state, newValue) {
    state.backlogsRawProgress = newValue;
  },
  setBacklogsTesting(state, newValue) {
    state.backlogsRawTesting = newValue;
  },
  setBacklogsCompleted(state, newValue) {
    state.backlogsRawCompleted = newValue;
  },
  setAssignees(state, newValue) {
    state.assignees = newValue;
  },
  setUsers(state, newValue) {
    state.Users = newValue;
  },
  setAllUsers(state, newValue) {
    state.Users = newValue;
  },
  setAllUsersAdd(state, newValue) {
    state.Users.push(newValue);
  },
  pushAssignees(state, newValue) {
    state.assignees.push(newValue);
  }
};
