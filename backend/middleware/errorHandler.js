/**
 * 错误处理中间件
 */

// 404 处理中间件
const notFound = (req, res, next) => {
    const error = new Error(`未找到路由 - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error('错误:', err.message);
    console.error('堆栈:', err.stack);
    
    const status = err.status || 500;
    const message = err.message || '服务器内部错误';
    
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 异步处理包装器
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    notFound,
    errorHandler,
    asyncHandler
};
