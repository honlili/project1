/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization token
 */
const jwt = require('jsonwebtoken');

// JWT认证中间件
const authMiddleware = (req, res, next) => {
    try {
        // 从请求头获取token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌，请先登录'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 将用户信息附加到请求对象
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: '令牌已过期，请重新登录'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: '无效的令牌'
            });
        }
        return res.status(500).json({
            success: false,
            message: '认证失败'
        });
    }
};

// 可选认证中间件（token存在则验证，不存在则跳过）
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        // 忽略错误，继续执行
        next();
    }
};

// 角色权限检查中间件
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: '未认证'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '权限不足'
            });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    optionalAuth,
    checkRole
};
