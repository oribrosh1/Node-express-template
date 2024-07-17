const saveCartSession = async (shopify, { shop, isOnline, userId, sessionId, state }) => {
    const result = await shopify.config.sessionStorage.prisma.session.upsert({
        where: {
            // Condition to check existing session
            userId: userId,
        },
        update: {
            shop: shop,
            isOnline: isOnline,
            userId: userId,
            state: state,
        },
        create: {
            shop: shop,
            isOnline: isOnline,
            userId: userId,
            id: sessionId,
            state: state,
        },
    });
    console.log(result);
    return result;
};

const findCartSessionByUserId = async (shopify, userId) => {
    const result = await shopify.config.sessionStorage.prisma.session.findUnique({
        where: { userId },
    });
    return result;
};

export { saveCartSession, findCartSessionByUserId };