<template>
  <div class="certificate-detail">
    <van-nav-bar
      title="查询结果"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="detail-container">
      <van-cell-group>
        <van-cell title="姓名" :value="certificateInfo.StudentName || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="发证年份" :value="certificateInfo.Year || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="证书编码" :value="certificateInfo.CertificateCode || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训项目" :value="certificateInfo.TrainingProject || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训开始日期" :value="certificateInfo.TrainingStartDate || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训结束日期" :value="certificateInfo.TrainingEndDate || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="培训方式" :value="certificateInfo.TrainingMethod || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="证书有效期" :value="certificateInfo.ExpirationDate || '暂无'" label-class="cell-title" value-class="cell-value" />
        <van-cell title="学员邮箱" :value="certificateInfo.StudentEmail || '暂无'" label-class="cell-title" value-class="cell-value" />
      </van-cell-group>
      
      <div class="button-container">
        <van-button 
          block 
          type="warning" 
          class="send-button"
          @click="showEmailConfirmDialog"
        >
          发送邮件
        </van-button>
      </div>
    </div>
    
    <!-- 邮件确认弹窗 -->
    <van-dialog
      v-model="showEmailDialog"
      title="发送证书邮件"
      show-cancel-button
      @confirm="confirmSendEmail"
      :before-close="handleBeforeClose"
      cancel-button-text="取消"
      confirm-button-text="发送"
    >
      <div class="email-dialog-content">
        <div class="email-field">
          <span class="field-label"><span class="required">*</span> 收件人</span>
          <input 
            type="text" 
            v-model="email" 
            placeholder="请输入收件人邮箱" 
            class="field-input" 
            :class="{'error-input': emailError}"
          />
          <span v-if="emailError" class="error-message">{{emailErrorMsg}}</span>
        </div>
        <div class="email-field">
          <span class="field-label"><span class="required">*</span> 主题</span>
          <input 
            type="text" 
            v-model="emailSubject" 
            placeholder="邮件主题" 
            class="field-input"
            :class="{'error-input': subjectError}" 
          />
          <span v-if="subjectError" class="error-message">请输入邮件主题</span>
        </div>
        <div class="email-field email-content">
          <span class="field-label">内容</span>
          <textarea v-model="emailContent" placeholder="邮件内容" class="content-textarea"></textarea>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { sendCertificateEmail } from '../api'

export default {
  name: 'CertificateDetail',
  data() {
    return {
      certificateInfo: {
        StudentName: '',
        Year: '',
        CertificateCode: '',
        TrainingProject: '',
        TrainingStartDate: '',
        TrainingEndDate: '',
        TrainingMethod: '',
        ExpirationDate: '',
        StudentEmail: '',
      },
      email: '',
      loading: false,
      showEmailDialog: false,
      emailSubject: '',
      emailContent: '',
      emailError: false,
      emailErrorMsg: '',
      subjectError: false
    }
  },
  created() {
    // 从路由参数获取证书详情数据
    console.log('证书详细数据',this.$route.params.detailData)
    const detailData = this.$route.params.detailData
    if (detailData) {
      this.certificateInfo = detailData
      // 设置默认邮件主题和内容
      this.email = this.certificateInfo.StudentEmail
      this.emailSubject = `${this.certificateInfo.StudentName}的培训证书`
      this.emailContent = `尊敬的${this.certificateInfo.StudentName}：\n\n您好！\n\n附件是您参加"${this.certificateInfo.TrainingProject}"的培训证书电子版，请查收。\n\n祝好！`
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
    // 显示邮件确认对话框
    showEmailConfirmDialog() {
      // if (!this.validateEmail(this.email)) {
      //   this.$toast.fail('请输入有效的邮箱地址')
      //   return
      // }
      
      this.showEmailDialog = true
    },
    // 确认发送邮件
    confirmSendEmail() {
      // 验证表单
      if (!this.validateEmailForm()) {
        return false
      }
      
      this.loading = true
      // 使用API服务发送邮件，传递邮件主题和内容
      sendCertificateEmail(this.email, this.certificateInfo, this.emailSubject, this.emailContent)
        .then(() => {
          this.$toast.success('邮件发送成功')
          this.showEmailDialog = false
        })
        .catch(error => {
          this.$toast.fail('邮件发送失败:'+error.response.data)
          console.error('邮件发送失败:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 处理弹窗关闭前的逻辑
    handleBeforeClose(action, done) {
      if (action === 'confirm') {
        // 如果是确认按钮，验证表单
        if (!this.validateEmailForm()) {
          done(false) // 阻止关闭
          return
        }
      }
      done() // 允许关闭
    },
    // 验证邮件表单
    validateEmailForm() {
      // 重置错误状态
      this.emailError = false;
      this.subjectError = false;
      
      let isValid = true;
      
      // 验证收件人邮箱
      if (!this.email || this.email.trim() === '') {
        this.emailError = true;
        this.emailErrorMsg = '请输入收件人邮箱';
        isValid = false;
      } else if (!this.validateEmail(this.email)) {
        this.emailError = true;
        this.emailErrorMsg = '请输入有效的邮箱地址';
        isValid = false;
      }
      
      // 验证邮件主题
      if (!this.emailSubject || this.emailSubject.trim() === '') {
        this.subjectError = true;
        isValid = false;
      }
      
      return isValid;
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

/* 邮件弹窗样式 */
.email-dialog-content {
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
}

.email-field {
  margin-bottom: 15px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.field-label {
  display: block;
  font-size: 14px;
  color: #323233;
  margin-bottom: 5px;
}

.field-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ebedf0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.email-content {
  margin-bottom: 0;
}

.content-textarea {
  width: 100%;
  height: 180px;
  padding: 8px;
  border: 1px solid #ebedf0;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
}

/* 调整弹窗宽度 */
::v-deep .van-dialog {
  width: 90%;
  max-width: 320px;
}

.required {
  color: #ee0a24;
  margin-right: 2px;
}

.error-input {
  border-color: #ee0a24;
}

.error-message {
  color: #ee0a24;
  font-size: 12px;
  margin-top: 4px;
  display: block;
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
::v-deep .van-dialog__confirm {
    color: white;
    background-color: #fe9120;
    /* #0F59A4; */
}
</style>
