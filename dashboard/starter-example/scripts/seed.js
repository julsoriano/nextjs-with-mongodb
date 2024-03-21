const { MongoClient } = require('mongodb');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

// Using MongoDB
async function seedUsers(client) {
  try {
    const createTable = await client
      .db('trackmedv2')
      .collection('users')
      .countDocuments();

    if (createTable) {
      console.log('users collection already exists with data');
      client.close();
      return;
    }
    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword
        };
     }),
    );

    const insert = await client
      .db('trackmedv2')
      .collection('users')
      .insertMany(insertedUsers);    

    if (insert.acknowledged) {
      console.log(`Seeded ${insertedUsers.length} users`);
    }    
    
    return {
      createTable,
      users: insertedUsers,
    };

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } 
}

async function seedInvoices(client) {
  // Create the "invoices" table if it doesn't exist
  try {
    const createTable = await client
      .db('trackmedv2')
      .collection('invoices')
      .countDocuments();

    if (createTable) {
      console.log('invoices collection already exists with data');
      client.close();
      return;
    }
    console.log(`Created "invoices" table`);

    // Insert data into the "collections" table
    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        return {
          customer_id: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: invoice.date
        };
     }),
    );

    const insert = await client
      .db('trackmedv2')
      .collection('invoices')
      .insertMany(insertedInvoices);    

    if (insert.acknowledged) {
      console.log(`Seeded ${insertedInvoices.length} invoices`);
    }        

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  // Create the "customers" table if it doesn't exist
  try {
    const createTable = await client
      .db('trackmedv2')
      .collection('customers')
      .countDocuments();

    if (createTable) {
      console.log('customers collection already exists with data');
      client.close();
      return;
    }
    console.log(`Created "customers" table`);

    // Insert data into the "collections" table
    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => {
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url
        };
     }),
    );

    const insert = await client
      .db('trackmedv2')
      .collection('customers')
      .insertMany(insertedCustomers);    

    if (insert.acknowledged) {
      console.log(`Seeded ${insertedCustomers.length} customers`);
    }        

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client
      .db('trackmedv2')
      .collection('revenue')
      .countDocuments();

    if (createTable) {
      console.log('revenue collection already exists with data');
      client.close();
      return;
    }
    console.log(`Created "revenue" table`);

    // Insert data into the "collections" table
    const insertedRevenue = await Promise.all(
      revenue.map(async (revenue) => {
        return {
          month: revenue.month,
          amount: revenue.revenue,
        };
     }),
    );

    const insert = await client
      .db('trackmedv2')
      .collection('revenue')
      .insertMany(insertedRevenue);    

    if (insert.acknowledged) {
      console.log(`Seeded ${insertedRevenue.length} revenue`);
    }        

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  // const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);

  await client.close();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
