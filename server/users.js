const users = [];

const addUser = ({ id, name, room }) => {
  // First, change all capital letters and spaces

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check if existing user
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser) {
    return { error: "Username is taken, sorry" };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
