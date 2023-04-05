'use strict'

const ErrorName = {
    BAD_REQUEST: 'BAD_REQUEST',
    REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
    DUPLICATE: 'DUPLICATE',
    UNAVAILABLE: 'UNAVAILABLE',
    UNAUTHORIZE: 'UNAUTHORIZE',
    ACCESS_DENIED: 'ACCESS_DENIED',
    INVALID_PARAMETER: 'INVALID_PARAMETER',
    CERTIFICATE_ERROR: 'CERTIFICATE_ERROR',
    DISTRIBUTION_ERROR: 'DISTRIBUTION_ERROR',
    IAMPORT_ERROR: 'IAMPORT_ERROR',
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
    AWS_SSM_ERROR: 'AWS_SSM_ERROR',
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    KCP_ERROR: 'KCP_ERROR',
    LIMIT_EXCEED: 'LIMIT_EXCEED',
    ZOOM_ERROR: 'ZOOM_ERROR',
    DUPLICATED_LOGIN: 'DUPLICATED_LOGIN'
}

const BoardError = class BoardError extends Error {
    constructor(name, status, message, cause) {
        super(message)
        Error.captureStackTrace( this, this.constructor )
        this.code = 'BoardError'
        this.name = name
        this.status = status? status:400
        this.cause = cause
    }
}

const errorHandler = error => {
    let e = {}
    console.log(error)
    e.code = error.code
    e.name = error.name
    e.message = error.message
    e.cause = error.cause
    e.status = error.status? error.status:500
    // e.stack = error.stack
    return [e]
}

module.exports = {
    ErrorName,
    BoardError,
    errorHandler
}
