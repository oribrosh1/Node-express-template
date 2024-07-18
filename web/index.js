import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import cors from 'cors';
import serveStatic from 'serve-static';
import dotenv from 'dotenv';
dotenv.config();

import shopify from './shopify.js';
import webhooks from './webhooks.js';

import cartSessionRoutes from './routes/cartRoutes.js';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();

// Added CORS for 'https://home-assignment-76.myshopify.com' and 'https://extensions.shopifycdn.com'
app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(',') ?? ['https://home-assignment-76.myshopify.com', 'https://extensions.shopifycdn.com'] }));

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	shopify.redirectToShopifyOrAppRoot()
);
app.post(
	shopify.config.webhooks.path,
	// @ts-ignore
	shopify.processWebhooks({ webhookHandlers: webhooks })
);


// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(serveStatic(STATIC_PATH, { index: false }));

// Middleware to attach prisma utilities to the request object.
app.use(async (req, _res, next) => {

	// Check if the shopify object is correctly initialized
	if (!shopify || typeof shopify !== 'object') {
		console.error('Shopify instance is not initialized correctly.');
		return next(new Error('Shopify instance is not initialized correctly.'));
	}
	// Initialize if not present
	if (!req.usePrisma) {
		req.usePrisma = {};
	}
	// Attach only the prisma from shopify sessionStorage sessionStorage 
	req.usePrisma = shopify.config.sessionStorage.prisma;
	next();
});

app.use('/cart', cartSessionRoutes);


// Not Working when putting `app.use('/cartsession', cartSessionRoutes);` below this middleware
// 	LOG:
//   Running ensureInstalledOnShop
//   Beginning OAuth | {shop:
// 	 home-assignment-76.myshopify.com, isOnline: false, callbackPath: /api/auth/callback}
app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res) => {
	return res.set('Content-Type', 'text/html').send(readFileSync(join(STATIC_PATH, 'index.html')));
});


app.listen(PORT);
