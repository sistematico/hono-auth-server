import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";

interface User {
  email: string
  password: string
}

const prisma = new PrismaClient();
const app = new Hono();

app.use(cors());

// const count = await prisma.user.count();
// console.log(`There are ${count} users in the database.`);

async function createUser(data: User) {
  await prisma.user.create({ data });
}

app.post("/register", async (c) => {
  const data = await c.req.json();
  const auth = createUser({ email: data.email, password: data.password });
  if (!auth) return c.json({ status: 'error', message: 'Erro na criação do usuário.' })
  const count = await prisma.user.count() + 1;
  return c.json({ status: 'success', message: `Usuário criado com sucesso, existem ${count} usuários no nosso banco de dados.` })
});

app.get("/", (c) => c.json({ message: "Hello Hono!" }));

export default app;
