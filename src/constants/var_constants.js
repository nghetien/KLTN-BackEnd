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
}

const VAR = { ...VAR_CONSTANTS, ...SOCKET_CONSTANTS }

module.exports = VAR