const saveCartSession = async (prisma, { shop, isOnline, userId, sessionId, state }) => {
    const result = await prisma.session.upsert({
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

const findCartSessionByUserId = async (prisma, userId) => {
    const result = await prisma.session.findUnique({
        where: { userId },
    });
    return result;
};

export { saveCartSession, findCartSessionByUserId };