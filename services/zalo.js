const axios = require("axios");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.BASE_URL;

async function send() {
  try {
    const res = await axios.post(
      baseUrl,
      {
        data: {
          phone: "0901315275",
          template_id: "7895417a7d3f9461cd2e",
          template_data: {
            ky: "1",
            thang: "4/2020",
            start_date: "20/03/2020",
            end_date: "20/04/2020",
            customer: "Nguyễn Thị Hoàng Anh",
            cid: "PE010299485",
            address: "VNG Campus, TP.HCM",
            amount: "100",
            total: "100000",
          },
          tracking_id: "tracking_id",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  send,
};
