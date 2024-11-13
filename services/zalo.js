const axios = require("axios");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN;
const baseUrl = process.env.BASE_URL;
const baseUrl2 = process.env.BASE_URL2;
const baseUrl3 = process.env.BASE_URL3;

async function send(body) {
  try {
    const res = await axios.post(
      baseUrl,
      {
        data: {
          phone: "0934459099",
          template_id: "383148",
          template_data: {  
            "order_code": "order_code",
            "date": "01/08/2020",
            "price": 100,
            "name": "name",
            "phone_number": "phone_number",
            "status": "status",
          },
          tracking_id: "tracking_id",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access_token": `${accessToken}`,
        },
      }
    );
    // console.log(res.data);
    return res;
  } catch (error) {
    console.log(error);
  }
}
async function findUser_id() {
  try {
    const result = await axios.post(
      baseUrl3,
      {
        data:{
          "offset" : 0,
          "count" : 10,
          "tag_name" : "",
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access_token": `${accessToken}`,
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}
async function sendUserFollow() {
  try {
    const result = await findUser_id();
    const res = await axios.post(
      baseUrl2,
      {
        recipient : {
          user_id: result["data"].data[0].user_id,
        },
        message : {
          text: "Hello World"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access_token": `${accessToken}`,
        },
      }
    );
    return res;
  } catch (error) {
    if (error.response) {
      console.log("Error response:", error.response.data);
    } else {
      console.log(error.message);
    }  }
}
module.exports = {
  send,
  sendUserFollow,
  findUser_id
};
