/**
 * 成绩归档页面
 */
import React, { useState, useEffect } from 'react';
import {
    Table, Select, Card, Button, Modal, Form, Input, InputNumber,
    DatePicker, Space, message, Tag, Upload
} from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { getClasses, getArchivesByClass, createExamInfo, uploadAttachment } from '../services/archiveService';

const { Option } = Select;

const mockClasses = [
    { id: 1, name: '2024人工智能1班', grade: '2024', major: '人工智能' },
    { id: 2, name: '2024人工智能2班', grade: '2024', major: '人工智能' },
    { id: 3, name: '2024计算机1班', grade: '2024', major: '计算机科学与技术' },
    { id: 4, name: '2024计算机2班', grade: '2024', major: '计算机科学与技术' },
    { id: 5, name: '2024软件工程1班', grade: '2024', major: '软件工程' },
    { id: 6, name: '2024网络工程1班', grade: '2024', major: '网络工程' }
];

const mockArchives = {
    1: [
        { id: 1, student_no: '2023001001', student_name: '张三', certificate_name: '全国计算机等级考试二级', certificate_type: '人社', score: 85, pass_status: 1, certificate_no: 'NCRE2024001', certificate_issue_date: '2024-01-20' },
        { id: 2, student_no: '2023001002', student_name: '李四', certificate_name: '软件设计师（中级）', certificate_type: '人社', score: 72, pass_status: 1, certificate_no: '软考2024002', certificate_issue_date: '2024-01-25' }
    ],
    3: [
        { id: 3, student_no: '2023001003', student_name: '王五', certificate_name: '全国计算机等级考试二级', certificate_type: '人社', score: 55, pass_status: 0, certificate_no: '', certificate_issue_date: '' }
    ],
    2: [],
    4: [],
    5: [],
    6: []
};

const ArchiveManage = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState(mockClasses);
    const [selectedClass, setSelectedClass] = useState(null);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();

    const fetchData = () => {
        if (!selectedClass) {
            message.warning('请先选择班级');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const classKey = String(selectedClass);
            setData(mockArchives[classKey] || []);
            setLoading(false);
        }, 300);
    };

    const handleEdit = (record) => {
        setCurrentRecord(record);
        form.setFieldsValue({
            score: record.score,
            certificate_no: record.certificate_no,
            remark: record.remark
        });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const res = await createExamInfo({
                registration_id: currentRecord.registration_id || currentRecord.id,
                ...values,
                pass_status: values.score >= 60 ? 1 : 0
            });
            if (res.success) {
                message.success('保存成功');
                setModalVisible(false);
                fetchData();
            } else {
                message.error(res.message || '保存失败');
            }
        } catch (error) {
            message.error('保存失败');
        }
    };

    const handleUpload = async (info, record) => {
        if (info.file.status === 'done') {
            const res = info.file.response;
            if (res.success) {
                message.success('上传成功');
                fetchData();
            } else {
                message.error('上传失败');
            }
        }
    };

    const columns = [
        { title: '学号', dataIndex: 'student_no', key: 'student_no' },
        { title: '姓名', dataIndex: 'student_name', key: 'student_name' },
        { title: '证书名称', dataIndex: 'certificate_name', key: 'certificate_name' },
        {
            title: '证书类型',
            dataIndex: 'certificate_type',
            key: 'certificate_type',
            render: (type) => {
                const colorMap = { '人社': 'blue', '专业': 'green', '校内': 'purple' };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            }
        },
        {
            title: '成绩',
            dataIndex: 'score',
            key: 'score',
            render: (score) => score || '-'
        },
        {
            title: '是否通过',
            dataIndex: 'pass_status',
            key: 'pass_status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? '通过' : '未通过'}
                </Tag>
            )
        },
        { title: '证书编号', dataIndex: 'certificate_no', key: 'certificate_no' },
        {
            title: '发放日期',
            dataIndex: 'certificate_issue_date',
            key: 'certificate_issue_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-'
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        录入成绩
                    </Button>
                    <Upload
                        name="file"
                        action={`${process.env.REACT_APP_API_URL}/api/archives/upload`}
                        headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                        data={{ registration_id: record.registration_id || record.id }}
                        onChange={(info) => handleUpload(info, record)}
                        showUploadList={false}
                    >
                        <Button type="link" icon={<UploadOutlined />}>
                            上传成绩单
                        </Button>
                    </Upload>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">成绩归档</h1>
            </div>

            <Card>
                <Space style={{ marginBottom: 16 }}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择班级"
                        value={selectedClass}
                        onChange={setSelectedClass}
                    >
                        {classes.map(c => (
                            <Option key={c.id} value={c.id}>{c.name}</Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={fetchData}
                        disabled={!selectedClass}
                    >
                        查询
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`
                    }}
                />
            </Card>

            <Modal
                title="录入成绩信息"
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="score"
                        label="考试成绩"
                        rules={[{ required: true, message: '请输入成绩' }]}
                    >
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="certificate_no" label="证书编号">
                        <Input placeholder="请输入证书编号" />
                    </Form.Item>

                    <Form.Item name="certificate_issue_date" label="证书发放日期">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={3} placeholder="请输入备注" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ArchiveManage;
