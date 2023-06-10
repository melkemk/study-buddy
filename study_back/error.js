 class  incorrectpasswordOrEmail extends Error {
    constructor(message,name,code) {
      super(message);
      this.code =code ;
      this.name =name;
    }
  }
  

module.exports={incorrectpasswordOrEmail}