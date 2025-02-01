const db = require('../db');

module.exports = async function (fastify, opts) {
    fastify.post('/orders', async (req, reply) => {
        try {
            const { user_id, total_price, status } = req.body;

            if (!user_id || !total_price || !status) {
                return reply.status(400).send({ message: "All fields are required" });
            }

            // Convert MySQL query into a Promise to avoid callback issues
            const addOrder = () => {
                return new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO Orders (user_id, total_price, status) VALUES (?, ?, ?)",
                        [user_id, total_price, status],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };

            await addOrder(); // Wait for order to be placed
            return reply.send({ message: "✅ Order placed successfully!" }); // ✅ Only one response

        } catch (error) {
            console.error("Error placing order:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });
};
