const db = require('../db');

module.exports = function (fastify, options, done) {
    // ✅ Add Item to Cart (Fixed)
    fastify.post('/cart/add', async (req, reply) => {
        try {
            const { user_id, product_id, quantity } = req.body;

            const addToCart = () => {
                return new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                        [user_id, product_id, quantity],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };

            await addToCart(); // ✅ Wait for query execution
            return reply.send({ message: '✅ Item added to cart!' }); // ✅ Ensure only one response

        } catch (error) {
            console.error("Error adding item to cart:", error);
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    // ✅ Fetch Cart Items
    fastify.get('/cart/:user_id', async (req, reply) => {
        try {
            const { user_id } = req.params;

            const fetchCart = () => {
                return new Promise((resolve, reject) => {
                    db.query("SELECT * FROM Cart WHERE user_id = ?", [user_id], (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });
            };

            const cartItems = await fetchCart();
            return reply.send(cartItems);
        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    // ✅ Remove Item from Cart
    fastify.delete('/cart/remove/:cart_id', async (req, reply) => {
        try {
            const { cart_id } = req.params;

            const removeFromCart = () => {
                return new Promise((resolve, reject) => {
                    db.query("DELETE FROM Cart WHERE id = ?", [cart_id], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            };

            await removeFromCart();
            return reply.send({ message: "✅ Item removed from cart!" });

        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    done();
};
