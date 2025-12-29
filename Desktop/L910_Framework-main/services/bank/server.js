import { createApplication } from '../../index.js';
import { setupBankRoutes } from './routes.js';

export const createBankServer = () => {
  const app = createApplication();

  app.use((req, res, next) => {
    console.log(`[BANK] ${req.method} ${req.url}`);
    next();
  });

  setupBankRoutes(app);

  return app;
};

if (process.argv[1].includes('bank/server.js')) {
  const server = createBankServer();
  server.listen(3003, () => {
    console.log('🏦 Сервер Банка запущен на порту 3003');
  });
}
