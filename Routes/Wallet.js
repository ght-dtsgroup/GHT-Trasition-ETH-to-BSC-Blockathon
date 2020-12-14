module.exports = function(app) {
    let walletCtrl = require('../Controllers/WalletController');
  
    app.route('/user/:userId')
      .get(walletCtrl.create)
  };