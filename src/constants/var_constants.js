const VAR_CONSTANTS = {
    PRIVATE: "PRIVATE",
    PUBLIC: "PUBLIC",
    STUDENT: "STUDENT",
    ADMIN: "ADMIN",
    POST: "POST",
    PROBLEM: "PROBLEM",
}

const SOCKET_CONSTANTS = {
    GET_USER: 'GET_USER',
    ADD_USER: 'ADD_USER',
    SEND_MESSAGE: 'SEND_MESSAGE',
    GET_MESSAGE: 'GET_MESSAGE',
    EDIT_MESSAGE: 'EDIT_MESSAGE',
    GET_EDIT_MESSAGE: 'GET_EDIT_MESSAGE',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    GET_DELETE_MESSAGE: 'GET_DELETE_MESSAGE',
    SEND_NOTIFICATION: 'SEND_NOTIFICATION',
    GET_NOTIFICATION: 'GET_NOTIFICATION',
}

const NOTIFICATION_CONSTANTS = {
    NOTIFICATION_NEW_POST: 'NOTIFICATION_NEW_POST',
    NOTIFICATION_NEW_PROBLEM: 'NOTIFICATION_NEW_PROBLEM',
    NOTIFICATION_COMMENT_POST: 'NOTIFICATION_COMMENT_POST',
    NOTIFICATION_COMMENT_PROBLEM: 'NOTIFICATION_COMMENT_PROBLEM',
    NOTIFICATION_YOUR_POST: 'NOTIFICATION_YOUR_POST',
    NOTIFICATION_YOUR_PROBLEM: 'NOTIFICATION_YOUR_PROBLEM',
}

const VAR = { ...VAR_CONSTANTS, ...SOCKET_CONSTANTS, ...NOTIFICATION_CONSTANTS }

module.exports = VAR