class ExpressError extends Error{
    constructor(message,statusCode){
        super();
        this.message=message;
        this.statusCode=statusCode;
        console.log('trigger expressError');
        console.dir(this);
    }
}

module.exports=ExpressError;