import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 5000
})

// 模拟证书查询API
export const queryCertificate = (name, certificateNo) => {
  // 在实际项目中，这里会发送真实的API请求
  // 这里我们模拟API响应
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟返回数据
      resolve({
        data: {
          name: name,
          issueYear: '2017',
          certificateNo: certificateNo,
          trainingProject: '通信电源操作与维护培训',
          startDate: '2017/10/12',
          endDate: '2017/10/17',
          trainingMethod: '面授'
        }
      })
    }, 500)
  })
}

// 模拟发送邮件API
export const sendCertificateEmail = (email, certificateInfo) => {
  // 在实际项目中，这里会发送真实的API请求
  // 这里我们模拟API响应
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      console.log(`邮件已发送至: ${email}`, certificateInfo)
      resolve({
        data: {
          success: true,
          message: '邮件发送成功'
        }
      })
    }, 800)
  })
}

export default api