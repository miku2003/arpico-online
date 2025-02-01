const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastify = require("fastify")({ logger: true });
const formbody = require("@fastify/formbody");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe
const db = require("./db"); // MySQL Connection
const mongoose = require("mongoose"); // MongoDB
const Review = require("./models/Review"); // Review Model

fastify.register(formbody);

// 📌 **Connect to MongoDB**
mongoose.connect("mongodb://localhost:27017/arpico_online")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Failed:", err));

// 📌 **Login Route (MySQL)**
fastify.post('/login', async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Convert MySQL query into a Promise to avoid callback issues
        const getUser = () => {
            return new Promise((resolve, reject) => {
                db.query("SELECT * FROM Users WHERE email = ?", [email], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        const results = await getUser();

        if (results.length === 0) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        const isValidPassword = bcrypt.compareSync(password, results[0].password);
        if (!isValidPassword) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });

        return reply.send({ token }); // ✅ Only one reply.send() call
    } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send({ message: "Internal Server Error", error });
    }
});


// 📌 **Root Route**
fastify.get('/', async (request, reply) => {
    return { message: "Welcome to Arpico Online API" };
});

// 📌 **Stripe Payment Route**
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

        return reply.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
});


// 📌 Get All Users (MySQL)
fastify.get('/users', async (req, reply) => {
    try {
        const getUsers = () => {
            return new Promise((resolve, reject) => {
                db.query("SELECT id, name, email FROM Users", (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        const users = await getUsers(); // Fetch users from MySQL
        return reply.send(users); // ✅ Only one response is sent
    } catch (error) {
        console.error("Error fetching users:", error);
        return reply.status(500).send({ message: "Database error", error });
    }
});


// 📌 **Submit a Review (MongoDB)**
fastify.post('/reviews', async (req, reply) => {
    try {
        const { user_id, product_id, rating, comment } = req.body;
        if (!user_id || !product_id || !rating || !comment) {
            return reply.status(400).send({ message: "All fields are required" });
        }

        const review = new Review({ user_id, product_id, rating, comment });
        await review.save();

        return reply.send({ message: "✅ Review added successfully!" });
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
});

// 📌 **Get All Reviews (MongoDB)**
fastify.get('/reviews', async (req, reply) => {
    try {
        const reviews = await Review.find();
        return reply.send(reviews);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
});

// 📌 **Register Routes**
try {
    fastify.register(require('./routes/product')); // Ensure this file exists
    fastify.register(require('./routes/order'));   // Ensure this file exists
} catch (err) {
    console.error("❌ Error loading routes:", err.message);
}

// 📌 **Start Server**
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
