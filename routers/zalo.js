const express = require("express");
const router = express.Router();
const zaloService = require("../services/zalo");

router.post("/send", async (req, res) => {
  try {
    const result = await zaloService.send(req.body);
    if (result) {
      return res.json({ messa: result.data.message });
    }
    res.json({ messa: "Lỗi " });
  } catch (error) {
    console.log(error);
  }
});
router.post("/findUser_id", async (req, res) => {
  try {
    const result = await zaloService.findUser_id();
    if (result) {
      return res.json({ messa: result.data.message });
    }
    res.json({ messa: "Listring " });
  } catch (error) {
    console.log(error);
  }
});
router.post("/sendUserFollow", async (req, res) => {
  try {
    const result = await zaloService.sendUserFollow();
    console.log(result);
    if (result) {
      return res.json({ messa: result.data.message });
    }
    res.json({ messa: "Lỗi " });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
