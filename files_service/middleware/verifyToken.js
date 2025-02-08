async function verifyToken(req, res, next) {
    const userServiceLocation = process.env.USER_SERVICE_LOCATION;
    if (!req.headers.authorization) return res.status(401).json({error: "You must be logged in to perform this action."});
    try {
        const response = await fetch(userServiceLocation + "/users/authenticate", {
            method: 'POST',
            headers: {
                "Authorization": req.headers.authorization
            }
        });
        const responseJson = await response.json();
        if (responseJson.error) return res.status(401).json({error: "Invalid authentication token."});
        req.user = responseJson.token;
        next();
    } catch (error) {
        return res.status(500).json({error: "Unknown error during authentication."});
    }
};

module.exports = verifyToken;
