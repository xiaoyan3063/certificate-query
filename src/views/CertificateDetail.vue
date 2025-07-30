<template>
  <div class="certificate-detail">
    <van-nav-bar
      title="查询结果"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="detail-container">
      <van-cell-group>
        <van-cell title="姓名" :value="certificateInfo.name" />
        <van-cell title="发证年份" :value="certificateInfo.issueYear" />
        <van-cell title="证书编码" :value="certificateInfo.certificateNo" />
        <van-cell title="培训项目" :value="certificateInfo.trainingProject" />
        <van-cell title="培训开始日期" :value="certificateInfo.startDate" />
        <van-cell title="培训结束日期" :value="certificateInfo.endDate" />
        <van-cell title="培训方式" :value="certificateInfo.trainingMethod" />
      </van-cell-group>
      
      <div class="email-form">
        <van-field
          v-model="email"
          label="接收邮箱"
          placeholder="请输入有效邮箱"
          :rules="[
            { required: true, message: '请填写邮箱地址' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱地址' }
          ]"
        />
        
        <div style="margin: 16px;">
          <van-button 
            round 
            block 
            type="warning" 
            class="send-button"
            :loading="loading"
            loading-text="发送中..."
            @click="sendEmail"
          >
            发送邮件
          </van-button>
          <p class="email-tip">注意：如需电子版，请填写接收邮箱！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCertificateEmail } from '../api'

export default {
  name: 'CertificateDetail',
  data() {
    return {
      certificateInfo: {
        name: '',
        issueYear: '',
        certificateNo: '',
        trainingProject: '',
        startDate: '',
        endDate: '',
        trainingMethod: ''
      },
      email: '',
      loading: false
    }
  },
  created() {
    // 从本地存储获取证书详情数据
    const detailData = localStorage.getItem('certificateDetail')
    if (detailData) {
      this.certificateInfo = JSON.parse(detailData)
    } else {
      // 如果没有数据，返回查询页面
      this.$toast.fail('未找到证书信息，请重新查询')
      this.$router.push('/')
    }
  },
  methods: {
    onClickLeft() {
      // 返回上一页
      this.$router.go(-1)
    },
    sendEmail() {
      if (!this.validateEmail(this.email)) {
        this.$toast.fail('请输入有效的邮箱地址')
        return
      }
      
      this.loading = true
      // 使用API服务发送邮件
      sendCertificateEmail(this.email, this.certificateInfo)
        .then(() => {
          this.$toast.success('邮件发送成功')
        })
        .catch(error => {
          this.$toast.fail('邮件发送失败，请稍后重试')
          console.error('邮件发送失败:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>

<style scoped>
.certificate-detail {
  height: 100vh;
  background-color: #f7f8fa;
}

.detail-container {
  padding: 20px;
}

.email-form {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 0;
}

.email-tip {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 0;
}
/deep/ .van-field__label{
    color: #323233;
}
</style>