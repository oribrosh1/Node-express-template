import * as CartSessionRepository from '../repositories/cartSessionRepository.js';
import shopify from '../shopify.js';
import { STATUS_TYPES, generateSessionId, safeJsonStringify, normalizeCartAndUserId } from '../helpers/constants.js';

const saveSession = async (req, res) => {
    const { shop, isOnline } = req.body;

    const { userId, state } = normalizeCartAndUserId(req.body);
    // Generate a unique session ID
    const sessionId = generateSessionId(userId);

    try {
        const session = await CartSessionRepository.saveCartSession(shopify, { shop, isOnline, userId, sessionId, state });
        res.status(STATUS_TYPES.OK).json(safeJsonStringify(session));
    } catch (error) {
        console.error('Failed to save cart session:', error);
        res.status(STATUS_TYPES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to save cart session' });
    }
};

const getSession = async (req, res) => {
    const { logged_in_customer_id: userId } = req.query;

    try {
        const session = await CartSessionRepository.findCartSessionByUserId(shopify, userId);
        const cart = JSON.parse(session.state).map((item) => ({ id: (item.id), quantity: item.quantity }));
        if (session) {
            res.status(STATUS_TYPES.ok).json(safeJsonStringify({
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
