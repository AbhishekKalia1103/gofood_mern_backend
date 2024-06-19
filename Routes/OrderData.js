const express = require("express");
const Orders = require("../models/Orders");
const router = express.Router();

router.post("/orderData", async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });
  console.log("1231242343242354", req.body.email);

  //if email not exisitng in db then create: else: InsertMany()
  let eId = await Orders.findOne({ email: req.body.email });
  console.log(eId);
  if (eId === null) {
    try {
      console.log(data);
      console.log("1231242343242354", req.body.email);
      await Orders.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        return res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      return res.send("Server Error", error.message);
    }
  } else {
    try {
      await Orders.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        return res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      return res.send("Server Error", error.message);
    }
  }
});

router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Orders.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});
module.exports = router