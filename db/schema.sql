-- =============================================
-- 学生校内双证管理系统 数据库设计
-- =============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS double_cert_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE double_cert_db;

-- =============================================
-- 1. 班级表
-- =============================================
DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '班级ID',
    name VARCHAR(100) NOT NULL COMMENT '班级名称',
    grade VARCHAR(50) COMMENT '年级',
    major VARCHAR(100) COMMENT '专业',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='班级表';

-- =============================================
-- 2. 学生表
-- =============================================
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '学生ID',
    student_no VARCHAR(50) NOT NULL UNIQUE COMMENT '学号',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    gender ENUM('男', '女') DEFAULT '男' COMMENT '性别',
    class_id INT COMMENT '班级ID',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    status ENUM('在读', '毕业', '休学') DEFAULT '在读' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';

-- =============================================
-- 3. 证书表
-- =============================================
DROP TABLE IF EXISTS certificates;
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '证书ID',
    name VARCHAR(200) NOT NULL COMMENT '证书名称',
    type ENUM('人社', '专业', '校内') NOT NULL COMMENT '证书类型',
    is_required TINYINT(1) DEFAULT 0 COMMENT '是否必考（0:选考, 1:必考）',
    issuing_authority VARCHAR(200) COMMENT '发证机构',
    description TEXT COMMENT '证书描述',
    status ENUM('启用', '停用') DEFAULT '启用' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='证书表';

-- =============================================
-- 4. 报名规则表
-- =============================================
DROP TABLE IF EXISTS registration_rules;
CREATE TABLE registration_rules (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '规则ID',
    certificate_id INT NOT NULL COMMENT '证书ID',
    min_score DECIMAL(5,2) DEFAULT 60.00 COMMENT '最低通过分数',
    max_applicants INT COMMENT '最大报名人数',
    registration_start DATE COMMENT '报名开始日期',
    registration_end DATE COMMENT '报名结束日期',
    exam_date DATE COMMENT '考试日期',
    fee DECIMAL(10,2) DEFAULT 0.00 COMMENT '报名费用',
    description TEXT COMMENT '规则说明',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报名规则表';

-- =============================================
-- 5. 学生报名表
-- =============================================
DROP TABLE IF EXISTS student_registrations;
CREATE TABLE student_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '报名ID',
    student_id INT NOT NULL COMMENT '学生ID',
    certificate_id INT NOT NULL COMMENT '证书ID',
    score DECIMAL(5,2) COMMENT '考试成绩',
    status ENUM('待审核', '已通过', '已驳回', '待考试', '考试中') DEFAULT '待审核' COMMENT '审核状态',
    ai_review_result VARCHAR(50) COMMENT 'AI审核结果（pass/pending/manual）',
    ai_review_reason TEXT COMMENT 'AI审核原因',
    apply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申请日期',
    reviewed_at TIMESTAMP NULL COMMENT '审核时间',
    reviewed_by INT COMMENT '审核人ID',
    reject_reason TEXT COMMENT '驳回原因',
    attachment_path VARCHAR(500) COMMENT '附件路径（成绩单图片）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生报名表';

-- =============================================
-- 6. 考试信息表
-- =============================================
DROP TABLE IF EXISTS exam_info;
CREATE TABLE exam_info (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '考试信息ID',
    registration_id INT NOT NULL COMMENT '报名ID',
    exam_time DATETIME COMMENT '考试时间',
    exam_location VARCHAR(200) COMMENT '考试地点',
    exam_type ENUM('笔试', '机考', '实操') COMMENT '考试形式',
    score DECIMAL(5,2) COMMENT '考试成绩',
    pass_status TINYINT(1) DEFAULT 0 COMMENT '是否通过（0:未通过, 1:通过）',
    certificate_no VARCHAR(100) COMMENT '证书编号',
    certificate_issue_date DATE COMMENT '证书发放日期',
    remark TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (registration_id) REFERENCES student_registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考试信息表';

-- =============================================
-- 7. 审核记录表
-- =============================================
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '审核记录ID',
    registration_id INT NOT NULL COMMENT '报名ID',
    action ENUM('submit', 'ai_review', 'approve', 'reject', 'modify') NOT NULL COMMENT '操作类型',
    old_status VARCHAR(50) COMMENT '原状态',
    new_status VARCHAR(50) COMMENT '新状态',
    operator_id INT COMMENT '操作人ID（管理员）',
    operator_type ENUM('admin', 'ai', 'student') DEFAULT 'admin' COMMENT '操作人类型',
    reason TEXT COMMENT '操作原因/备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    FOREIGN KEY (registration_id) REFERENCES student_registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审核记录表';

-- =============================================
-- 8. 培训资料表
-- =============================================
DROP TABLE IF EXISTS training_materials;
CREATE TABLE training_materials (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '培训资料ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容描述',
    material_type ENUM('培训信息', '辅导材料', '考试大纲') DEFAULT '培训信息' COMMENT '资料类型',
    certificate_id INT COMMENT '关联证书ID',
    file_path VARCHAR(500) COMMENT '附件路径',
    publish_date DATE COMMENT '发布日期',
    status ENUM('已发布', '草稿', '已下架') DEFAULT '已发布' COMMENT '状态',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    created_by INT COMMENT '创建人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培训资料表';

-- =============================================
-- 9. 管理员用户表
-- =============================================
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '管理员ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    name VARCHAR(100) COMMENT '姓名',
    role ENUM('超级管理员', '审核员', '普通管理员') DEFAULT '普通管理员' COMMENT '角色',
    status TINYINT(1) DEFAULT 1 COMMENT '状态（0:禁用, 1:启用）',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- =============================================
-- 插入初始数据
-- =============================================

-- 插入默认管理员（密码：admin123，实际使用时应该加密）
INSERT INTO admin_users (username, password, name, role) VALUES 
('admin', 'admin123', '系统管理员', '超级管理员'),
('auditor', 'auditor123', '审核员', '审核员');

-- 插入示例班级
INSERT INTO classes (name, grade, major) VALUES 
('计算机2301班', '2023', '计算机科学与技术'),
('计算机2302班', '2023', '计算机科学与技术'),
('软件2301班', '2023', '软件工程'),
('网络2301班', '2023', '网络工程');

-- 插入示例证书
INSERT INTO certificates (name, type, is_required, issuing_authority, description) VALUES 
('全国计算机等级考试二级', '人社', 1, '教育部考试中心', '全国计算机等级考试二级证书'),
('软件设计师（中级）', '人社', 0, '人力资源和社会保障部', '软考中级证书'),
('普通话水平测试二级甲等', '校内', 1, '学校语言文字工作委员会', '普通话水平测试证书'),
('大学英语四级', '专业', 1, '教育部高等教育司', '大学英语四级考试证书'),
('Web前端开发工程师', '专业', 0, '工业和信息化部', 'Web前端开发职业技能等级证书');

-- 插入示例学生
INSERT INTO students (student_no, name, gender, class_id, phone, email, status) VALUES 
('2023001001', '张三', '男', 1, '13800138001', 'zhangsan@example.com', '在读'),
('2023001002', '李四', '女', 1, '13800138002', 'lisi@example.com', '在读'),
('2023001003', '王五', '男', 2, '13800138003', 'wangwu@example.com', '在读'),
('2023002001', '赵六', '女', 3, '13800138004', 'zhaoliu@example.com', '在读'),
('2023003001', '钱七', '男', 4, '13800138005', 'qianqi@example.com', '在读');

-- 插入报名规则
INSERT INTO registration_rules (certificate_id, min_score, max_applicants, registration_start, registration_end, exam_date, fee) VALUES 
(1, 60.00, 100, '2024-01-01', '2024-03-31', '2024-04-15', 120.00),
(2, 45.00, 50, '2024-01-01', '2024-06-30', '2024-07-20', 170.00),
(3, 60.00, 200, '2024-01-01', '2024-12-31', NULL, 25.00),
(4, 425.00, 300, '2024-01-01', '2024-06-15', '2024-06-17', 36.00),
(5, 60.00, 80, '2024-02-01', '2024-05-31', '2024-06-10', 200.00);

-- 插入示例培训资料
INSERT INTO training_materials (title, content, material_type, certificate_id, status) VALUES 
('计算机二级考试培训通知', '2024年上半年全国计算机等级考试培训安排如下...', '培训信息', 1, '已发布'),
('软件设计师考试大纲', '软件设计师（中级）考试大纲及重点内容...', '考试大纲', 2, '已发布'),
('普通话测试辅导材料', '普通话水平测试备考指南及模拟题...', '辅导材料', 3, '已发布');

-- =============================================
-- 创建视图：学生证书获取情况视图
-- =============================================
DROP VIEW IF EXISTS v_student_certificates;
CREATE VIEW v_student_certificates AS
SELECT 
    s.id AS student_id,
    s.student_no,
    s.name AS student_name,
    c.name AS class_name,
    cert.name AS certificate_name,
    cert.type AS certificate_type,
    sr.status AS registration_status,
    ei.score,
    ei.pass_status,
    ei.certificate_no,
    ei.certificate_issue_date
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN student_registrations sr ON s.id = sr.student_id
LEFT JOIN certificates cert ON sr.certificate_id = cert.id
LEFT JOIN exam_info ei ON sr.id = ei.registration_id;

-- =============================================
-- 创建视图：待审核报名视图
-- =============================================
DROP VIEW IF EXISTS v_pending_registrations;
CREATE VIEW v_pending_registrations AS
SELECT 
    sr.id AS registration_id,
    s.student_no,
    s.name AS student_name,
    cl.name AS class_name,
    cert.name AS certificate_name,
    cert.type AS certificate_type,
    sr.status,
    sr.ai_review_result,
    sr.ai_review_reason,
    sr.apply_date,
    sr.score
FROM student_registrations sr
JOIN students s ON sr.student_id = s.id
JOIN certificates cert ON sr.certificate_id = cert.id
LEFT JOIN classes cl ON s.class_id = cl.id
WHERE sr.status = '待审核';

-- =============================================
-- 创建存储过程：统计班级证书获取情况
-- =============================================
DROP PROCEDURE IF EXISTS sp_class_certificate_stats;
DELIMITER //
CREATE PROCEDURE sp_class_certificate_stats(IN p_class_id INT)
BEGIN
    SELECT 
        cert.name AS certificate_name,
        cert.type AS certificate_type,
        cert.is_required,
        COUNT(DISTINCT s.id) AS total_students,
        SUM(CASE WHEN sr.status = '已通过' THEN 1 ELSE 0 END) AS passed_count,
        ROUND(SUM(CASE WHEN sr.status = '已通过' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT s.id), 2) AS pass_rate
    FROM students s
    CROSS JOIN certificates cert
    LEFT JOIN student_registrations sr ON s.id = sr.student_id AND sr.certificate_id = cert.id
    WHERE s.class_id = p_class_id AND s.status = '在读'
    GROUP BY cert.id, cert.name, cert.type, cert.is_required;
END //
DELIMITER ;

-- =============================================
-- 创建索引优化查询
-- =============================================
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_registrations_student ON student_registrations(student_id);
CREATE INDEX idx_registrations_certificate ON student_registrations(certificate_id);
CREATE INDEX idx_registrations_status ON student_registrations(status);
CREATE INDEX idx_exam_info_registration ON exam_info(registration_id);
CREATE INDEX idx_audit_logs_registration ON audit_logs(registration_id);
CREATE INDEX idx_training_certificate ON training_materials(certificate_id);
