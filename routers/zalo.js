const express = require("express");
const router = express.Router();
const zaloController = require("../controllers/zalo_controller");


router.get("/send", (req, res) => {
  res.render("send");
});
/**
 * @api {post} path /zalo/send
 * @apiBody [{string}] body.phone
 * @apiBody [{Json}] body.template_data
 * @apiBody [{string}] body.template_data.name
 * @apiBody [{string}] body.template_data.order_code
 * @apiBody [{string}] body.template_data.date
 * @apiBody [{number}] body.template_data.price
 * @apiBody [{string}] body.template_data.payment
 * @apiBody [{string}] body.tracking_id
 * @apiSuccess [Object] result.data.message 
 */
router.post("/send", async (req, res) => {

  await zaloController.send(req, res);
});

router.get("/findUser_id", async (req, res) => {
  await zaloController.findUser_id(req, res);
});

/**
 * @api {post} path /zalo/sendUserFollow?data={Json}
 * @apiQuery [{Json}] query.data
 * @apiQuery [{number}] query.data.offset
 * @apiQuery [{number}] query.data.count
 * @apiQuery [{string}] query.data.last_interaction_period
 * @apiQuery [{boolean}] query.data.is_follower
 * 
 * @apiBody [{string}] body.text
 * @apiSuccess [Object] messa
 */
router.post("/sendUserFollow", async (req, res) => {
  await zaloController.sendUserFollow(req, res);
});
router.post("/newAccessToken", async (req, res) => {
  await zaloController.newAccessToken(req, res);
})
module.exports = router;
