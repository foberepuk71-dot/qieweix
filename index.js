const express = require('express');
const { decrypt, getSignature } = require('@wecom/crypto');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.text({ type: 'text/xml' }));

// 这里由老板在 Zeabur 环境变量里配置
const config = {
  token: process.env.WECOM_TOKEN,
  encodingAESKey: process.env.WECOM_ENCODING_AES_KEY,
  corpId: process.env.WECOM_CORP_ID
};

// 验证接口 (GET)
app.get('/wecom-app', (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;
  try {
    const { message } = decrypt(config.encodingAESKey, echostr);
    res.send(message);
    console.log('✅ 验证成功！');
  } catch (e) {
    res.status(403).send('Forbidden');
    console.error('❌ 验证失败:', e.message);
  }
});

// 接收消息 (POST)
app.post('/wecom-app', (req, res) => {
  // 转发逻辑暂略，先确保能通
  res.send('success');
});

app.listen(PORT, () => {
  console.log(`🚀 星仔中转站已在端口 ${PORT} 启动！`);
});
