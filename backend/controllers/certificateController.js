/**
 * 控制器 - 证书管理
 */
const certificateModel = require('../models/certificateModel');

// 获取证书列表
const getAll = async (req, res) => {
    try {
        const { page, pageSize, type, status, keyword } = req.query;
        const result = await certificateModel.getAll({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10,
            type,
            status,
            keyword
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize
            }
        });
    } catch (error) {
        console.error('获取证书列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取证书列表失败'
        });
    }
};

// 获取所有启用的证书（下拉选择用）
const getActive = async (req, res) => {
    try {
        const certificates = await certificateModel.getActive();
        res.json({
            success: true,
            data: certificates
        });
    } catch (error) {
        console.error('获取启用证书错误:', error);
        res.status(500).json({
            success: false,
            message: '获取证书失败'
        });
    }
};

// 获取单个证书
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await certificateModel.getById(id);
        
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: '证书不存在'
            });
        }
        
        res.json({
            success: true,
            data: certificate
        });
    } catch (error) {
        console.error('获取证书错误:', error);
        res.status(500).json({
            success: false,
            message: '获取证书失败'
        });
    }
};

// 创建证书
const create = async (req, res) => {
    try {
        const { name, type, is_required, issuing_authority, description, status } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: '证书名称和类型为必填项'
            });
        }
        
        const id = await certificateModel.create({
            name, type, is_required, issuing_authority, description, status
        });
        
        res.status(201).json({
            success: true,
            message: '证书创建成功',
            data: { id }
        });
    } catch (error) {
        console.error('创建证书错误:', error);
        res.status(500).json({
            success: false,
            message: '创建证书失败'
        });
    }
};

// 更新证书
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const success = await certificateModel.update(id, data);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '证书不存在或无更新'
            });
        }
        
        res.json({
            success: true,
            message: '证书更新成功'
        });
    } catch (error) {
        console.error('更新证书错误:', error);
        res.status(500).json({
            success: false,
            message: '更新证书失败'
        });
    }
};

// 删除证书
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        const success = await certificateModel.remove(id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '证书不存在'
            });
        }
        
        res.json({
            success: true,
            message: '证书删除成功'
        });
    } catch (error) {
        console.error('删除证书错误:', error);
        res.status(500).json({
            success: false,
            message: '删除证书失败'
        });
    }
};

// 获取证书统计
const getStats = async (req, res) => {
    try {
        const stats = await certificateModel.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取证书统计错误:', error);
        res.status(500).json({
            success: false,
            message: '获取统计失败'
        });
    }
};

module.exports = {
    getAll,
    getActive,
    getById,
    create,
    update,
    remove,
    getStats
};
