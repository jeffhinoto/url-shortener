var express = require('express');
var router = express.Router();
const Link = require('../models/link');
const path = require('path');
const fs = require('fs');


router.get('/ads.txt', function (req, res, next) {
  try{
    let data = fs.readFileSync(path.join(__dirname, 'ads.txt'), 'utf8');
    return res.attachment("ads.txt").send(data)
} catch(err) {
    console.log(err)
    return res.sendStatus(403);
}
});

router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.render('stats', resultado.dataValues);
})

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();
  let ads = [
    'https://meuvicioerock.blogspot.com/2013/10/#popup'
  ]

  let i = Math.floor(Math.random() * (ads.length));
    console.log(i)
    console.log(ads[i])
  res.render('redirect', { title: 'Encurtador', url: resultado.url, ad: ads[i] });
  //res.redirect(resultado.url);
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador' });
});



function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();
  const domain = process.env.DOMAIN;

  const resultado = await Link.create({
    url,
    code
  })
  resultado.dataValues.domain = domain;
  res.render('stats', resultado.dataValues);
})


router.post('/api/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();

  const resultado = await Link.create({
    url,
    code
  })
  res.json({result: resultado.dataValues});
})
module.exports = router;
