/*
Author: Rabindra Tamang
Date Accessed: 11 October 2026
Link: https://dev.to/rabindratamang/how-to-implement-role-based-access-control-rbac-in-nodejs-applications-1ed2
Reason: Used to create role-based access control middleware that checks req.user.role and returns 403 for unauthorised roles.
*/

const requireRole = (...allowedRoles) => {
    return(req,res,next) => {
        if(!req.user) {
            const error = new Error(
                "Authentication required"
            );

            error.statusCode = 401;
            return next(error);
        }

        if (!allowedRoles.includes(req.user.role)) {
            const error = new Error(
                "You are not authorised to perform this action"
            );

            error.statusCode = 403;
            return next(error);
        }

        next()
    };

};

module.exports = requireRole;