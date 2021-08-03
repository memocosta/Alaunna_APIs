// policies/isLoggedIn.js
module.exports = async function (req, res, proceed) {
    console.log(req.headers['authorization']);
};
