const db = require('../db');

module.exports = function (fastify, options, done) {
    // ✅ Add Item to Wishlist
    fastify.post('/wishlist/add', async (req, reply) => {
        try {
            const { user_id, product_id } = req.body;

            const addToWishlist = () => {
                return new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO Wishlist (user_id, product_id) VALUES (?, ?)",
                        [user_id, product_id],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };

            await addToWishlist();
            return reply.send({ message: "✅ Item added to wishlist!" });

        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    // ✅ Fetch Wishlist Items
    fastify.get('/wishlist/:user_id', async (req, reply) => {
        try {
            const { user_id } = req.params;

            const fetchWishlist = () => {
                return new Promise((resolve, reject) => {
                    db.query("SELECT * FROM Wishlist WHERE user_id = ?", [user_id], (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });
            };

            const wishlistItems = await fetchWishlist();
            return reply.send(wishlistItems);
        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    // ✅ Remove Item from Wishlist
    fastify.delete('/wishlist/remove/:wishlist_id', async (req, reply) => {
        try {
            const { wishlist_id } = req.params;

            const removeFromWishlist = () => {
                return new Promise((resolve, reject) => {
                    db.query("DELETE FROM Wishlist WHERE id = ?", [wishlist_id], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            };

            await removeFromWishlist();
            return reply.send({ message: "✅ Item removed from wishlist!" });

        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error", error });
        }
    });

    done();
};
