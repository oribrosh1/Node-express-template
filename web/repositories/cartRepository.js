const saveCart = async (prisma, { customerId, items }) => {
    const cart = await prisma.cart.upsert({
        where: { customerId: customerId },
        update: { items: items },
        create: { customerId: customerId, items: items },
    });
    return cart;
};


const findCartByCustomerId = async (prisma, customerId) => {
    const cart = await prisma.cart.findUnique({
        where: { customerId },
    });
    return cart;
};

export { findCartByCustomerId, saveCart };