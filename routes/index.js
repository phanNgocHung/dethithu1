var express = require('express');
var router = express.Router();
const multer = require ('multer')
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  const db ='mongodb+srv://hungpnph28935:admin@cluster0.dhfnwbe.mongodb.net/bicycle'
  await mongoose.connect(db);

}

const BicycleModel
    = new mongoose.Schema({
  maXe:  String,
  giaNhap: String,
  soLuong:  String,
  hinhAnh: [{ type: String }]

})
/* GET home page. */
router.get('/',async function(req, res, next) {
  const query = mongoose.model('bicycle', BicycleModel, 'bicycle')
  const data = await query.find()
  res.render('index', { title: 'Offical bicycle Website', data : data, path: '/uploads/' });
});


const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Duong dan luu tru file
  },
  // Tu dong dat ten anh la thoi gian hien tai + 1 so random
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const imageFilter = function(req, file, cb) {
  if (file.mimetype !== 'image/png') {
    return cb(new Error('Chỉ cho phép định dạng ảnh JPG'),false);
  }
  if (file.size > 2 * 1024 * 1024) { // 2MB
    return cb(new Error('Kích thước ảnh không được vượt quá 2MB'),false);
  }if (req.files && req.files.length >=5) { // 2MB
    return cb(new Error("so lượng ảnh ko được vượt quá 5"),false);
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});




const maxFileCount = 2;
//add==================
router.get('/add', async function(req, res, next) {
  res.render('add', { title: 'Express'});
});

router.post('/addBicycle', (req, res, next) => {
  upload.array('images', maxFileCount)(req, res, async function (err) {
    if(err instanceof multer.MulterError){
      res.status(400).send(err.message);
    }
    else if (err) {
      res.status(400).send(err.message);
    }else {

    const maXe = req.body.maXe;
    const giaNhap = req.body.giaNhap;
    const soLuong = req.body.soLuong;
    const hinhAnh = req.files.map(file =>file.originalname);
    console.log(hinhAnh)
      if(!maXe || !giaNhap || !soLuong){
        return res.status(400).send('vui lòng nhâp thông tin sản phẩm');
      }
    const query = mongoose.model('bicycle', BicycleModel, 'bicycle')
    await query.create({
      maXe: maXe,
      giaNhap: giaNhap,
      soLuong: soLuong,
      hinhAnh: hinhAnh, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
    });
    }
    res.redirect('/');
  });

});

//delete==============

router.get('/delete', async function (req,res){
  const maXe = req.query.maXe
  const query = mongoose.model('bicycle', BicycleModel, 'bicycle')
  await query.deleteOne({maXe:maXe})
  // Cap nhat lai danh sach sau khi xoa
  const data = await query.find()
  res.render('index', { title: 'Offical Ferrari Website', data : data, path: '/uploads/' });
})

//update=============================
router.get('/update', async function(req, res, next) {
  res.render('update', { title: 'Express'});
});

router.post('/updateBicycle',async function (req,res){
  upload.array('images', maxFileCount)(req, res, async function (err) {
    const maXe = req.body.maXe;
    if(err instanceof multer.MulterError){
      res.status(400).send(err.message);
    }
    else if (err) {
      res.status(400).send(err.message);
    }else {
      const giaNhap = req.body.giaNhap;
      const soLuong = req.body.soLuong;
      const hinhAnh = req.files.map(file =>file.originalname);
      console.log(hinhAnh)
      if( !giaNhap || !soLuong){
        return res.status(400).send('vui lòng nhâp thông tin sản phẩm');
      }
    const query = mongoose.model('bicycle', BicycleModel, 'bicycle')
    await query.updateOne({maXe : maXe},{
      giaNhap: giaNhap,
      soLuong: soLuong,
      hinhAnh: hinhAnh,
    })
      }
    res.redirect('/');
  });
})
module.exports = router;
