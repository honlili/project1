import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import { sendAiChat, getAiQuickQuestions } from '../services/authService';

const StudentAiChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [quickQuestions, setQuickQuestions] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // 初始欢迎消息
        setMessages([{
            role: 'ai',
            content: '🤖 你好！我是双证管理系统的AI智能助手，可以帮你解答证书报名、考试流程、成绩查询、培训资料等方面的问题。请随时向我提问！',
            time: formatTime(new Date())
        }]);

        // 加载快捷问题
        (async () => {
            const res = await getAiQuickQuestions();
            if (res && res.success) {
                setQuickQuestions(res.data || []);
            }
        })();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    const sendMessage = async (text) => {
        const question = (text || inputValue).trim();
        if (!question || loading) return;

        const userMsg = { role: 'user', content: question, time: formatTime(new Date()) };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);

        // 添加"正在输入"占位
        setMessages((prev) => [...prev, { role: 'ai', content: '', time: '', typing: true }]);

        try {
            const res = await sendAiChat(question);
            const answer = (res && res.success && res.data)
                ? res.data.answer
                : '抱歉，暂时无法回答你的问题，请稍后再试。';

            // 移除占位，添加真实回答
            setMessages((prev) => {
                const withoutTyping = prev.filter((m) => !m.typing);
                return [...withoutTyping, { role: 'ai', content: answer, time: formatTime(new Date()) }];
            });
        } catch {
            setMessages((prev) => {
                const withoutTyping = prev.filter((m) => !m.typing);
                return [...withoutTyping, { role: 'ai', content: '抱歉，服务暂时不可用，请稍后再试。', time: formatTime(new Date()) }];
            });
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleClear = () => {
        setMessages([{
            role: 'ai',
            content: '🤖 对话已清空，有什么可以帮你的吗？',
            time: formatTime(new Date())
        }]);
    };

    // 简单渲染Markdown内容（支持**粗体**、> 引用、换行）
    const renderContent = (text) => {
        if (!text) return null;
        const lines = text.split('\n');
        return lines.map((line, i) => {
            let result = line;
            // 粗体
            result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            // 引用
            if (result.startsWith('> ')) {
                return (
                    <div key={i} style={{ color: '#8c8c8c', fontStyle: 'italic', borderLeft: '3px solid #d9d9d9', paddingLeft: 8, margin: '4px 0' }}>
                        <span dangerouslySetInnerHTML={{ __html: result.replace(/^> /, '') }} />
                    </div>
                );
            }
            if (result.trim() === '') return <div key={i} style={{ height: 4 }} />;
            return <div key={i}><span dangerouslySetInnerHTML={{ __html: result }} /></div>;
        });
    };

    return (
        <div style={{ padding: '0 0 16px 0' }}>
            <div className="page-header">
                <h2 className="page-title">
                    <RobotOutlined className="title-icon" />
                    AI智能问答
                </h2>
            </div>

            <div className="ai-chat-container">
                {/* 头部 */}
                <div className="ai-chat-header">
                    <div className="ai-avatar">
                        <RobotOutlined />
                    </div>
                    <div className="ai-info">
                        <h3>双证助手 · AI</h3>
                        <p>在线 · 随时为你解答疑问</p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button
                            type="text"
                            size="small"
                            icon={<ClearOutlined />}
                            onClick={handleClear}
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                            清空对话
                        </Button>
                    </div>
                </div>

                {/* 消息列表 */}
                <div className="ai-chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`ai-chat-message ${msg.role}`}>
                            <div className="msg-avatar">
                                {msg.role === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                            </div>
                            <div>
                                <div className="msg-bubble">
                                    {msg.typing ? (
                                        <div className="typing-indicator">
                                            <span /><span /><span />
                                        </div>
                                    ) : (
                                        renderContent(msg.content)
                                    )}
                                </div>
                                {msg.time && <div className="msg-time">{msg.time}</div>}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* 快捷问题 */}
                {quickQuestions.length > 0 && (
                    <div className="ai-quick-questions">
                        {quickQuestions.map((q, i) => (
                            <span
                                key={i}
                                className="quick-btn"
                                onClick={() => sendMessage(q)}
                            >
                                {q}
                            </span>
                        ))}
                    </div>
                )}

                {/* 输入区域 */}
                <div className="ai-chat-input-area">
                    <Input
                        ref={inputRef}
                        placeholder="输入你的问题，按 Enter 发送..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        size="large"
                        style={{ flex: 1 }}
                    />
                    <button
                        className="ai-chat-send-btn"
                        onClick={() => sendMessage()}
                        disabled={!inputValue.trim() || loading}
                    >
                        <SendOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentAiChat;