import * as CartSessionRepository from '../repositories/cartSessionRepository.js';
import { STATUS_TYPES, safeJsonStringify, normalizeCartAndUserId } from '../helpers/constants.js';

const saveSession = async (req, res) => {
    const { shop, isOnline } = req.body;

    const { userId, state } = normalizeCartAndUserId(req.body);

    const sessionId = req.sessionID ?? req.session.id;

    try {
        const session = await CartSessionRepository.saveCartSession(req.usePrisma, { shop, isOnline, userId, sessionId, state });
        res.status(STATUS_TYPES.OK).json(safeJsonStringify(session));
    } catch (error) {
        console.error('Failed to save cart session:', error);
        res.status(STATUS_TYPES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to save cart session' });
    }
};

const getSession = async (req, res) => {
    const { logged_in_customer_id: userId } = req.query;

    try {
        const session = await CartSessionRepository.findCartSessionByUserId(req.usePrisma, userId);
        const state = JSON.parse(session.state);
        const cart = state.map((item) => ({ id: item.id, quantity: item.quantity }));
        if (session) {
            // Send back the Cart Items from the cart session that stored in the MySQL database
            // To the import-saved-cart.liquid So in the liquid file and automatically add all the products to the cart using the Cart Ajax API
            res.status(STATUS_TYPES.OK).json(safeJsonStringify({
                items: cart
            }));
        } else {
            res.status(STATUS_TYPES.NOT_FOUND).json({ error: 'Cart Session not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve cart session:', error);
        res.status(STATUS_TYPES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve cart session' });
    }
};

export { saveSession, getSession };
