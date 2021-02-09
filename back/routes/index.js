var express = require('express');
var router = express.Router();

const fs = require('fs');
let uniqid = require('uniqid');

let cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dmvudxnlz',
  api_key: '486252567518268',
  api_secret: 'fMpv-_mO4bQAvLLhSYiKPuC7ThE'
});

var request = require('sync-request');
    
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '1be3efe4ebc348dab70a8bbf5a3c1222';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', async function(req, res,) {
  let imgPath = './tmp/'+uniqid()+'.jpg'
  let resultCopy = await req.files.image.mv(imgPath);

  if(!resultCopy){
    var resultCloudinary = await cloudinary.uploader.upload(imgPath);
    const imageUrl = resultCloudinary.secure_url;
    // Request parameters.
    const params = {
      'returnFaceId': 'true',
      'returnFaceLandmarks': 'false',
      'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
          'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    
    const options = {
      qs: params,
      body: '{"url": ' + '"' + imageUrl + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
    };
    
    let response = request('post', uriBase, options);
    let resultJson = JSON.parse(response.body);

    console.log('JSON Response\n');
    console.log(resultJson);

    let gender, age, glasses, barbe, smile, hairColorTrad;

    if(resultJson[0]){
      let faceAttributes = resultJson[0].faceAttributes;
    
      gender = faceAttributes.gender === "male" ? "homme" : "femme";
      age = faceAttributes.age + " ans";
    
      glasses = faceAttributes.glasses === "NoGlasses" ? false : true;
      barbe = faceAttributes.facialHair.beard > 0.4 ? true : false;
      smile = faceAttributes.emotion.hapiness > 0.6 ? true: false;
    
      let hairColor = faceAttributes.hair.hairColor[0].color;
      hairColorTrad = 
        hairColor === "gray" ? "cheveux gris" 
      : hairColor === "black" ? "cheveux brun" 
      : hairColor === "blond" ? "cheveux blond" 
      : hairColor === "brown" ? "cheveux châtain" 
      : hairColor === "red" ? "cheveux roux" 
      : "autre";
    }
    
      res.json({
        url: imageUrl, gender, age, glasses, barbe, smile, hairColorTrad });
  } else {
    console.log("????")
    res.json({result: false, message: resultCopy});
  }

  fs.unlinkSync(imgPath);
});








router.get('/test', function(req, res, next) {
  'use strict';

var request = require('sync-request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '1be3efe4ebc348dab70a8bbf5a3c1222';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

const imageUrl =
'https://res.cloudinary.com/dmvudxnlz/image/upload/v1591091464/picture-1_buiaq7.jpg'
// Request parameters.
const params = {
  'returnFaceId': 'true',
  'returnFaceLandmarks': 'false',
  'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
      'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
  qs: params,
  body: '{"url": ' + '"' + imageUrl + '"}',
  headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
  }
};

let result = request('post', uriBase, options);
let resultJson = JSON.parse(result.body)

console.log('JSON Response\n');
console.log(resultJson);

let gender, age, glasses, barbe, smile, hairColorTrad;

if(resultJson[0]){
  let faceAttributes = resultJson[0].faceAttributes;

  gender = faceAttributes.gender === "male" ? "homme" : "femme";
  age = faceAttributes.age + " ans";

  glasses = faceAttributes.glasses === "NoGlasses" ? false : true;
  barbe = faceAttributes.facialHair.beard > 0.4 ? true : false;
  smile = faceAttributes.emotion.hapiness > 0.6 ? true: false;

  let hairColor = faceAttributes.hair.hairColor[0].color;
  hairColorTrad = 
    hairColor === "gray" ? "cheveux gris" 
  : hairColor === "black" ? "cheveux brun" 
  : hairColor === "blond" ? "cheveux blond" 
  : hairColor === "brown" ? "cheveux châtain" 
  : hairColor === "red" ? "cheveux roux" 
  : "autre";
}

  res.json({
    url: imageUrl, 
    gender, 
    age, 
    glasses,
    barbe,
    smile,
    hairColorTrad, 
  });
});


module.exports = router;
