import mongoose from 'mongoose';
import fs from 'fs';

// 🔗 Your MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://chinmaybadwaik9:QPm4rW6915E8MGyb@enabledmongodbcluster.qil1hd6.mongodb.net/?retryWrites=true&w=majority&appName=EnabledMongodbCluster';

// 🧠 Your Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  countInStock: { type: Number, default: null },
  yearlyLimitPerUser: { type: Number, default: 1 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// 📥 Load your JSON file
const products = JSON.parse(fs.readFileSync('./products_seed_data.json', 'utf-8'));

const importData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany(); // optional: clear existing data
    await Product.insertMany(products); // insert your JSON data

    console.log('✅ Data successfully inserted!');
    process.exit();
  } catch (error) {
    console.error('❌ Failed to insert data:', error);
    process.exit(1);
  }
};

importData();
