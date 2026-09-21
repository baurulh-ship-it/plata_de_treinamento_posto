const express=require('express');
const {register,login,logout}=require('../controllers/authController');
const {authMiddleware}=require('../middleware/authMiddleware');
const router=express.Router();
// Limits repeated authentication attempts without retaining passwords or emails.
const attempts=new Map();
const sweep=setInterval(()=>{const now=Date.now();for(const [ip,item] of attempts)if(item.until<=now)attempts.delete(ip);},60000);
sweep.unref();
function limit(req,res,next){const now=Date.now();let item=attempts.get(req.ip);if(!item||item.until<=now){item={count:0,until:now+15*60*1000};attempts.set(req.ip,item);}if(++item.count>50){res.set('Retry-After',String(Math.ceil((item.until-now)/1000)));return res.status(429).json({erro:'Muitas tentativas. Aguarde alguns minutos e tente novamente.'});}next();}
router.post('/register',limit,register);
router.post('/login',limit,login);
router.post('/logout',logout);
router.get('/me',authMiddleware,(req,res)=>res.json({usuario:req.user}));
module.exports=router;
