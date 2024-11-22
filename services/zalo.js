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
// Truy xuất danh sách người theo dõi
async function findUser_id(query, req) {
  // let accessToken1 = await getAccessToken(req);
  let accessToken1 = await getAccessToken(req);

  let q = query || queryString;
  let url = BASE_URL_GET_LIST_USER + q;
  const result = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Access_token: `${accessToken1.access_token}`,
    },
  });
  console.log(result);
  return result.data.data.users.map((item) => {
    return item.user_id;
  });
}
// Gửi tin nhắn cho người theo dõi
// hiện tại không còn ds người dùng nên chưa test được
async function sendUserFollow(text, user_idHandlingError = null, query = null) {
  const result = null;
  let user_idSuccess = [];
  let user_idError = [];
  let accessToken1 = await getAccessToken(req);
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
          Access_token: `${accessToken1.access_token}`,
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
}

// lấy access token mới
async function newAccessToken(refreshToken) {
  let body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    app_id: `${appId}`,
  };
  const res = await axios.post(BASE_URL_Get_Access_Token, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Secret_key: `${secretKey}`,
    },
  });
  // console.log(res.data);
  // xem lỗi tại https://developers.zalo.me/docs/social-api/tham-khao/ma-loi
  if (res.data.error) {
    return null;
  }
  return res.data;
}
// lấy token từ cookies
async function getAccessToken(req) {
  let token = req.cookies;
  // console.log(token);
  // console.log("Cookies received:", token);
  if (!token) {
    // console.log("No cookies found.");
    return null;
  }
  if (!token.access_token || !token.refresh_token) {
    // console.log("Access token or refresh token is missing.");
    return null;
  }
  return token;
}
// Gửi tin nhắn ZNC
async function send(body, req, res) {
  let result = null;
  // res.cookie("access_token", accessToken, { httpOnly: true , maxAge : 90 * 24 * 60 * 60 * 1000 });
  // res.cookie("refresh_token", refreshToken, { httpOnly: true , maxAge:  90 * 24 * 60 * 60 * 1000 });
  let accessToken1 = await getAccessToken(req);
  if (!accessToken1) {
    return result = null;
  }

  result = await axios.post(BASE_URL_SEND_ZNC, body, {
    headers: {
      "Content-Type": "application/json",
      Access_token: `${accessToken1.access_token}`,
    },
  });

  //console.log(result);
  //data.error = 0  Success
  //data.error = -124  	Mã truy cập không hợp lệ
  //các trường hợp khác xem tại https://developers.zalo.me/docs/zalo-notification-service/phu-luc/bang-ma-loi
  if (result.data.error == -124) {
    console.log(accessToken1.refresh_token);
    let newAccessToken1 = await newAccessToken(accessToken1.refresh_token);
    console.log("newAccessToken");
    console.log(newAccessToken1);
    res.cookie("access_token", newAccessToken1.access_token, {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refresh_token", newAccessToken1.refresh_token, {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    result = await axios.post(BASE_URL_SEND_ZNC, body, {
      headers: {
        "Content-Type": "application/json",
        Access_token: `${newAccessToken1.access_token}`,
      },
    });
  } else if (result.data.error < 0 && result.data.error != -124) {
    result = null;
  }
  // console.log(result.data.data.users);
  return result;
}
module.exports = {
  send,
  sendUserFollow,
  findUser_id,
  newAccessToken,
  getAccessToken,
};
