function Socket(user){
    this.socket = io.connect();
    this.socket.emit('user_connect', {id: user._id});
}

Socket.prototype.on = function (event_name, callback) {
    this.socket.on(event_name, callback);
};

Socket.prototype.emit = function (event_name, data) {
    this.socket.emit(event_name, data);
};