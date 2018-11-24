class User {
  constructor() {
    this.globalArray = [];
  }

  enterRoom(id, name, room) {
    const user = { id, name, room };
    this.globalArray.push(user);
    return user;
  }

  getUserId(id) {
      return this.globalArray.filter(userId => userId.id === id)[0];
  }

  removeUser(id) {
      const user = this.getUserId(id);
      if (user) {
          this.globalArray = this.globalArray.filter(userId => userId.id !== id);
      }
      return user;
  }

  getList(room) {
      const roomName = this.globalArray.filter(user => user.room === room);
      return roomName.map(user => user.name);
  }
}

module.exports = { User };