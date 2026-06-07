/**
 * 培训辅导页面
 */
import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, DatePicker, Space,
    message, Popconfirm, Tag, Card, Upload
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
    getTrainingMaterials, createTraining, updateTraining, deleteTraining, uploadTrainingFile
} from '../services/trainingService';
import { getActiveCertificates } from '../services/certificateService';

const { Option } = Select;
const { TextArea } = Input;

const TrainingManage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
        fetchCertificates();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTrainingMaterials({
                page: pagination.current,
                pageSize: pagination.pageSize
            });
            if (res.success) {
                setData(res.data);
                setPagination(prev => ({ ...prev, total: res.pagination.total }));
            }
        } catch (error) {
            message.error('获取数据失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificates = async () => {
        try {
            const res = await getActiveCertificates();
            if (res.success) {
                setCertificates(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            certificate_id: record.certificate_id
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteTraining(id);
            if (res.success) {
                message.success('删除成功');
                fetchData();
            } else {
                message.error(res.message || '删除失败');
            }
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            let res;
            if (editingId) {
                res = await updateTraining(editingId, values);
            } else {
                res = await createTraining(values);
            }
            if (res.success) {
                message.success(editingId ? '更新成功' : '创建成功');
                setModalVisible(false);
                fetchData();
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            message.error('操作失败');
        }
    };

    const handleUpload = async (info) => {
        if (info.file.status === 'done') {
            const res = info.file.response;
            if (res.success) {
                form.setFieldsValue({ file_path: res.data.path });
                message.success('文件上传成功');
            } else {
                message.error('上传失败');
            }
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '标题', dataIndex: 'title', key: 'title' },
        {
            title: '类型',
            dataIndex: 'material_type',
            key: 'material_type',
            render: (type) => {
                const colorMap = { '培训信息': 'blue', '辅导材料': 'green', '考试大纲': 'purple' };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            }
        },
        { title: '关联证书', dataIndex: 'certificate_name', key: 'certificate_name' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colorMap = { '已发布': 'green', '草稿': 'orange', '已下架': 'default' };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        { title: '浏览次数', dataIndex: 'view_count', key: 'view_count' },
        {
            title: '发布日期',
            dataIndex: 'publish_date',
            key: 'publish_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-'
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除此培训资料吗？"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">培训辅导管理</h1>
            </div>

            <Card>
                <div className="table-actions">
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        发布培训信息
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({ ...prev, current: page, pageSize }));
                        }
                    }}
                />
            </Card>

            <Modal
                title={editingId ? '编辑培训资料' : '发布培训资料'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input placeholder="请输入标题" />
                    </Form.Item>

                    <Form.Item name="material_type" label="资料类型" initialValue="培训信息">
                        <Select>
                            <Option value="培训信息">培训信息</Option>
                            <Option value="辅导材料">辅导材料</Option>
                            <Option value="考试大纲">考试大纲</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="certificate_id" label="关联证书">
                        <Select placeholder="请选择关联证书" allowClear>
                            {certificates.map(c => (
                                <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="content" label="内容">
                        <TextArea rows={6} placeholder="请输入内容描述" />
                    </Form.Item>

                    <Form.Item name="file_path" label="附件">
                        <Space>
                            <Upload
                                name="file"
                                action={`${process.env.REACT_APP_API_URL}/api/training/upload`}
                                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                onChange={handleUpload}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>上传附件</Button>
                            </Upload>
                            <Form.Item name="file_path" noStyle>
                                <Input style={{ width: 200 }} placeholder="或输入文件路径" />
                            </Form.Item>
                        </Space>
                    </Form.Item>

                    <Form.Item name="status" label="状态" initialValue="已发布">
                        <Select>
                            <Option value="已发布">已发布</Option>
                            <Option value="草稿">草稿</Option>
                            <Option value="已下架">已下架</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrainingManage;
