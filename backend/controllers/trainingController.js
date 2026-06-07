/**
 * 控制器 - 培训资料管理
 */
const trainingMaterialModel = require('../models/trainingMaterialModel');

// 获取培训资料列表
const getAll = async (req, res) => {
    try {
        const { page, pageSize, material_type, certificate_id, status, keyword } = req.query;
        const result = await trainingMaterialModel.getAll({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10,
            material_type,
            certificate_id,
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
        console.error('获取培训资料列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取培训资料列表失败'
        });
    }
};

// 获取已发布的培训资料
const getPublished = async (req, res) => {
    try {
        const materials = await trainingMaterialModel.getPublished();
        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('获取已发布培训资料错误:', error);
        res.status(500).json({
            success: false,
            message: '获取失败'
        });
    }
};

// 获取单个培训资料
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await trainingMaterialModel.getById(id);
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: '培训资料不存在'
            });
        }
        
        // 增加浏览次数
        await trainingMaterialModel.incrementViewCount(id);
        
        res.json({
            success: true,
            data: material
        });
    } catch (error) {
        console.error('获取培训资料错误:', error);
        res.status(500).json({
            success: false,
            message: '获取培训资料失败'
        });
    }
};

// 创建培训资料
const create = async (req, res) => {
    try {
        const { title, content, material_type, certificate_id, file_path, publish_date, status } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: '标题为必填项'
            });
        }
        
        const id = await trainingMaterialModel.create({
            title, content, material_type, certificate_id, file_path, publish_date, status,
            created_by: req.user?.id
        });
        
        res.status(201).json({
            success: true,
            message: '培训资料创建成功',
            data: { id }
        });
    } catch (error) {
        console.error('创建培训资料错误:', error);
        res.status(500).json({
            success: false,
            message: '创建培训资料失败'
        });
    }
};

// 更新培训资料
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const success = await trainingMaterialModel.update(id, data);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '培训资料不存在或无更新'
            });
        }
        
        res.json({
            success: true,
            message: '培训资料更新成功'
        });
    } catch (error) {
        console.error('更新培训资料错误:', error);
        res.status(500).json({
            success: false,
            message: '更新培训资料失败'
        });
    }
};

// 删除培训资料
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        const success = await trainingMaterialModel.remove(id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '培训资料不存在'
            });
        }
        
        res.json({
            success: true,
            message: '培训资料删除成功'
        });
    } catch (error) {
        console.error('删除培训资料错误:', error);
        res.status(500).json({
            success: false,
            message: '删除培训资料失败'
        });
    }
};

// 上传辅导材料附件
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请上传文件'
            });
        }
        
        res.json({
            success: true,
            message: '文件上传成功',
            data: {
                path: `/uploads/${req.file.filename}`,
                filename: req.file.filename
            }
        });
    } catch (error) {
        console.error('上传文件错误:', error);
        res.status(500).json({
            success: false,
            message: '上传失败'
        });
    }
};

module.exports = {
    getAll,
    getPublished,
    getById,
    create,
    update,
    remove,
    uploadFile
};
