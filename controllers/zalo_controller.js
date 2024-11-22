const zaloService = require("../services/zalo");
const dayjs = require("dayjs");
require("dotenv").config();

module.exports = {
  send: async (req, res) => {
    req.body.date = dayjs().format("HH:mm:ss DD/MM/YYYY");
    try {
      req.body.template_id = process.env.TEMPLATE_ID;// mặc định 
      req.body.template_data = {
        name: req.body.name,
        order_code: req.body.order_code,
        date: req.body.date,
        price: req.body.price,
        payment: req.body.payment,
      };
      data = {
        phone: req.body.phone,
        template_id: req.body.template_id,
        template_data: req.body.template_data,
        tracking_id: req.body.tracking_id,
      };
      const result = await zaloService.send(data, req, res);
      console.log(result);
      if (result) {
        return res.json({ success: true, messa: result.data.message });
      }
      res.json({ success: false, messa: "Gửi tin nhắn không thành công" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, messa: "Lỗi hệ thống" });
    }
  },

  findUser_id: async (req, res) => {
    try {
      const result = await zaloService.findUser_id(req.query.data, req);
      if (result) {
        return res.json({
          success: true,
          messa: result,
        });
      }
      res.json({
        success: false,
        messa: result,
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, messa: "Lỗi hệ thống" });
    }
  },
  sendUserFollow: async (req, res) => {
    try {
      const result = await zaloService.sendUserFollow(
        req.body,
        null,
        req.query.data
      );
      // if (result.user_idError) {
      //    result = await zaloService.sendUserFollow(req.body, result.user_idError, req.query.data);
      // }
      if (result) {
        return res.json({
          success: true,
          messa: result,
        });
      }
      res.json({
        success: false,
        messa: "Không gửi được tin nhắn",
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, messa: "Lỗi hệ thống" });
    }
  },
  // newAccessToken: async (req, res) => {
  //   try {
  //     const result = await zaloService.newAccessToken();
  //     console.log("access token");
  //     console.log(result.data.access_token);
  //     console.log("refresh token");
  //     console.log(result.data.refresh_token);
  //     res.cookie("access_token", result.data.accesstoken ,{ httpOnly: true });
  //     res.cookie("refresh_token", result.data.refreshtoken ,{ httpOnly: true });
  //     if (result) {
  //       return res.json({
  //         messa: result,
  //       });
  //     }
  //     res.json({
  //       messa: "Không lấy được token",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
