export const DEV_CREDENTIALS = {
  email: "dev@test.com",
  password: "Dev123!"
};

export interface DevUser {
  id: string;
  email: string;
  password: string;
  name?: string;
}

export const TEST_USERS: DevUser[] = [
  {
    id: "dev",
    email: "dev@test.com",
    password: "Dev123!",
    name: "Dev",
  },
  {
    id: "1",
    email: "alice@example.com",
    password: "password123",
    name: "Alice",
  },
  {
    id: "2",
    email: "bob@example.com",
    password: "password123",
    name: "Bob",
  },
];