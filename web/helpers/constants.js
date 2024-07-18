const STATUS_TYPES = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

function safeJsonStringify(data) {
    return JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}

function normalizeCartAndUserId(body) {

    // Store only the Id Number of the guid of the product
    const items = body.itemsToSave.map((item) => ({
        id: item.id.replace(/gid:\/\/shopify\/(Product|ProductVariant)\//g, ''),
        quantity: item.quantity
    }));
    console.log(items);

    let customerId = body.customerId;
    // Store only the Id Number of the guid of the customer
    customerId = Number(customerId.replace(/gid:\/\/shopify\/Customer\//g, ''));
    return { customerId, items };
}

export { STATUS_TYPES, safeJsonStringify, normalizeCartAndUserId };