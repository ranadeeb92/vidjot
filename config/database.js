if(process.env.NODE_ENV === 'production'){
 module.exports = {mongoURI:
'mongodb://rana:123nicolas@ds151486.mlab.com:51486/vid'}
}else{
module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}