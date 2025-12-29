import { loadData, saveData, generateId } from './data.js';

let clients = loadData('clients.json');
let accounts = loadData('accounts.json');

export const setupBankRoutes = (app) => {
  // ===== CLIENTS =====
  app.get('/bank/clients', (req, res) => res.json(clients));

  app.get('/bank/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === req.params.id);
    client ? res.json(client) : res.status(404).json({ error: 'Клиент не найден' });
  });

  app.post('/bank/clients', (req, res) => {
    const newClient = {
      id: generateId(),
      ...req.body,
      isActive: true,
      registrationDate: new Date().toISOString()
    };
    if (!newClient.name || !newClient.age) {
      return res.status(400).json({ error: 'Имя и возраст обязательны' });
    }
    clients.push(newClient);
    saveData('clients.json', clients) ? res.status(201).json(newClient) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.put('/bank/clients/:id', (req, res) => {
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Клиент не найден' });
    clients[index] = { ...clients[index], ...req.body };
    saveData('clients.json', clients) ? res.json(clients[index]) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.patch('/bank/clients/:id', (req, res) => {
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Клиент не найден' });
    clients[index] = { ...clients[index], ...req.body };
    saveData('clients.json', clients) ? res.json(clients[index]) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.delete('/bank/clients/:id', (req, res) => {
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Клиент не найден' });
    const deleted = clients.splice(index, 1)[0];
    saveData('clients.json', clients) ? res.json({ message: 'Клиент удален', client: deleted }) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  // ===== ACCOUNTS =====
  app.get('/bank/accounts', (req, res) => res.json(accounts));

  app.get('/bank/accounts/:id', (req, res) => {
    const account = accounts.find(a => a.id === req.params.id);
    account ? res.json(account) : res.status(404).json({ error: 'Счет не найден' });
  });

  app.post('/bank/accounts', (req, res) => {
    const newAccount = {
      id: generateId(),
      ...req.body,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      transactions: []
    };
    if (!newAccount.clientId || !newAccount.currency) {
      return res.status(400).json({ error: 'ID клиента и валюта обязательны' });
    }
    accounts.push(newAccount);
    saveData('accounts.json', accounts) ? res.status(201).json(newAccount) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.put('/bank/accounts/:id', (req, res) => {
    const index = accounts.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Счет не найден' });
    accounts[index] = { ...accounts[index], ...req.body };
    saveData('accounts.json', accounts) ? res.json(accounts[index]) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.patch('/bank/accounts/:id', (req, res) => {
    const index = accounts.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Счет не найден' });
    accounts[index] = { ...accounts[index], ...req.body };
    saveData('accounts.json', accounts) ? res.json(accounts[index]) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  app.delete('/bank/accounts/:id', (req, res) => {
    const index = accounts.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Счет не найден' });
    const deleted = accounts.splice(index, 1)[0];
    saveData('accounts.json', accounts) ? res.json({ message: 'Счет удален', account: deleted }) : res.status(500).json({ error: 'Ошибка сохранения' });
  });

  // Дополнительно: все счета клиента
  app.get('/bank/clients/:id/accounts', (req, res) => {
    const clientAccounts = accounts.filter(a => a.clientId === req.params.id);
    res.json(clientAccounts);
  });
};
