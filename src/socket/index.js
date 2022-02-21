const { 
    GET_USER,
    ADD_USER, 
    SEND_MESSAGE,
    GET_MESSAGE,
    EDIT_MESSAGE,
    GET_EDIT_MESSAGE,
    DELETE_MESSAGE,
    GET_DELETE_MESSAGE,
} = require("../constants/var_constants");

let users = [];

const addUser = (email, socketId) => {
    !users.some((user) => user.email === email) &&
        users.push({ email, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (email) => {
    return users.find((user) => user.email === email);
};

const handleSocket = (io) => {
    io.on("connection", (socket) => {
        /// user connected
        console.log("user connected!");

        socket.on(ADD_USER, (email) => {
            addUser(email, socket.id);
        });

        socket.on(SEND_MESSAGE, ({ emailSender, emailReceiver, text, type, createdAt, messageId }) => {
            const user = getUser(emailReceiver);
            if(user && user.socketId && user.email){
                io.to(user.socketId).emit(GET_MESSAGE, {
                    emailSender,
                    text,
                    type,
                    createdAt,
                    messageId
                });
            }
        });

        socket.on(EDIT_MESSAGE, ({ emailSender, emailReceiver, messageId, text, updatedAt }) => {
            const user = getUser(emailReceiver);
            if(user && user.socketId && user.email){
                io.to(user.socketId).emit(GET_EDIT_MESSAGE, {
                    emailSender,
                    messageId,
                    text,
                    updatedAt,
                });
            }
        })

        socket.on(DELETE_MESSAGE, ({ emailSender, emailReceiver, messageId, updatedAt }) => {
            const user = getUser(emailReceiver);
            if(user && user.socketId && user.email){
                io.to(user.socketId).emit(GET_DELETE_MESSAGE, {
                    emailSender,
                    messageId,
                    updatedAt,
                });
            }
        })


        /// user disconnected
        socket.on("disconnect", () => {
            console.log("user disconnect");
            removeUser(socket.id);
            io.emit(GET_USER, users);
        });
    });
}

module.exports = handleSocket