const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://abhishekkalia:aK!!0311@cluster0.f4fawva.mongodb.net/gofood?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = () => {
  mongoose.connect(mongoURI, async () => {
    console.log("db connected");
    const fetchedData = mongoose.connection.db.collection("foodItems");
    fetchedData.find({}).toArray(async function (err, data) {
      const foodCategory = mongoose.connection.db.collection(
        "foodCategories"
      );
      foodCategory.find({}).toArray(function (err, catData) {
        if (err) console.log(err);
        else {
          global.food_items = data;
          global.foodCategory = catData;
        }
      });
    });
  });
};

module.exports = mongoDB;
