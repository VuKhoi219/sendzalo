const express = require('express');
const router = express.Router();
const zaloService = require('../services/zalo');

router.post('/send', async (req, res) => {
    try{
        const result =  await zaloService.send();
        // console.log(result);
        if(result){
            res.json({messa : "ok"});
        }
        res.json({messa : "Lỗi "});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;