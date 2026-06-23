const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const mockData = {
    classes: [
        { id: 1, name: '2024人工智能1班', grade: '2024', major: '人工智能' },
        { id: 2, name: '2024人工智能2班', grade: '2024', major: '人工智能' },
        { id: 3, name: '2024计算机1班', grade: '2024', major: '计算机科学与技术' },
        { id: 4, name: '2024计算机2班', grade: '2024', major: '计算机科学与技术' },
        { id: 5, name: '2024软件工程1班', grade: '2024', major: '软件工程' },
        { id: 6, name: '2024软件工程2班', grade: '2024', major: '软件工程' },
        { id: 7, name: '2024网络工程1班', grade: '2024', major: '网络工程' },
        { id: 8, name: '2024大数据1班', grade: '2024', major: '数据科学与大数据技术' },
        { id: 9, name: '2024数字媒体1班', grade: '2024', major: '数字媒体技术' },
        { id: 10, name: '2024通信工程1班', grade: '2024', major: '通信工程' }
    ],
    students: [
        { id: 1, student_no: '2023001001', password: '123456', name: '张三', gender: '男', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138001', status: '在读' },
        { id: 2, student_no: '2023001002', password: '123456', name: '李四', gender: '女', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138002', status: '在读' },
        { id: 3, student_no: '2023001003', password: '123456', name: '王五', gender: '男', college: '大数据产业学院', class_name: '2024计算机1班', phone: '13800138003', status: '在读' },
        { id: 4, student_no: '2023001004', password: '123456', name: '赵六', gender: '女', college: '智能产业学院', class_name: '2024人工智能2班', phone: '13800138004', status: '在读' },
        { id: 5, student_no: '2023001005', password: '123456', name: '孙七', gender: '男', college: '现代通信产业学院', class_name: '2024通信工程1班', phone: '13800138005', status: '在读' },
        { id: 6, student_no: '2023001006', password: '123456', name: '周八', gender: '女', college: '游戏产业学院', class_name: '2024数字媒体1班', phone: '13800138006', status: '在读' },
        { id: 7, student_no: '2023001007', password: '123456', name: '吴九', gender: '男', college: '大数据产业学院', class_name: '2024大数据1班', phone: '13800138007', status: '在读' },
        { id: 8, student_no: '2023001008', password: '123456', name: '郑十', gender: '女', college: '智能产业学院', class_name: '2024软件工程1班', phone: '13800138008', status: '在读' },
        { id: 9, student_no: '2023001009', password: '123456', name: '陈一', gender: '男', college: '数字金融产业学院', class_name: '2024计算机2班', phone: '13800138009', status: '在读' },
        { id: 10, student_no: '2023001010', password: '123456', name: '林二', gender: '女', college: '智能产业学院', class_name: '2024软件工程2班', phone: '13800138010', status: '在读' },
        { id: 11, student_no: '2023001011', password: '123456', name: '黄三', gender: '男', college: '未来技术产业学院', class_name: '2024网络工程1班', phone: '13800138011', status: '在读' },
        { id: 12, student_no: '2023001012', password: '123456', name: '刘四', gender: '女', college: '智能建造产业学院', class_name: '2024人工智能2班', phone: '13800138012', status: '在读' }
    ],
    certificates: [
        { id: 1, name: '全国计算机等级考试二级', type: '人社', is_required: 1, issuing_authority: '教育部考试中心', status: '启用' },
        { id: 2, name: '软件设计师（中级）', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 3, name: '普通话水平测试二级甲等', type: '校内', is_required: 1, issuing_authority: '学校语言文字工作委员会', status: '启用' },
        { id: 4, name: '大学英语四级（CET-4）', type: '专业', is_required: 1, issuing_authority: '教育部高等教育司', status: '启用' },
        { id: 5, name: '大学英语六级（CET-6）', type: '专业', is_required: 0, issuing_authority: '教育部高等教育司', status: '启用' },
        { id: 6, name: '网络工程师（中级）', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 7, name: '数据库系统工程师（中级）', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 8, name: '计算机程序设计员（高级）', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 9, name: '人工智能训练师', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 10, name: '信息安全管理师', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 11, name: '校内英语应用能力A级', type: '校内', is_required: 1, issuing_authority: '学校外语教学部', status: '启用' },
        { id: 12, name: '校内创新创业实践证书', type: '校内', is_required: 1, issuing_authority: '学校创新创业学院', status: '启用' }
    ],
    registrations: [
        // 张三 - 已通过2项
        { id: 1, student_id: 1, student_no: '2023001001', student_name: '张三', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 85, ai_review_result: 'pass', ai_review_reason: '成绩85分，大于等于60分，自动通过', apply_date: '2024-03-15 10:30:00' },
        { id: 2, student_id: 1, student_no: '2023001001', student_name: '张三', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 3, certificate_name: '普通话水平测试二级甲等', certificate_type: '校内', status: '已通过', score: 90, ai_review_result: 'pass', ai_review_reason: '成绩90分，大于等于60分，自动通过', apply_date: '2024-03-05 09:00:00' },
        // 李四 - 已通过1项，待审核1项，已驳回1项
        { id: 3, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 2, certificate_name: '软件设计师（中级）', certificate_type: '人社', status: '待审核', score: 72, ai_review_result: 'pass', ai_review_reason: '成绩72分，大于等于60分，建议通过', apply_date: '2024-04-16 14:20:00' },
        { id: 4, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '已驳回', score: 410, ai_review_result: 'fail', ai_review_reason: '四级需425分以上，成绩410分未达标', apply_date: '2024-04-18 11:00:00' },
        { id: 5, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 11, certificate_name: '校内英语应用能力A级', certificate_type: '校内', status: '已通过', score: 78, ai_review_result: 'pass', ai_review_reason: '成绩78分，大于等于60分，自动通过', apply_date: '2024-02-20 08:30:00' },
        // 王五 - 待审核2项
        { id: 6, student_id: 3, student_no: '2023001003', student_name: '王五', college: '大数据产业学院', class_name: '2024计算机1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '待审核', score: 55, ai_review_result: 'pending', ai_review_reason: '成绩55分，低于60分，需人工审核', apply_date: '2024-05-17 09:15:00' },
        { id: 7, student_id: 3, student_no: '2023001003', student_name: '王五', college: '大数据产业学院', class_name: '2024计算机1班', certificate_id: 7, certificate_name: '数据库系统工程师（中级）', certificate_type: '人社', status: '待审核', score: 48, ai_review_result: 'pending', ai_review_reason: '成绩48分，低于60分，需人工审核', apply_date: '2024-05-20 16:00:00' },
        // 赵六 - 已通过3项
        { id: 8, student_id: 4, student_no: '2023001004', student_name: '赵六', college: '智能产业学院', class_name: '2024人工智能2班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 92, ai_review_result: 'pass', ai_review_reason: '成绩92分，大于等于60分，自动通过', apply_date: '2024-03-10 10:00:00' },
        { id: 9, student_id: 4, student_no: '2023001004', student_name: '赵六', college: '智能产业学院', class_name: '2024人工智能2班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '已通过', score: 512, ai_review_result: 'pass', ai_review_reason: '成绩512分，大于等于425分，自动通过', apply_date: '2024-04-02 09:45:00' },
        { id: 10, student_id: 4, student_no: '2023001004', student_name: '赵六', college: '智能产业学院', class_name: '2024人工智能2班', certificate_id: 8, certificate_name: '计算机程序设计员（高级）', certificate_type: '人社', status: '已通过', score: 88, ai_review_result: 'pass', ai_review_reason: '成绩88分，大于等于60分，自动通过', apply_date: '2024-05-08 14:30:00' },
        // 孙七 - 已通过1项，已驳回1项
        { id: 11, student_id: 5, student_no: '2023001005', student_name: '孙七', college: '现代通信产业学院', class_name: '2024通信工程1班', certificate_id: 6, certificate_name: '网络工程师（中级）', certificate_type: '人社', status: '已通过', score: 76, ai_review_result: 'pass', ai_review_reason: '成绩76分，大于等于60分，自动通过', apply_date: '2024-04-25 10:20:00' },
        { id: 12, student_id: 5, student_no: '2023001005', student_name: '孙七', college: '现代通信产业学院', class_name: '2024通信工程1班', certificate_id: 5, certificate_name: '大学英语六级（CET-6）', certificate_type: '专业', status: '已驳回', score: 398, ai_review_result: 'fail', ai_review_reason: '六级需425分以上，成绩398分未达标', apply_date: '2024-05-12 15:10:00' },
        // 周八 - 已通过2项，待审核1项
        { id: 13, student_id: 6, student_no: '2023001006', student_name: '周八', college: '游戏产业学院', class_name: '2024数字媒体1班', certificate_id: 3, certificate_name: '普通话水平测试二级甲等', certificate_type: '校内', status: '已通过', score: 87, ai_review_result: 'pass', ai_review_reason: '成绩87分，大于等于60分，自动通过', apply_date: '2024-03-22 09:00:00' },
        { id: 14, student_id: 6, student_no: '2023001006', student_name: '周八', college: '游戏产业学院', class_name: '2024数字媒体1班', certificate_id: 12, certificate_name: '校内创新创业实践证书', certificate_type: '校内', status: '已通过', score: 95, ai_review_result: 'pass', ai_review_reason: '成绩95分，大于等于60分，自动通过', apply_date: '2024-04-10 11:00:00' },
        { id: 15, student_id: 6, student_no: '2023001006', student_name: '周八', college: '游戏产业学院', class_name: '2024数字媒体1班', certificate_id: 9, certificate_name: '人工智能训练师', certificate_type: '人社', status: '待审核', score: 63, ai_review_result: 'pass', ai_review_reason: '成绩63分，大于等于60分，建议通过', apply_date: '2024-05-25 08:40:00' },
        // 吴九 - 已通过1项，待审核1项，已驳回1项
        { id: 16, student_id: 7, student_no: '2023001007', student_name: '吴九', college: '大数据产业学院', class_name: '2024大数据1班', certificate_id: 7, certificate_name: '数据库系统工程师（中级）', certificate_type: '人社', status: '已通过', score: 82, ai_review_result: 'pass', ai_review_reason: '成绩82分，大于等于60分，自动通过', apply_date: '2024-04-08 09:30:00' },
        { id: 17, student_id: 7, student_no: '2023001007', student_name: '吴九', college: '大数据产业学院', class_name: '2024大数据1班', certificate_id: 10, certificate_name: '信息安全管理师', certificate_type: '人社', status: '待审核', score: 58, ai_review_result: 'pending', ai_review_reason: '成绩58分，低于60分，需人工审核', apply_date: '2024-05-15 10:00:00' },
        { id: 18, student_id: 7, student_no: '2023001007', student_name: '吴九', college: '大数据产业学院', class_name: '2024大数据1班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '已驳回', score: 380, ai_review_result: 'fail', ai_review_reason: '四级需425分以上，成绩380分未达标', apply_date: '2024-05-28 14:00:00' },
        // 郑十 - 已通过2项
        { id: 19, student_id: 8, student_no: '2023001008', student_name: '郑十', college: '智能产业学院', class_name: '2024软件工程1班', certificate_id: 2, certificate_name: '软件设计师（中级）', certificate_type: '人社', status: '已通过', score: 79, ai_review_result: 'pass', ai_review_reason: '成绩79分，大于等于60分，自动通过', apply_date: '2024-03-28 11:20:00' },
        { id: 20, student_id: 8, student_no: '2023001008', student_name: '郑十', college: '智能产业学院', class_name: '2024软件工程1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 94, ai_review_result: 'pass', ai_review_reason: '成绩94分，大于等于60分，自动通过', apply_date: '2024-04-15 13:45:00' },
        // 陈一 - 待审核1项，已驳回1项
        { id: 21, student_id: 9, student_no: '2023001009', student_name: '陈一', college: '数字金融产业学院', class_name: '2024计算机2班', certificate_id: 8, certificate_name: '计算机程序设计员（高级）', certificate_type: '人社', status: '待审核', score: 61, ai_review_result: 'pass', ai_review_reason: '成绩61分，大于等于60分，建议通过', apply_date: '2024-05-18 15:45:00' },
        { id: 22, student_id: 9, student_no: '2023001009', student_name: '陈一', college: '数字金融产业学院', class_name: '2024计算机2班', certificate_id: 5, certificate_name: '大学英语六级（CET-6）', certificate_type: '专业', status: '已驳回', score: 310, ai_review_result: 'fail', ai_review_reason: '六级需425分以上，成绩310分未达标', apply_date: '2024-05-22 09:00:00' },
        // 林二 - 已通过3项
        { id: 23, student_id: 10, student_no: '2023001010', student_name: '林二', college: '智能产业学院', class_name: '2024软件工程2班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 88, ai_review_result: 'pass', ai_review_reason: '成绩88分，大于等于60分，自动通过', apply_date: '2024-03-12 08:00:00' },
        { id: 24, student_id: 10, student_no: '2023001010', student_name: '林二', college: '智能产业学院', class_name: '2024软件工程2班', certificate_id: 7, certificate_name: '数据库系统工程师（中级）', certificate_type: '人社', status: '已通过', score: 91, ai_review_result: 'pass', ai_review_reason: '成绩91分，大于等于60分，自动通过', apply_date: '2024-04-20 10:15:00' },
        { id: 25, student_id: 10, student_no: '2023001010', student_name: '林二', college: '智能产业学院', class_name: '2024软件工程2班', certificate_id: 3, certificate_name: '普通话水平测试二级甲等', certificate_type: '校内', status: '已通过', score: 86, ai_review_result: 'pass', ai_review_reason: '成绩86分，大于等于60分，自动通过', apply_date: '2024-04-05 14:30:00' },
        // 黄三 - 已通过1项，待审核1项
        { id: 26, student_id: 11, student_no: '2023001011', student_name: '黄三', college: '未来技术产业学院', class_name: '2024网络工程1班', certificate_id: 6, certificate_name: '网络工程师（中级）', certificate_type: '人社', status: '已通过', score: 83, ai_review_result: 'pass', ai_review_reason: '成绩83分，大于等于60分，自动通过', apply_date: '2024-04-12 08:50:00' },
        { id: 27, student_id: 11, student_no: '2023001011', student_name: '黄三', college: '未来技术产业学院', class_name: '2024网络工程1班', certificate_id: 10, certificate_name: '信息安全管理师', certificate_type: '人社', status: '待审核', score: 67, ai_review_result: 'pass', ai_review_reason: '成绩67分，大于等于60分，建议通过', apply_date: '2024-05-30 11:00:00' },
        // 刘四 - 已通过2项
        { id: 28, student_id: 12, student_no: '2023001012', student_name: '刘四', college: '智能建造产业学院', class_name: '2024人工智能2班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '已通过', score: 556, ai_review_result: 'pass', ai_review_reason: '成绩556分，大于等于425分，自动通过', apply_date: '2024-03-18 09:20:00' },
        { id: 29, student_id: 12, student_no: '2023001012', student_name: '刘四', college: '智能建造产业学院', class_name: '2024人工智能2班', certificate_id: 12, certificate_name: '校内创新创业实践证书', certificate_type: '校内', status: '已通过', score: 88, ai_review_result: 'pass', ai_review_reason: '成绩88分，大于等于60分，自动通过', apply_date: '2024-04-22 10:00:00' },
        // 额外：已驳回记录
        { id: 30, student_id: 3, student_no: '2023001003', student_name: '王五', college: '大数据产业学院', class_name: '2024计算机1班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '已驳回', score: 395, ai_review_result: 'fail', ai_review_reason: '四级需425分以上，成绩395分未达标', apply_date: '2024-05-05 16:30:00' },
        // === 新增待审核记录 ===
        { id: 31, student_id: 1, student_no: '2023001001', student_name: '张三', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 9, certificate_name: '人工智能训练师', certificate_type: '人社', status: '待审核', score: 57, ai_review_result: 'pending', ai_review_reason: '成绩57分，低于60分，需人工审核', apply_date: '2024-06-02 10:00:00' },
        { id: 32, student_id: 4, student_no: '2023001004', student_name: '赵六', college: '智能产业学院', class_name: '2024人工智能2班', certificate_id: 12, certificate_name: '校内创新创业实践证书', certificate_type: '校内', status: '待审核', score: 54, ai_review_result: 'pending', ai_review_reason: '成绩54分，低于60分，需人工审核', apply_date: '2024-06-03 09:30:00' },
        { id: 33, student_id: 5, student_no: '2023001005', student_name: '孙七', college: '现代通信产业学院', class_name: '2024通信工程1班', certificate_id: 10, certificate_name: '信息安全管理师', certificate_type: '人社', status: '待审核', score: 52, ai_review_result: 'pending', ai_review_reason: '成绩52分，低于60分，需人工审核', apply_date: '2024-06-04 14:00:00' },
        { id: 34, student_id: 8, student_no: '2023001008', student_name: '郑十', college: '智能产业学院', class_name: '2024软件工程1班', certificate_id: 5, certificate_name: '大学英语六级（CET-6）', certificate_type: '专业', status: '待审核', score: 418, ai_review_result: 'pending', ai_review_reason: '六级需425分以上，成绩418分，接近分数线，建议人工审核', apply_date: '2024-06-05 08:45:00' },
        { id: 35, student_id: 10, student_no: '2023001010', student_name: '林二', college: '智能产业学院', class_name: '2024软件工程2班', certificate_id: 6, certificate_name: '网络工程师（中级）', certificate_type: '人社', status: '待审核', score: 59, ai_review_result: 'pending', ai_review_reason: '成绩59分，低于60分界线，建议人工审核', apply_date: '2024-06-06 11:20:00' },
        { id: 36, student_id: 12, student_no: '2023001012', student_name: '刘四', college: '智能建造产业学院', class_name: '2024人工智能2班', certificate_id: 7, certificate_name: '数据库系统工程师（中级）', certificate_type: '人社', status: '待审核', score: 51, ai_review_result: 'pending', ai_review_reason: '成绩51分，低于60分，需人工审核', apply_date: '2024-06-07 15:10:00' },
        { id: 37, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 9, certificate_name: '人工智能训练师', certificate_type: '人社', status: '待审核', score: 62, ai_review_result: 'pass', ai_review_reason: '成绩62分，大于等于60分，建议通过', apply_date: '2024-06-08 09:00:00' },
        { id: 38, student_id: 6, student_no: '2023001006', student_name: '周八', college: '游戏产业学院', class_name: '2024数字媒体1班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '待审核', score: 420, ai_review_result: 'pending', ai_review_reason: '四级需425分以上，成绩420分，接近及格线，建议人工审核', apply_date: '2024-06-09 10:30:00' },
        { id: 39, student_id: 9, student_no: '2023001009', student_name: '陈一', college: '数字金融产业学院', class_name: '2024计算机2班', certificate_id: 3, certificate_name: '普通话水平测试二级甲等', certificate_type: '校内', status: '待审核', score: 56, ai_review_result: 'pending', ai_review_reason: '成绩56分，低于60分，需人工审核', apply_date: '2024-06-10 13:45:00' },
        { id: 40, student_id: 11, student_no: '2023001011', student_name: '黄三', college: '未来技术产业学院', class_name: '2024网络工程1班', certificate_id: 4, certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', status: '待审核', score: 415, ai_review_result: 'pending', ai_review_reason: '四级需425分以上，成绩415分，建议人工审核', apply_date: '2024-06-11 16:00:00' },
        // === 新增已驳回记录 ===
        { id: 41, student_id: 4, student_no: '2023001004', student_name: '赵六', college: '智能产业学院', class_name: '2024人工智能2班', certificate_id: 5, certificate_name: '大学英语六级（CET-6）', certificate_type: '专业', status: '已驳回', score: 325, ai_review_result: 'fail', ai_review_reason: '六级需425分以上，成绩325分未达标', apply_date: '2024-06-01 08:00:00' },
        { id: 42, student_id: 8, student_no: '2023001008', student_name: '郑十', college: '智能产业学院', class_name: '2024软件工程1班', certificate_id: 6, certificate_name: '网络工程师（中级）', certificate_type: '人社', status: '已驳回', score: 38, ai_review_result: 'fail', ai_review_reason: '成绩38分，远低于60分，不予通过', apply_date: '2024-06-08 14:30:00' }
    ],
    trainingMaterials: [
        { id: 1, title: 'Python编程入门教程', material_type: '视频', category: '编程基础', description: '从零开始学习Python编程，适合零基础学员', views: 1256, upload_time: '2024-01-10' },
        { id: 2, title: '全国计算机等级考试二级备考指南', material_type: '文档', category: '考试辅导', description: '详细的考试大纲解读和备考建议', views: 892, upload_time: '2024-01-08' },
        { id: 3, title: '软件设计师考试真题解析', material_type: '文档', category: '考试辅导', description: '历年真题详解，帮助考生熟悉考试形式', views: 654, upload_time: '2024-01-05' },
        { id: 4, title: '数据库基础教程', material_type: '视频', category: '编程基础', description: 'SQL语言入门到精通，掌握数据库操作', views: 987, upload_time: '2024-01-03' },
        { id: 5, title: 'Web前端开发实战', material_type: '视频', category: '编程基础', description: 'HTML、CSS、JavaScript实战项目教学', views: 1123, upload_time: '2023-12-28' },
        { id: 6, title: '证书考试常见问题解答', material_type: '文档', category: '考试辅导', description: '考生常见问题汇总及解答', views: 445, upload_time: '2023-12-25' },
        { id: 7, title: '大学英语四级真题精讲（2023年）', material_type: '文档', category: '外语学习', description: '2023年CET-4真题及详细答案解析', views: 1680, upload_time: '2024-02-15' },
        { id: 8, title: '网络工程师考试大纲与重点', material_type: '文档', category: '考试辅导', description: '网络工程师中级考试核心知识点梳理', views: 723, upload_time: '2024-02-20' },
        { id: 9, title: '人工智能基础与实践', material_type: '视频', category: '编程基础', description: '机器学习、深度学习入门及项目实战', views: 1356, upload_time: '2024-03-01' },
        { id: 10, title: '普通话水平测试朗读60篇', material_type: '音频', category: '语言技能', description: '普通话测试标准朗读素材，含拼音标注', views: 890, upload_time: '2024-03-10' },
        { id: 11, title: '信息安全入门到精通', material_type: '视频', category: '编程基础', description: '网络安全基础、渗透测试、防护体系', views: 654, upload_time: '2024-03-18' },
        { id: 12, title: '创新创业项目申报指南', material_type: '文档', category: '综合', description: '大学生创新创业项目立项、申报流程详解', views: 432, upload_time: '2024-04-01' }
    ]
};

let userToken = null;

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '服务运行正常（演示模式）' });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        userToken = 'demo-token-' + Date.now();
        res.json({
            success: true,
            data: {
                token: userToken,
                user: { id: 1, username: 'admin', name: '管理员', role: '超级管理员' }
            }
        });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

app.get('/api/auth/me', (req, res) => {
    res.json({
        success: true,
        data: { id: 1, username: 'admin', name: '管理员', role: '超级管理员' }
    });
});

// 学生端账号密码登录
app.post('/api/auth/student-login', (req, res) => {
    const { student_no, password } = req.body || {};
    if (!student_no || !password) {
        return res.status(400).json({ success: false, message: '请输入学号和密码' });
    }
    const student = mockData.students.find((s) => s.student_no === student_no);
    if (!student) {
        return res.status(401).json({ success: false, message: '学号不存在' });
    }
    if (student.password !== password) {
        return res.status(401).json({ success: false, message: '密码错误' });
    }
    const token = 'student-token-' + Date.now();
    res.json({
        success: true,
        data: {
            token,
            user: {
                id: student.id,
                student_no: student.student_no,
                name: student.name,
                gender: student.gender,
                college: student.college,
                class_name: student.class_name,
                phone: student.phone,
                role: 'student'
            }
        }
    });
});

// ===================== 学生端 API =====================
// 1. 学生仪表板数据
app.get('/api/student/dashboard', (req, res) => {
    const studentNo = req.query.student_no;
    const student = mockData.students.find((s) => s.student_no === studentNo);
    if (!student) {
        return res.status(404).json({ success: false, message: '学生不存在' });
    }
    const myRegs = mockData.registrations.filter((r) => r.student_no === studentNo);
    const total = myRegs.length;
    const passed = myRegs.filter((r) => r.status === '已通过').length;
    const pending = myRegs.filter((r) => r.status === '待审核').length;
    const rejected = myRegs.filter((r) => r.status === '已驳回').length;
    const passRate = total === 0 ? 0 : Math.round((passed / total) * 1000) / 10;

    res.json({
        success: true,
        data: {
            student: {
                id: student.id,
                student_no: student.student_no,
                name: student.name,
                gender: student.gender,
                college: student.college,
                class_name: student.class_name,
                phone: student.phone
            },
            stats: {
                total_registrations: total,
                passed_count: passed,
                pending_count: pending,
                rejected_count: rejected,
                pass_rate: passRate
            },
            recent: myRegs
                .sort((a, b) => String(b.apply_date || '').localeCompare(String(a.apply_date || '')))
                .slice(0, 5)
        }
    });
});

// 2. 我的证书（已通过 + 其他状态报名）
app.get('/api/student/certificates', (req, res) => {
    const studentNo = req.query.student_no;
    const myRegs = mockData.registrations.filter((r) => r.student_no === studentNo);

    const obtained = myRegs
        .filter((r) => r.status === '已通过')
        .map((r) => {
            const cert = mockData.certificates.find((c) => c.id === r.certificate_id);
            return {
                id: r.id,
                certificate_id: r.certificate_id,
                name: r.certificate_name,
                type: r.certificate_type,
                score: r.score,
                issuing_authority: cert ? cert.issuing_authority : '-',
                issue_date: r.apply_date ? (r.apply_date + '').split(' ')[0] : '-',
                status: r.status
            };
        });

    const others = myRegs
        .filter((r) => r.status !== '已通过')
        .map((r) => ({
            id: r.id,
            certificate_id: r.certificate_id,
            name: r.certificate_name,
            type: r.certificate_type,
            score: r.score,
            status: r.status,
            apply_date: r.apply_date,
            ai_review_result: r.ai_review_result,
            ai_review_reason: r.ai_review_reason
        }));

    res.json({
        success: true,
        data: {
            obtained,
            others,
            obtained_cert_ids: obtained.map((o) => o.certificate_id)
        }
    });
});

// 3. 我的报名记录
app.get('/api/student/registrations', (req, res) => {
    const studentNo = req.query.student_no;
    const list = mockData.registrations
        .filter((r) => r.student_no === studentNo)
        .sort((a, b) => String(b.apply_date || '').localeCompare(String(a.apply_date || '')));
    res.json({ success: true, data: list, pagination: { total: list.length, page: 1, pageSize: 100 } });
});

// 4. 可报名证书列表（排除已通过）
app.get('/api/student/available-certificates', (req, res) => {
    const studentNo = req.query.student_no;
    const myRegs = mockData.registrations.filter((r) => r.student_no === studentNo);
    const passedIds = new Set(myRegs.filter((r) => r.status === '已通过').map((r) => r.certificate_id));

    const available = mockData.certificates
        .filter((c) => !passedIds.has(c.id))
        .map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            issuing_authority: c.issuing_authority,
            is_required: c.is_required || 0
        }));
    res.json({ success: true, data: available });
});

// 5. 提交报名
app.post('/api/student/registrations', (req, res) => {
    const { student_no, certificate_id, score, remark } = req.body || {};
    if (!student_no || certificate_id == null || score == null) {
        return res.status(400).json({ success: false, message: '参数不完整（需要 student_no, certificate_id, score）' });
    }
    const student = mockData.students.find((s) => s.student_no === student_no);
    if (!student) {
        return res.status(404).json({ success: false, message: '学生不存在' });
    }
    const cert = mockData.certificates.find((c) => c.id === Number(certificate_id));
    if (!cert) {
        return res.status(400).json({ success: false, message: '证书不存在' });
    }

    const threshold = cert.name.includes('英语四级') ? 425 : 60;
    const passResult = score >= threshold;
    const newReg = {
        id: mockData.registrations.length + 1,
        student_id: student.id,
        student_no: student.student_no,
        student_name: student.name,
        college: student.college,
        class_name: student.class_name,
        certificate_id: cert.id,
        certificate_name: cert.name,
        certificate_type: cert.type,
        status: passResult ? '已通过' : '待审核',
        score: Number(score),
        ai_review_result: passResult ? 'pass' : 'pending',
        ai_review_reason: passResult
            ? `成绩${score}分，大于等于${threshold}分，自动通过`
            : `成绩${score}分，低于${threshold}分，需人工复核`,
        apply_date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        remark: remark || ''
    };
    mockData.registrations.push(newReg);
    res.json({ success: true, message: '报名已提交', data: newReg });
});

// 6. 培训资料（支持关键字搜索）
app.get('/api/student/training', (req, res) => {
    const { keyword } = req.query;
    let list = [...mockData.trainingMaterials];
    if (keyword) {
        const kw = String(keyword).toLowerCase();
        list = list.filter((m) =>
            (m.title || '').toLowerCase().includes(kw) ||
            (m.description || '').toLowerCase().includes(kw)
        );
    }
    list.sort((a, b) => String(b.upload_time || '').localeCompare(String(a.upload_time || '')));
    res.json({
        success: true,
        data: list,
        pagination: { total: list.length, page: 1, pageSize: 50 }
    });
});

// 7. 更新学生个人资料
app.put('/api/student/profile', (req, res) => {
    const { student_no, phone, old_password, new_password } = req.body || {};
    const student = mockData.students.find((s) => s.student_no === student_no);
    if (!student) {
        return res.status(404).json({ success: false, message: '学生不存在' });
    }
    if (phone !== undefined) student.phone = phone;
    if (old_password && new_password) {
        if (student.password !== old_password) {
            return res.status(400).json({ success: false, message: '原密码错误' });
        }
        if (!new_password || String(new_password).length < 6) {
            return res.status(400).json({ success: false, message: '新密码至少6位' });
        }
        student.password = String(new_password);
    }
    res.json({
        success: true,
        message: '更新成功',
        data: {
            id: student.id,
            student_no: student.student_no,
            name: student.name,
            gender: student.gender,
            college: student.college,
            class_name: student.class_name,
            phone: student.phone
        }
    });
});
// ===================== 学生端 API 结束 =====================

// ===================== AI智能问答 API =====================
const aiKnowledgeBase = {
    '报名': {
        keywords: ['报名', '考试', '报考', '申请', '怎么报名', '如何报名', '流程'],
        answer: `📋 **证书考试报名流程**：

1. **登录系统**：使用学号和密码登录学生端
2. **进入报名页面**：点击左侧菜单「报名考试」
3. **选择证书**：在下拉列表中选择要报考的证书（已通过的证书不会显示）
4. **填写成绩**：输入你的考试成绩
5. **提交报名**：点击「提交报名」按钮

> 💡 **提示**：系统会自动进行AI初审，人社/校内/专业证书成绩≥60分自动通过，英语四级≥425分自动通过。`
    },
    '证书类型': {
        keywords: ['证书', '类型', '人社', '校内', '专业', '分类', '哪些证书', '有什么区别'],
        answer: `🏷️ **证书类型说明**：

本系统管理三类证书：

| 类型 | 说明 | 发证机构 |
|------|------|----------|
| **人社** | 国家职业资格证书 | 人力资源和社会保障部 |
| **校内** | 学校内部证书 | 学校各职能部门 |
| **专业** | 专业类证书 | 教育部/行业协会 |

> 📌 部分证书为「必考」类型，毕业前必须通过。`
    },
    '成绩': {
        keywords: ['成绩', '分数', '多少', '及格', '通过', '合格', '分数线'],
        answer: `📊 **成绩与分数线说明**：

- **人社/校内/专业证书**：≥60分即为合格
- **大学英语四级（CET-4）**：≥425分即为通过
- **大学英语六级（CET-6）**：≥425分即为通过

> ⚠️ 提交报名后，系统AI会自动根据分数线判定是否通过。低于分数线的报名将进入「待审核」状态，等待管理员人工复核。`
    },
    '培训资料': {
        keywords: ['培训', '资料', '学习', '课程', '视频', '文档', '备考', '复习', '下载'],
        answer: `📚 **培训资料获取指南**：

1. 点击左侧菜单「培训资料」
2. 可按分类筛选（考试备考、编程基础、语言技能等）
3. 支持按标题关键词搜索
4. 点击「下载」按钮获取资料

> 💡 **推荐备考顺序**：先看考试大纲文档 → 再学习教程视频 → 最后做真题练习。`
    },
    '密码': {
        keywords: ['密码', '修改', '忘记', '修改密码', '改密码', '登录不了'],
        answer: `🔐 **密码相关帮助**：

**修改密码**：
1. 点击左侧菜单「个人设置」
2. 在「修改密码」区域输入原密码和新密码
3. 点击「修改密码」按钮

**忘记密码**：
- 请联系班级辅导员或系统管理员重置密码
- 默认密码为：123456

> ⚠️ 新密码至少6位，建议使用字母+数字组合。`
    },
    '个人信息': {
        keywords: ['个人信息', '资料', '修改', '手机', '电话', '联系电话', '学号', '班级'],
        answer: `👤 **个人信息管理**：

- **可修改**：联系电话（在「个人设置」页面修改）
- **不可修改**：学号、姓名、性别、学院、班级（由管理员统一管理）

如需修改学籍信息，请联系班级辅导员。`
    },
    '必考': {
        keywords: ['必考', '必须', '毕业', '要求', '双证', '条件'],
        answer: `🎯 **双证毕业要求**：

根据学校规定，学生毕业前需取得「双证」：
- 至少一个**人社类**证书
- 至少一个**校内/专业类**证书

系统中标注「必考」的证书，建议优先报考。已通过的所有证书可在「我的证书」页面查看。`
    },
    'default': {
        keywords: [],
        answer: `🤖 **我是双证管理系统AI助手**，可以帮你解答以下问题：

- 📋 证书报名流程
- 🏷️ 证书类型说明
- 📊 成绩与分数线
- 📚 培训资料获取
- 🔐 密码修改
- 👤 个人信息管理
- 🎯 双证毕业要求

请直接输入你的问题，我会尽力帮你解答！如果问题暂时无法解决，请联系管理员。`
    }
};

app.post('/api/student/ai-chat', (req, res) => {
    const { question } = req.body || {};
    if (!question || !question.trim()) {
        return res.status(400).json({ success: false, message: '请输入问题' });
    }

    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, item] of Object.entries(aiKnowledgeBase)) {
        if (key === 'default') continue;
        let score = 0;
        for (const kw of item.keywords) {
            if (q.includes(kw.toLowerCase())) {
                score += kw.length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    const answer = (bestMatch && bestScore > 0) ? bestMatch.answer : aiKnowledgeBase.default.answer;

    // 模拟延迟让体验更真实
    setTimeout(() => {
        res.json({
            success: true,
            data: {
                question: question.trim(),
                answer,
                timestamp: new Date().toISOString()
            }
        });
    }, 600);
});

// 快捷问题推荐
app.get('/api/student/ai-quick-questions', (req, res) => {
    res.json({
        success: true,
        data: [
            '怎么报名证书考试？',
            '证书有哪些类型？',
            '多少分才算及格？',
            '怎么下载培训资料？',
            '如何修改密码？',
            '双证毕业有什么要求？'
        ]
    });
});
// ===================== AI智能问答 API 结束 =====================

app.get('/api/dashboard/stats', (req, res) => {
    const regs = mockData.registrations;
    const approved = regs.filter(r => r.status === '已通过').length;
    const pending = regs.filter(r => r.status === '待审核').length;
    const rejected = regs.filter(r => r.status === '已驳回').length;
    const totalRegs = regs.length;
    res.json({
        success: true,
        data: {
            students: { total: mockData.students.length, active: mockData.students.filter(s => s.status === '在读').length, graduated: 0, suspended: 0 },
            certificates: { total: mockData.certificates.length, renshe: mockData.certificates.filter(c => c.type === '人社').length, zhuanye: mockData.certificates.filter(c => c.type === '专业').length, xiaonei: mockData.certificates.filter(c => c.type === '校内').length },
            registrations: { total: totalRegs, pending, approved, rejected, passRate: totalRegs > 0 ? Math.round(approved / totalRegs * 1000) / 10 : 0 },
            recentRegistrations: mockData.registrations.slice(-5).reverse(),
            certificateRegistrationStats: mockData.certificates.map(c => ({
                certificate_name: c.name, certificate_type: c.type,
                total_registrations: mockData.registrations.filter(r => r.certificate_id === c.id).length,
                passed_count: mockData.registrations.filter(r => r.certificate_id === c.id && r.status === '已通过').length
            }))
        }
    });
});

app.get('/api/classes', (req, res) => {
    res.json({ success: true, data: mockData.classes });
});

app.get('/api/certificates', (req, res) => {
    res.json({ success: true, data: mockData.certificates, pagination: { total: mockData.certificates.length, page: 1, pageSize: 10 } });
});

app.get('/api/certificates/active', (req, res) => {
    res.json({ success: true, data: mockData.certificates });
});

app.post('/api/certificates', (req, res) => {
    const newCert = { ...req.body, id: mockData.certificates.length + 1 };
    mockData.certificates.push(newCert);
    res.json({ success: true, message: '创建成功', data: { id: newCert.id } });
});

app.put('/api/certificates/:id', (req, res) => {
    const index = mockData.certificates.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        mockData.certificates[index] = { ...mockData.certificates[index], ...req.body };
    }
    res.json({ success: true, message: '更新成功' });
});

app.delete('/api/certificates/:id', (req, res) => {
    mockData.certificates = mockData.certificates.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
});

app.get('/api/students', (req, res) => {
    res.json({ success: true, data: mockData.students, pagination: { total: mockData.students.length, page: 1, pageSize: 10 } });
});

app.post('/api/students', (req, res) => {
    const { class_name } = req.body;
    const newStudent = { 
        ...req.body, 
        id: mockData.students.length + 1,
        class_name: class_name || ''
    };
    mockData.students.push(newStudent);
    res.json({ success: true, message: '创建成功', data: { id: newStudent.id } });
});

app.put('/api/students/:id', (req, res) => {
    const index = mockData.students.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        const { class_name } = req.body;
        mockData.students[index] = { 
            ...mockData.students[index], 
            ...req.body,
            class_name: class_name !== undefined ? class_name : mockData.students[index].class_name
        };
    }
    res.json({ success: true, message: '更新成功' });
});

app.delete('/api/students/:id', (req, res) => {
    mockData.students = mockData.students.filter(s => s.id !== parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
});

app.get('/api/registrations', (req, res) => {
    res.json({ success: true, data: mockData.registrations, pagination: { total: mockData.registrations.length, page: 1, pageSize: 10 } });
});

app.get('/api/registrations/:id', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        res.json({ success: true, data: reg });
    } else {
        res.json({ success: false, message: '记录不存在' });
    }
});

app.get('/api/registrations/pending', (req, res) => {
    const pending = mockData.registrations.filter(r => r.status === '待审核');
    res.json({ success: true, data: pending, pagination: { total: pending.length, page: 1, pageSize: 10 } });
});

app.post('/api/registrations/:id/approve', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        reg.status = '已通过';
    }
    res.json({ success: true, message: '审核通过' });
});

app.post('/api/registrations/:id/reject', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        reg.status = '已驳回';
    }
    res.json({ success: true, message: '已驳回' });
});

app.get('/api/archives/classes', (req, res) => {
    res.json({ success: true, data: mockData.classes });
});

app.get('/api/archives/by-class', (req, res) => {
    const classId = parseInt(req.query.class_id);
    const filtered = mockData.registrations.filter(r => r.class_id === classId || classId === 1);
    res.json({ success: true, data: filtered.map(r => ({ ...r, pass_status: r.status === '已通过' ? 1 : 0 })) });
});

app.get('/api/training', (req, res) => {
    res.json({ success: true, data: mockData.trainingMaterials, pagination: { total: mockData.trainingMaterials.length, page: 1, pageSize: 10 } });
});

app.get('/api/external/student-certificates', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== '123456') {
        return res.status(403).json({ success: false, message: 'API Key无效' });
    }
    res.json({
        success: true,
        data: {
            student_id: parseInt(req.query.student_id) || 1,
            total: 2,
            certificates: [
                { certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', score: 85 },
                { certificate_id: 4, certificate_name: '大学英语四级', certificate_type: '专业', score: 450 }
            ]
        }
    });
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('  学生校内双证管理系统 - 演示版');
    console.log('========================================');
    console.log(`  服务地址: http://localhost:${PORT}`);
    console.log('  注意: 这是演示版本，使用内存数据');
    console.log('  账号: admin / admin123');
    console.log('========================================');
    console.log('');
});
