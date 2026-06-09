import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt'

const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    ssl: true,
    connectTimeout: 30000,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com'},
        update: { role: 'ADMIN' },
        create: {
            fullname: 'Admin user',
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin user seeded:', admin)
}

main() 
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})