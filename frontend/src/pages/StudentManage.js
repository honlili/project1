/**
 * 学生管理页面
 */
import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, AutoComplete, Space,
    message, Popconfirm, Tag, Card, Upload
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import {
    getStudents, createStudent, updateStudent, deleteStudent,
    importStudents, getStudentStats
} from '../services/studentService';
import * as XLSX from 'xlsx';

const { Option } = Select;

const collegeOptions = [
    { value: '智能产业学院', label: '智能产业学院' },
    { value: '大数据产业学院', label: '大数据产业学院' },
    { value: '现代通信产业学院', label: '现代通信产业学院' },
    { value: '游戏产业学院', label: '游戏产业学院' },
    { value: '数字金融产业学院', label: '数字金融产业学院' },
    { value: '未来技术产业学院', label: '未来技术产业学院' },
    { value: '智能建造产业学院', label: '智能建造产业学院' },
    { value: '数字影视传媒产业学院', label: '数字影视传媒产业学院' },
    { value: '国际学院', label: '国际学院' }
];

const classOptions = [
    { value: '2024人工智能1班', label: '2024人工智能1班' },
    { value: '2024人工智能2班', label: '2024人工智能2班' },
    { value: '2024计算机1班', label: '2024计算机1班' },
    { value: '2024计算机2班', label: '2024计算机2班' },
    { value: '2024软件工程1班', label: '2024软件工程1班' },
    { value: '2024网络工程1班', label: '2024网络工程1班' }
];

const StudentManage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [classes, setClasses] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
        fetchClasses();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getStudents({
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

    const fetchClasses = async () => {
        try {
            const res = await getStudentStats();
            // 简化处理，实际应该有单独的获取班级列表接口
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
            class_id: record.class_id
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteStudent(id);
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
                res = await updateStudent(editingId, values);
            } else {
                res = await createStudent(values);
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

    const handleImport = async (info) => {
        if (info.file.status === 'done') {
            const res = info.file.response;
            if (res.success) {
                message.success(res.message);
                if (res.data?.errors?.length > 0) {
                    Modal.warning({
                        title: '导入警告',
                        content: (
                            <div>
                                {res.data.errors.map((err, i) => <div key={i}>{err}</div>)}
                            </div>
                        )
                    });
                }
                fetchData();
            } else {
                message.error(res.message || '导入失败');
            }
        } else if (info.file.status === 'error') {
            message.error('导入失败');
        }
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                '学号': '2023001001',
                '姓名': '张三',
                '性别': '男',
                '学院': '智能产业学院',
                '班级': '2024人工智能1班',
                '电话': '13800138001',
                '邮箱': 'zhangsan@example.com',
                '状态': '在读'
            },
            {
                '学号': '2023001002',
                '姓名': '李四',
                '性别': '女',
                '学院': '大数据产业学院',
                '班级': '2024计算机1班',
                '电话': '13800138002',
                '邮箱': 'lisi@example.com',
                '状态': '在读'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '学生信息');

        const colWidths = [
            { wch: 12 },
            { wch: 10 },
            { wch: 6 },
            { wch: 18 },
            { wch: 18 },
            { wch: 15 },
            { wch: 25 },
            { wch: 8 }
        ];
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, '学生信息导入模板.xlsx');
        message.success('模板已下载');
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '学号', dataIndex: 'student_no', key: 'student_no' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            width: 60
        },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '班级', dataIndex: 'class_name', key: 'class_name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colorMap = { '在读': 'green', '毕业': 'blue', '休学': 'orange' };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
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
                        title="确定删除此学生吗？"
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
                <h1 className="page-title">学生管理</h1>
            </div>

            <Card>
                <div className="table-actions">
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            新增学生
                        </Button>
                        <Upload
                            name="file"
                            action={`${process.env.REACT_APP_API_URL}/api/students/import`}
                            headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                            onChange={handleImport}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>批量导入</Button>
                        </Upload>
                        <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
                            下载模板
                        </Button>
                    </Space>
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
                title={editingId ? '编辑学生' : '新增学生'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="student_no"
                        label="学号"
                        rules={[{ required: true, message: '请输入学号' }]}
                    >
                        <Input placeholder="请输入学号" disabled={!!editingId} />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>

                    <Form.Item name="gender" label="性别" initialValue="男">
                        <Select>
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="college" label="学院">
                        <Select placeholder="请选择学院">
                            {collegeOptions.map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="class_name" label="班级">
                        <AutoComplete
                            placeholder="请选择班级或直接输入自定义班级"
                            style={{ width: '100%' }}
                            options={classOptions}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name="phone" label="联系电话">
                        <Input placeholder="请输入联系电话" />
                    </Form.Item>

                    <Form.Item name="email" label="邮箱">
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    <Form.Item name="status" label="状态" initialValue="在读">
                        <Select>
                            <Option value="在读">在读</Option>
                            <Option value="毕业">毕业</Option>
                            <Option value="休学">休学</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentManage;
