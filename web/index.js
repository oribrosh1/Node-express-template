import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import cors from 'cors';
import serveStatic from 'serve-static';

import shopify from './shopify.js';
import webhooks from './webhooks.js';

import cartSessionRoutes from './routes/cartSessionRoutes.js';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();

app.use(cors({ origin: '*' }));

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

app.use('/cartsession', cartSessionRoutes);

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res) => {
	return res.set('Content-Type', 'text/html').send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
