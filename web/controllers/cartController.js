import * as CartRepository from '../repositories/cartRepository.js';
import { STATUS_TYPES, safeJsonStringify, normalizeCartAndUserId } from '../helpers/constants.js';

const saveCart = async (req, res) => {
    const { customerId, items } = normalizeCartAndUserId(req.body);
    try {
        const cart = await CartRepository.saveCart(req.usePrisma, { customerId, items });
        res.status(STATUS_TYPES.OK).json(safeJsonStringify(cart));
    } catch (error) {
        console.error('Failed to save cart:', error);
        res.status(STATUS_TYPES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to save cart' });
    }
};

const getCart = async (req, res) => {
    const { logged_in_customer_id } = req.query;
    const customerId = BigInt(logged_in_customer_id);

    try {
        const cart = await CartRepository.findCartByCustomerId(req.usePrisma, customerId);
        if (cart) {
            // Send back the Cart Items from the cart items that stored in the MySQL database
            // To the import-saved-cart.liquid So in the liquid file and automatically add all the products to the cart using the Cart Ajax API
            res.status(STATUS_TYPES.OK).json(safeJsonStringify({
                items: cart.items
            }));
        } else {
            res.status(STATUS_TYPES.NOT_FOUND).json({ error: 'Cart not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve cart:', error);
        res.status(STATUS_TYPES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve cart' });
    }
};

export { saveCart, getCart };
