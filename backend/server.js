const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastify = require("fastify")({ logger: true });
const formbody = require("@fastify/formbody");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Import Stripe

fastify.register(formbody);

// Dummy user database
const users = [{ id: 1, email: "test@example.com", password: bcrypt.hashSync("password123", 8) }];

// Login Route
fastify.post('/login', async (req, reply) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });
    reply.send({ token });
});

// Root Route
fastify.get('/', async (request, reply) => {
    return { message: "Welcome to Arpico Online API" };
});

// Stripe Payment Route
fastify.post('/checkout', async (req, reply) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return reply.status(400).send({ error: "Amount and currency are required" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        reply.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

// Start Server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log("✅ API running on port 3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
