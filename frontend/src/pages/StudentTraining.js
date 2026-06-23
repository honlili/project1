import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Button, Select, Input, Empty, Spin, message } from 'antd';
import { BookOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { getStudentTraining } from '../services/authService';

const { Search } = Input;

const getTypeColor = (t) => {
    if (t === '视频') return 'purple';
    if (t === '文档') return 'blue';
    return 'default';
};

const StudentTraining = () => {
    const [loading, setLoading] = useState(true);
    const [all, setAll] = useState([]);
    const [category, setCategory] = useState('全部');
    const [keyword, setKeyword] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getStudentTraining({ category, keyword });
            if (res && res.success) {
                setAll(res.data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 获取分类列表用于筛选下拉
    const categories = Array.from(new Set([
        '全部',
        ...(all.map((m) => m.category || m.material_type || '其他'))
    ]));

    // 显示数据（前端再过滤，容错）
    const filtered = all.filter((m) => {
        const matchCategory =
            category === '全部' ||
            m.category === category ||
            m.material_type === category;
        const matchKeyword =
            !keyword || (m.title || '').includes(keyword);
        return matchCategory && matchKeyword;
    });

    const onDownload = (item) => {
        // 演示模式：模拟下载提示
        message.success(`已开始下载《${item.title}》`);
    };

    return (
        <div style={{ padding: 16 }}>
            <Spin spinning={loading} tip="加载中...">
                <div className="page-header" style={{ marginBottom: 16 }}>
                    <h2 className="page-title" style={{ margin: 0 }}>培训资料</h2>
                    <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                        各类证书考试培训资料和学习资源
                    </p>
                </div>

                <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>分类：</span>
                        <Select
                            style={{ width: 160 }}
                            value={category}
                            onChange={(v) => setCategory(v)}
                            options={categories.map((c) => ({ value: c, label: c }))}
                        />
                        <Search
                            placeholder="搜索资料标题"
                            allowClear
                            style={{ width: 280 }}
                            onSearch={(v) => setKeyword(v)}
                            onChange={(e) => {
                                if (!e.target.value) setKeyword('');
                            }}
                        />
                        <Button type="primary" onClick={() => fetchData()}>刷新</Button>
                        <span style={{ color: '#999', marginLeft: 'auto' }}>共 {filtered.length} 条</span>
                    </div>
                </Card>

                {filtered.length === 0 ? (
                    <Empty description="暂无匹配的资料" />
                ) : (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
                        dataSource={filtered}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    title={<span>{item.title}</span>}
                                    extra={
                                        <Tag color={getTypeColor(item.material_type || item.type)}>
                                            {item.material_type || item.type || '资料'}
                                        </Tag>
                                    }
                                    actions={[
                                        <Button
                                            type="link"
                                            icon={<DownloadOutlined />}
                                            key="download"
                                            onClick={() => onDownload(item)}
                                        >
                                            下载
                                        </Button>
                                    ]}
                                >
                                    <p style={{ minHeight: 44, color: '#666' }}>
                                        {item.description || `${item.title} 参考学习资料`}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: 12 }}>
                                        <span>浏览量：{item.views || item.view_count || 0}</span>
                                        <span>{item.upload_time || item.apply_date || '-'}</span>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Spin>
        </div>
    );
};

export default StudentTraining;
