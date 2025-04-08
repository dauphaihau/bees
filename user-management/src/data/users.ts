import { TUser } from '../types/user';

// Generate 100 users with random data
const generateUsers = (): TUser[] => {
  const users: TUser[] = [];
  const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily', 'William', 'Olivia'];
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

  for (let i = 0; i < 100; i++) {
    const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    const email = `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    
    users.push({
      id: `user-${i + 1}`,
      name,
      balance: Math.floor(Math.random() * 10000),
      email,
      registerAt: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      active: Math.random() > 0.3
    });
  }

  return users;
};

export const users = generateUsers();