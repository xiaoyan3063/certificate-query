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
export const sendCertificateEmail = (email, certificateInfo) => {
  // 调用真实的邮件发送API
  return api.post('/api/td/sendCertificateEmail', {
    email: email,
    certificateInfo: certificateInfo
  })
}

export default api