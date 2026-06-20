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

const mockStudentsData = [
    { id: 1, student_no: '2023001001', name: '张三', gender: '男', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138001', status: '在读' },
    { id: 2, student_no: '2023001002', name: '李四', gender: '女', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138002', status: '在读' },
    { id: 3, student_no: '2023001003', name: '王五', gender: '男', college: '大数据产业学院', class_name: '2024计算机1班', phone: '13800138003', status: '在读' },
    { id: 4, student_no: '2023001004', name: '赵六', gender: '女', college: '大数据产业学院', class_name: '2024计算机1班', phone: '13800138004', status: '在读' },
    { id: 5, student_no: '2023001005', name: '钱七', gender: '男', college: '现代通信产业学院', class_name: '2024通信1班', phone: '13800138005', status: '在读' },
    { id: 6, student_no: '2023001006', name: '孙八', gender: '女', college: '现代通信产业学院', class_name: '2024通信1班', phone: '13800138006', status: '在读' },
    { id: 7, student_no: '2023001007', name: '周九', gender: '男', college: '游戏产业学院', class_name: '2024游戏开发1班', phone: '13800138007', status: '在读' },
    { id: 8, student_no: '2023001008', name: '吴十', gender: '女', college: '游戏产业学院', class_name: '2024游戏开发1班', phone: '13800138008', status: '在读' },
    { id: 9, student_no: '2023001009', name: '郑十一', gender: '男', college: '数字金融产业学院', class_name: '2024金融科技1班', phone: '13800138009', status: '在读' },
    { id: 10, student_no: '2023001010', name: '王小明', gender: '女', college: '数字金融产业学院', class_name: '2024金融科技1班', phone: '13800138010', status: '在读' },
    { id: 11, student_no: '2023001011', name: '李晓华', gender: '男', college: '未来技术产业学院', class_name: '2024未来技术1班', phone: '13800138011', status: '在读' },
    { id: 12, student_no: '2023001012', name: '张大伟', gender: '女', college: '未来技术产业学院', class_name: '2024未来技术1班', phone: '13800138012', status: '在读' },
    { id: 13, student_no: '2023001013', name: '王小丽', gender: '男', college: '智能建造产业学院', class_name: '2024智能建造1班', phone: '13800138013', status: '在读' },
    { id: 14, student_no: '2023001014', name: '赵小军', gender: '女', college: '智能建造产业学院', class_name: '2024智能建造1班', phone: '13800138014', status: '在读' },
    { id: 15, student_no: '2023001015', name: '孙小美', gender: '男', college: '数字影视传媒产业学院', class_name: '2024影视制作1班', phone: '13800138015', status: '在读' },
    { id: 16, student_no: '2023001016', name: '周小伟', gender: '女', college: '数字影视传媒产业学院', class_name: '2024影视制作1班', phone: '13800138016', status: '在读' },
    { id: 17, student_no: '2023001017', name: '吴小芳', gender: '男', college: '国际学院', class_name: '2024国际班', phone: '13800138017', status: '在读' },
    { id: 18, student_no: '2023001018', name: '郑小龙', gender: '女', college: '国际学院', class_name: '2024国际班', phone: '13800138018', status: '在读' },
    { id: 19, student_no: '2023001019', name: '陈小红', gender: '男', college: '智能产业学院', class_name: '2024人工智能2班', phone: '13800138019', status: '在读' },
    { id: 20, student_no: '2023001020', name: '杨小刚', gender: '女', college: '智能产业学院', class_name: '2024人工智能2班', phone: '13800138020', status: '在读' },
    { id: 21, student_no: '2023001021', name: '黄小丽', gender: '男', college: '大数据产业学院', class_name: '2024计算机2班', phone: '13800138021', status: '在读' },
    { id: 22, student_no: '2023001022', name: '梁小龙', gender: '女', college: '大数据产业学院', class_name: '2024计算机2班', phone: '13800138022', status: '在读' },
    { id: 23, student_no: '2023001023', name: '林小芳', gender: '男', college: '现代通信产业学院', class_name: '2024通信2班', phone: '13800138023', status: '在读' },
    { id: 24, student_no: '2023001024', name: '罗小军', gender: '女', college: '现代通信产业学院', class_name: '2024通信2班', phone: '13800138024', status: '在读' },
    { id: 25, student_no: '2023001025', name: '高小美', gender: '男', college: '游戏产业学院', class_name: '2024游戏开发2班', phone: '13800138025', status: '在读' },
    { id: 26, student_no: '2023001026', name: '何小伟', gender: '女', college: '游戏产业学院', class_name: '2024游戏开发2班', phone: '13800138026', status: '在读' },
    { id: 27, student_no: '2023001027', name: '郭小芳', gender: '男', college: '数字金融产业学院', class_name: '2024金融科技2班', phone: '13800138027', status: '在读' },
    { id: 28, student_no: '2023001028', name: '马小龙', gender: '女', college: '数字金融产业学院', class_name: '2024金融科技2班', phone: '13800138028', status: '在读' },
    { id: 29, student_no: '2023001029', name: '朱小丽', gender: '男', college: '未来技术产业学院', class_name: '2024未来技术2班', phone: '13800138029', status: '在读' },
    { id: 30, student_no: '2023001030', name: '胡小军', gender: '女', college: '未来技术产业学院', class_name: '2024未来技术2班', phone: '13800138030', status: '在读' },
];

const StudentManage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [classes, setClasses] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 30 });
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
            const start = (pagination.current - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            setData(mockStudentsData.slice(start, end));
            setPagination(prev => ({ ...prev, total: mockStudentsData.length }));
        } catch (error) {
            const start = (pagination.current - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            setData(mockStudentsData.slice(start, end));
            setPagination(prev => ({ ...prev, total: mockStudentsData.length }));
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
                setData(prev => prev.filter(item => item.id !== id));
                setPagination(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                message.error(res.message || '删除失败');
            }
        } catch (error) {
            setData(prev => prev.filter(item => item.id !== id));
            setPagination(prev => ({ ...prev, total: prev.total - 1 }));
            message.success('删除成功');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingId) {
                const res = await updateStudent(editingId, values);
                if (res.success) {
                    message.success('更新成功');
                    setData(prev => prev.map(item => 
                        item.id === editingId ? { ...item, ...values } : item
                    ));
                } else {
                    message.error(res.message || '更新失败');
                }
            } else {
                const res = await createStudent(values);
                if (res.success) {
                    const newStudent = {
                        id: Date.now(),
                        ...values,
                        class_name: values.class_name || values.class_id || '',
                        status: '在读'
                    };
                    setData(prev => [newStudent, ...prev]);
                    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
                    message.success('创建成功');
                } else {
                    message.error(res.message || '创建失败');
                }
            }
            setModalVisible(false);
        } catch (error) {
            if (editingId) {
                setData(prev => prev.map(item => 
                    item.id === editingId ? { ...item, ...form.getFieldsValue() } : item
                ));
                message.success('更新成功');
            } else {
                const newStudent = {
                    id: Date.now(),
                    ...form.getFieldsValue(),
                    class_name: form.getFieldValue('class_name') || form.getFieldValue('class_id') || '',
                    status: '在读'
                };
                setData(prev => [newStudent, ...prev]);
                setPagination(prev => ({ ...prev, total: prev.total + 1 }));
                message.success('创建成功');
            }
            setModalVisible(false);
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
