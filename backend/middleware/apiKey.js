/**
 * API Key 认证中间件
 * 用于外部接口的简单认证
 */

const apiKeyMiddleware = (req, res, next) => {
    try {
        // 从请求头获取 API Key
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: '缺少 API Key，请在请求头中添加 x-api-key'
            });
        }
        
        // 验证 API Key
        if (apiKey !== process.env.API_KEY) {
            return res.status(403).json({
                success: false,
                message: 'API Key 无效'
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'API Key 验证失败'
        });
    }
};

module.exports = apiKeyMiddleware;
