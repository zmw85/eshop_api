let userControllers = {
  get_users: function(req, res) {
    console.log('/api/users');
    res.end();
  }
}

module.exports = userControllers;