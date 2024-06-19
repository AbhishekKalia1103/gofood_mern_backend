const express = require("express");
const router = express.Router();

router.post('/foodData', (req, res)=> {
    try {
        console.log(global.food_items)
        console.log(global.foodCategory)
        res.send([global.food_items, global.foodCategory]);
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error.message);
        res.send("Server error")
        
    }
})

module.exports = router;