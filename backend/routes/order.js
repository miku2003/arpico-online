const db = require('../db');

module.exports = async function (fastify, opts) {

    // 📌 **Add New Order**
    fastify.post('/orders', async (req, reply) => {
        try {
            const { user_id, total_price, status } = req.body;

            if (!user_id || !total_price || !status) {
                return reply.status(400).send({ message: "All fields are required" });
            }

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

            await addOrder();
            return reply.send({ message: "✅ Order placed successfully!" });

        } catch (error) {
            console.error("Error placing order:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });

    // 📌 **Fetch All Orders**
    fastify.get('/orders', async (req, reply) => {
        try {
            const getOrders = () => {
                return new Promise((resolve, reject) => {
                    db.query("SELECT * FROM Orders", (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });
            };

            const orders = await getOrders();
            return reply.send(orders);

        } catch (error) {
            console.error("Error fetching orders:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });

    // 📌 **Fetch Orders for a Specific User** (NEWLY ADDED)
    fastify.get('/orders/:user_id', async (req, reply) => {
        try {
            const { user_id } = req.params;

            const getUserOrders = () => {
                return new Promise((resolve, reject) => {
                    db.query("SELECT * FROM Orders WHERE user_id = ?", [user_id], (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });
            };

            const orders = await getUserOrders();

            if (orders.length === 0) {
                return reply.status(404).send({ message: "No orders found for this user" });
            }

            return reply.send(orders);

        } catch (error) {
            console.error("Error fetching user orders:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });

    // 📌 **Update Order Status**
    fastify.put('/orders/update', async (req, reply) => {
        try {
            const { order_id, status } = req.body;

            if (!order_id || !status) {
                return reply.status(400).send({ message: "Order ID and status are required" });
            }

            const updateOrder = () => {
                return new Promise((resolve, reject) => {
                    db.query(
                        "UPDATE Orders SET status = ? WHERE id = ?",
                        [status, order_id],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };

            await updateOrder();
            return reply.send({ message: `✅ Order status updated to ${status}` });

        } catch (error) {
            console.error("Error updating order:", error);
            return reply.status(500).send({ message: "Database error", error });
        }
    });

};
