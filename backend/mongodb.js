const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/arpico_online', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Failed:", err));

module.exports = mongoose;
