const zaloService = require("../services/zalo");
const dayjs = require('dayjs');

module.exports = {
  send: async (req, res) => {
    req.body.date = dayjs().format('HH:mm:ss DD/MM/YYYY');
    try {
      req.body.template_id = "384179";
      req.body.template_data = {
        name: req.body.name,
        order_code: req.body.order_code,
        date: req.body.date,
        price: req.body.price,
        payment: req.body.payment
      };
      data = {
        "phone": req.body.phone,
        "template_id": req.body.template_id,
        "template_data": req.body.template_data,
        "tracking_id": req.body.tracking_id
      }
      const result = await zaloService.send(data);
      if (result) {
        return res.json({ messa: result.data.message });
      }
      res.json({ messa: result});
    } catch (error) {
      console.log(error);
      res.json({ messa: "Lỗi hệ thống" });
    }
  },

  findUser_id: async (req, res) => {
    try {
      const result = await zaloService.findUser_id(req.query.data);
      if (result) {
        return res.json({
          messa: result,
        });
      }
      res.json({
        messa: result,
      });
    } catch (error) {
      console.log(error);
    }
  },
  sendUserFollow: async (req, res) => {
    try {
      const result = await zaloService.sendUserFollow(req.body,null, req.query.data);
      // if (result.user_idError) {
      //    result = await zaloService.sendUserFollow(req.body, result.user_idError, req.query.data);
      // }
      if (result) {
        return res.json({
          messa: result,
        });
      }
      res.json({
        messa: "Không gửi được tin nhắn",
      });
    } catch (error) {
      console.log(error);
    }
  },
  newAccessToken: async (req, res) => {
    try {
      const result = await zaloService.newAccessToken();
      if (result) {
        return res.json({
          messa: result,
        });
      }
      res.json({
        messa: "Không lấy được token",
      });
    } catch (error) {
      console.log(error);
    }
  },
  newFirstAccessToken: async (req, res) => {
    try {
      const result = await zaloService.newFirstAccessToken();
      if (result) {
        return res.json({
          messa: result,
        });
      }
      res.json({
        messa: "Không lấy được token",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
