<template>
  <div class="certificate-detail">
    <van-nav-bar
      title="查询结果"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="detail-container">
      <van-cell-group>
        <van-cell title="姓名" :value="certificateInfo.studentName" label-class="cell-title" value-class="cell-value" />
        <van-cell title="发证年份" :value="certificateInfo.year" label-class="cell-title" value-class="cell-value" />
        <van-cell title="证书编码" :value="certificateInfo.certificateCode" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训项目" :value="certificateInfo.trainingProject" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训开始日期" :value="certificateInfo.trainingStartDate" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训结束日期" :value="certificateInfo.trainingEndDate" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训方式" :value="certificateInfo.trainingMethod" label-class="cell-title" value-class="cell-value" />
        <van-cell title="证书有效期" :value="certificateInfo.certificateValidity" label-class="cell-title" value-class="cell-value" />
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
        <p class="email-tip">注意：如需电子版，请填写接收邮箱！</p>
      </div>
      
      <div class="button-container">
        <van-button 
          block 
          type="warning" 
          class="send-button"
          :loading="loading"
          loading-text="发送中..."
          @click="sendEmail"
        >
          发送邮件
        </van-button>
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
        studentName: '',
        year: '',
        certificateCode: '',
        trainingProject: '',
        trainingStartDate: '',
        trainingEndDate: '',
        trainingMethod: '',
        certificateValidity: ''
      },
      email: '',
      loading: false
    }
  },
  created() {
    // 从路由参数获取证书详情数据
    console.log('证书详细数据',this.$route.params.detailData)
    const detailData = this.$route.params.detailData
    if (detailData) {
      this.certificateInfo = detailData
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
  display: flex;
  flex-direction: column;
}

.detail-container {
  padding: 10px 15px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.email-form {
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 5px 0;
}

.email-tip {
  font-size: 12px;
  color: #999;
  text-align: left;
  margin: 4px 0 0 16px;
  padding-bottom: 8px;
}

.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  padding: 0 15px;
  /* box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); */
}

.send-button {
  border-radius: 8px;
  height: 35px;
  font-size: 15px;
  font-weight: 500;
}

::v-deep .van-field__label{
    color: #323233;
}

::v-deep .cell-title {
  font-size: 14px;
  color: #323233;
  font-weight: 700;
  margin-bottom: 4px;
}

::v-deep .van-cell__title {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
}

::v-deep .cell-value {
  font-size: 14px;
  color: #969799;  
}

::v-deep .van-cell {
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 16px 3px 16px;
  border-radius: 8px
}

::v-deep .van-cell__title {
  margin-bottom: 4px;
}

::v-deep .van-cell__value {
  margin-left: 0;
  text-align: left;
}
</style>