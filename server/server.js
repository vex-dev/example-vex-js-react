const express = require('express');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

const buildFolder = '../client/build';
const { VEX_API_KEY_ID, VEX_API_SECRET, VEX_ROOM_ID, VEX_SERVER_URL } = process.env;

function createJWT(roomId) {
  const payload = {
    "action": "join",
    "room_id": roomId
  }

  return jsonwebtoken.sign(
    payload,
    VEX_API_SECRET,
    {
      header: { "api_key_id": VEX_API_KEY_ID }
    }
  )
}

const app = express();
app.set('views', path.join(__dirname, buildFolder));
app.engine('html', require('ejs').renderFile);

app.use('/static', express.static(path.join(__dirname, `${buildFolder}/static`)));

app.get('/', function (req, res) {
  const jwt = createJWT(VEX_ROOM_ID);
  res.render('index.html', { VEX_SERVER_URL, VEX_ROOM_ID, JWT: jwt });
});

app.listen(4000, () => console.log(`Server listening on port 4000`));
