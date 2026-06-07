/**
 * 证书管理页面
 */
import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, Switch,
    Space, message, Popconfirm, Tag, Card
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getCertificates, createCertificate, updateCertificate, deleteCertificate
} from '../services/certificateService';

const { Option } = Select;

const CertificateManage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCertificates({
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

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteCertificate(id);
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
                res = await updateCertificate(editingId, values);
            } else {
                res = await createCertificate(values);
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

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '证书名称', dataIndex: 'name', key: 'name' },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colorMap = { '人社': 'blue', '专业': 'green', '校内': 'purple' };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            }
        },
        {
            title: '必考',
            dataIndex: 'is_required',
            key: 'is_required',
            render: (val) => <Tag color={val ? 'red' : 'default'}>{val ? '必考' : '选考'}</Tag>
        },
        { title: '发证机构', dataIndex: 'issuing_authority', key: 'issuing_authority' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>
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
                        title="确定删除此证书吗？"
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
                <h1 className="page-title">证书管理</h1>
            </div>

            <Card>
                <div className="table-actions">
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新增证书
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
                title={editingId ? '编辑证书' : '新增证书'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="证书名称"
                        rules={[{ required: true, message: '请输入证书名称' }]}
                    >
                        <Input placeholder="请输入证书名称" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="证书类型"
                        rules={[{ required: true, message: '请选择证书类型' }]}
                    >
                        <Select placeholder="请选择证书类型">
                            <Option value="人社">人社</Option>
                            <Option value="专业">专业</Option>
                            <Option value="校内">校内</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="is_required"
                        label="是否必考"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="必考" unCheckedChildren="选考" />
                    </Form.Item>

                    <Form.Item name="issuing_authority" label="发证机构">
                        <Input placeholder="请输入发证机构" />
                    </Form.Item>

                    <Form.Item name="description" label="证书描述">
                        <Input.TextArea rows={3} placeholder="请输入证书描述" />
                    </Form.Item>

                    <Form.Item name="status" label="状态" initialValue="启用">
                        <Select>
                            <Option value="启用">启用</Option>
                            <Option value="停用">停用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CertificateManage;
