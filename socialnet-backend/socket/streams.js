module.exports = function(io, User, _) {
  const userData = new User();
  io.on("connection", socket => {
    socket.on("refresh", data => {
      io.emit("refreshPage", {});
    });

    socket.on("online", data => {
      socket.join(data.room);
      userData.enterRoom(socket.id, data.user, data.room);
      const list = userData.getList(data.room);
      io.emit("usersOnline", _.uniq(list));
    });

    socket.on("disconnect", () => {
      const user = userData.removeUser(socket.id);
      if (user) {
        const userArray = userData.getList(user.room);
        const arr = _.uniq(userArray);
       _.remove(arr, n => n ===user.name);
          io.emit("usersOnline", arr);
      }
    });
  });
};
