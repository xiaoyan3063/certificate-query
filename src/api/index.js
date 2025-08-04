import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 5000
})

// 真实证书查询API
export const queryCertificate = (name, certificateNo) => {
  // 调用真实API接口
  return api.get('/api/td/getCertificate', {
    params: {
      name: name,
      code: certificateNo
    }
  })
}

// 真实发送邮件API
export const sendCertificateEmail = (email, certificateInfo, subject, content) => {
  // 调用真实的邮件发送API
  return api.post('/api/td/sendCertificateEmail', {
    email: email,
    serialNo: certificateInfo.SerialNo,
    subject: subject || `${certificateInfo.StudentName}的培训证书`,
    content: content || `尊敬的${certificateInfo.StudentName}：\n\n您好！\n\n附件是您参加"${certificateInfo.TrainingProject}"的培训证书电子版，请查收。\n\n祝好！`
  })
}

export default api