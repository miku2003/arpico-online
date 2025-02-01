const db = require('../db');

module.exports = async function (fastify, opts) {
    fastify.post('/products', async (req, reply) => {
        try {
            const { name, category, price, stock } = req.body;

            if (!name || !category || !price || !stock) {
                return reply.status(400).send({ message: "All fields are required" });
            }

            // Convert MySQL query into a Promise to avoid callback issues
            const addProduct = () => {
                return new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO Products (name, category, price, stock) VALUES (?, ?, ?, ?)",
                        [name, category, price, stock],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };

            await addProduct(); // Wait for product to be added
            return reply.send({ message: "✅ Product added successfully!" }); // ✅ Only one response

        } catch (error) {
            console.error("Error adding product:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });
};
