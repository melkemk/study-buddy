const handler = (err, req, res, next) => {
    const errorName = err.name;
    if (errorName === 'JsonWebTokenError') {
      res.status(400).json({ success: false, error: { message: 'Incorrect or broken token' } });
    } else if (errorName === 'passwordOrEmail') {
      res.status(400).json({ success: false, error: { message: 'Incorrect email or password' } });
    } else if (errorName === 'MongoServerError') {
      switch (err.code) {
        case 11000:
          res.status(400).json({ success: false, error: { message: 'Duplicate email or username' } });
          break;
        default:
          res.status(500).json({ success: false, error: err });
      }
    } else {
      if(err.message='data and salt arguments required')  
        //  return  res.json({success:false,error:{message:"you didn't provide all the requirements"}})
      console.log(err);
      res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
  };
  
  module.exports = handler;
  