
if(process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  // dev - not in git ignore
  module.exports = require('./dev');
}
