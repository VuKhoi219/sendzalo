const axios = require("axios");
require("dotenv").config();

const accessToken = process.env.ACCESS_TOKEN;
const appId = process.env.APP_ID;
const refreshToken = process.env.REFRESH_TOKEN;
const secretKey = process.env.SECRET_KEY;
// Đường dẫn API zalo
const BASE_URL_Get_Access_Token = process.env.BASE_URL_Get_Access_Token;
const BASE_URL_SEND_ZNC = process.env.BASE_URL_SEND_ZNC;
const BASE_URL_Send_User_Follow = process.env.BASE_URL_Send_User_Follow;
const BASE_URL_GET_LIST_USER = process.env.BASE_URL_GET_LIST_USER;

// offset : Thứ tự của người dùng đầu tiên trong danh sách trả về.Hỗ trợ tối đa 9951 (tương ứng 10000 người dùng, 50 người dùng/request)
// count : số lượng người dùng muốn lấy
// last_interaction_period :	Khoảng thời gian tương tác gần nhất của người dùng
// is_follower :	Trạng thái quan tâm OA của người dùng . true: Người dùng đang quan tâm OA , false: Người dùng không quan tâm OA
const queryString = `{"offset":0,"count":15,"last_interaction_period":"TODAY","is_follower":"true"}`;

// Gửi tin nhắn ZNC
async function send(body) {
  try {
    const res = await axios.post(BASE_URL_SEND_ZNC, body, {
      headers: {
        "Content-Type": "application/json",
        Access_token: `${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
// Truy xuất danh sách người theo dõi
async function findUser_id(query) {
  try {
    let q = query || queryString;
    let url = BASE_URL_GET_LIST_USER + q;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Access_token: `${accessToken}`,
      },
    });
    console.log(result);
    return result.data.data.users.map((item) => {
      return item.user_id;
    });
  } catch (error) {
    console.log(error);
  }
}
// Gửi tin nhắn cho người theo dõi
// hiện tại không còn ds người dùng nên chưa test được
async function sendUserFollow(text, user_idHandlingError = null, query = null) {
  try {
    const result = null;
    let user_idSuccess = [];
    let user_idError = [];
    if (!user_idHandlingError) {
      result = await findUser_id(query);
    } else {
      result = user_idHandlingError;
    }
    // hiện tại zalo chỉ hỗi trợ gửi tin nhắn cho 1 người theo dõi chưa có gửi nhiều người cùng 1 lúc
    for (let i = 0; i < result.length; i++) {
      const res = await axios.post(
        BASE_URL_Send_User_Follow,
        {
          recipient: {
            user_id: `${result[i]}`,
          },
          message: {
            text: text.text,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Access_token: `${accessToken}`,
          },
        }
      );
      if (res.data.error != 0) {
        user_idError.push(result[i]);
      } else {
        user_idSuccess.push(result[i]);
      }
    }
    let numbersUserError = user_idError.length;
    let numbersUserSuccess = user_idSuccess.length;
    return { user_idError, numbersUserError, numbersUserSuccess };
  } catch (error) {
    if (error.response) {
      console.log("Error response:", error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

// lấy access token mới
async function newAccessToken() {
  try {
    // console.log(refreshToken);
    let body = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      app_id: `${appId}`
    }
    const res = await axios.post(
      BASE_URL_Get_Access_Token,
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Secret_key: `${secretKey}`,
          },
        }
      
    );
     console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  send,
  sendUserFollow,
  findUser_id,
  newAccessToken,
};
