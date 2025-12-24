import { stripe } from '../packages/next-utils/src/payments/stripe';
import { prisma } from './prisma';
import { hashPassword } from '@repo/next-utils/auth';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const user = await prisma.users.create({
    data: {
      email: email,
      password_hash: passwordHash,
      role: 'owner',
    },
  });

  console.log('Initial user created.');

  const team = await prisma.teams.create({
    data: {
      name: 'Test Team',
    },
  });

  await prisma.team_members.create({
    data: {
      team_id: team.id,
      user_id: user.id,
      role: 'owner',
    },
  });

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
