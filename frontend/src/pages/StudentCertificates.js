import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Spin, Empty } from 'antd';
import { getStudentCertificates, getCurrentStudent } from '../services/authService';

const typeColor = (t) => {
    if (t === '人社') return 'blue';
    if (t === '专业') return 'green';
    if (t === '校内') return 'orange';
    return 'default';
};

const statusColor = (s) => {
    if (s === '已通过') return 'green';
    if (s === '待审核') return 'gold';
    if (s === '已驳回') return 'red';
    return 'default';
};

const StudentCertificates = () => {
    const [loading, setLoading] = useState(true);
    const [obtained, setObtained] = useState([]);
    const [others, setOthers] = useState([]);
    const [student, setStudent] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const certRes = await getStudentCertificates();
            if (certRes && certRes.success) {
                setObtained(certRes.data.obtained || []);
                setOthers(certRes.data.others || []);
            }
            const stuRes = await getCurrentStudent();
            if (stuRes && stuRes.success && stuRes.data) {
                setStudent(stuRes.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const obtainedColumns = [
        { title: '证书名称', dataIndex: 'name', key: 'name', width: 280 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 100, render: (v) => <Tag color={typeColor(v)}>{v}</Tag> },
        { title: '发证机构', dataIndex: 'issuing_authority', key: 'issuing_authority', width: 260 },
        { title: '发证日期', dataIndex: 'issue_date', key: 'issue_date', width: 140 },
        { title: '成绩', dataIndex: 'score', key: 'score', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => <Tag color="green">{v}</Tag> }
    ];

    const othersColumns = [
        { title: '证书名称', dataIndex: 'name', key: 'name', width: 280 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 100, render: (v) => <Tag color={typeColor(v)}>{v}</Tag> },
        { title: '成绩', dataIndex: 'score', key: 'score', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => <Tag color={statusColor(v)}>{v}</Tag> },
        { title: '申请时间', dataIndex: 'apply_date', key: 'apply_date', width: 180 }
    ];

    return (
        <div style={{ padding: 16 }}>
            <Spin spinning={loading} tip="加载中...">
                <div className="page-header" style={{ marginBottom: 16 }}>
                    <h2 className="page-title" style={{ margin: 0 }}>我的证书</h2>
                    <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                        学生：{student?.name || '-'} ({student?.student_no || '-'})
                    </p>
                </div>

                <Card
                    title={<span>✅ 已获得（{obtained.length}）</span>}
                    style={{ marginBottom: 16 }}
                >
                    {obtained.length === 0 ? (
                        <Empty description="暂无已获得证书" />
                    ) : (
                        <Table
                            dataSource={obtained}
                            columns={obtainedColumns}
                            rowKey={(r) => r.id || r.certificate_id}
                            pagination={false}
                            size="middle"
                        />
                    )}
                </Card>

                <Card title={<span>其他状态（{others.length}）</span>}>
                    {others.length === 0 ? (
                        <Empty description="暂无其他状态的报名记录" />
                    ) : (
                        <Table
                            dataSource={others}
                            columns={othersColumns}
                            rowKey={(r) => r.id || r.certificate_id}
                            pagination={false}
                            size="middle"
                        />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default StudentCertificates;
