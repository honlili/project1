/**
 * 学生端报名考试页面
 */
import { Form, Input, Button, Card, message, Select, Tag } from 'antd';
import { BookOutlined, SendOutlined } from '@ant-design/icons';

const { Option } = Select;

const StudentApply = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 模拟证书列表
    const certificateOptions = [
        { value: '1', label: '全国计算机等级考试二级', type: '专业', required: true },
        { value: '2', label: '软件设计师（中级）', type: '人社', required: true },
        { value: '3', label: '网络工程师（中级）', type: '人社', required: true },
        { value: '4', label: 'Python编程基础', type: '校内', required: false },
        { value: '5', label: 'Web前端开发', type: '校内', required: false },
    ];
    
    const handleSubmit = (values) => {
        message.success(`报名成功！\n证书：${values.certificate}\n成绩：${values.score}分`);
    };
    
    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">报名考试</h2>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    学生：{user.name} ({user.username})
                </p>
            </div>
            
            <Card title="证书考试报名" className="form-container">
                <Form
                    name="apply-form"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        label="选择证书"
                        name="certificate"
                        rules={[{ required: true, message: '请选择要报名的证书' }]}
                    >
                        <Select placeholder="请选择证书">
                            {certificateOptions.map((cert) => (
                                <Option key={cert.value} value={cert.label}>
                                    {cert.label} 
                                    <Tag color={cert.type === '人社' ? 'blue' : cert.type === '专业' ? 'green' : 'orange'}>
                                        {cert.type}
                                    </Tag>
                                    {cert.required && <Tag color="red">必考</Tag>}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="考试成绩"
                        name="score"
                        rules={[
                            { required: true, message: '请输入成绩' },
                            { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间' }
                        ]}
                    >
                        <Input 
                            type="number" 
                            placeholder="请输入考试成绩（0-100分）"
                            prefix={<BookOutlined />}
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block
                            icon={<SendOutlined />}
                            size="large"
                        >
                            提交报名
                        </Button>
                    </Form.Item>
                </Form>
                
                <div style={{ marginTop: '24px', padding: '16px', background: '#fffbe6', borderRadius: '4px' }}>
                    <h4 style={{ marginBottom: '8px', color: '#faad14' }}>AI审核说明</h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        系统会自动对提交的报名进行初审：成绩≥60分自动建议通过，否则标记为待人工审核。
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default StudentApply;
