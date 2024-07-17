const STATUS_TYPES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    GONE: 410,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

function safeJsonStringify(data) {
    return JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}

function normalizeCartAndUserId(body) {
    // The state of the cart should be stored as a string
    let state = body.state;
    if (typeof state === 'object') {
        state = JSON.stringify(state);
    }
    // Store only the ID Number of the guid of the product
    state = state.replace(/gid:\/\/shopify\/Product\//g, '').replace(/gid:\/\/shopify\/ProductVariant\//g, '');

    let userId = body.userId;
    // Store only the ID Number of the guid of the customer
    userId = userId.replace(/gid:\/\/shopify\/Customer\//g, '');
    return { userId, state };
}

export { STATUS_TYPES, safeJsonStringify, normalizeCartAndUserId };