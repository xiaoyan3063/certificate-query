<template>
  <div class="certificate-query">
    <van-nav-bar
      title="培训证书查询"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="form-container">
      <van-form @submit="onSubmit">
        <van-field
          v-model="name"
          name="姓名"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
          label-align="top"
          input-align="left"
          class="custom-field"
          style="display: flex; flex-direction: column; align-items: flex-start;"
        >
          <template #input>
            <input 
              v-model="name" 
              placeholder="请输入姓名" 
              style="width: 100%; font-size: 14px; color: #969799; background-color: transparent; border: none; outline: none;"
            />
          </template>
        </van-field>
        <van-field
          v-model="certificateNo"
          name="证书编码"
          label="证书编码"
          placeholder="请输入证书编码"
          :rules="[
            { required: true, message: '请输入证书编码' },
            { validator: validateCertificateNo, message: '证书编码格式不正确，前两位必须为数字，字母必须为大写' }
          ]"
          label-align="top"
          input-align="left"
          class="custom-field"
          style="display: flex; flex-direction: column; align-items: flex-start;"
        >
          <template #input>
            <input 
              v-model="certificateNo" 
              placeholder="请输入证书编码" 
              style="width: 100%; font-size: 14px; color: #969799; background-color: transparent; border: none; outline: none; "
              @input="formatCertificateNo"
            />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button 
            round 
            block 
            type="warning" 
            native-type="submit"
            class="query-button"
            :loading="loading"
            loading-text="查询中..."
          >
            查询
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { queryCertificate } from '../api'

export default {
  name: 'CertificateQuery',
  data() {
    return {
      name: '',
      certificateNo: '',
      loading: false
    }
  },
  methods: {
    onClickLeft() {
      // 返回上一页
      this.$router.go(-1)
    },
    onSubmit() {
      // 在提交前再次验证证书编码格式
      if (!this.validateCertificateNo(this.certificateNo)) {
        this.$toast.fail('证书编码格式不正确，前两位必须为数字，字母必须为大写')
        return
      }
      
      this.loading = true
      // 使用API服务查询证书
      queryCertificate(this.name, this.certificateNo)
        .then(response => {
          // 将数据存储到本地，并跳转到详情页
          localStorage.setItem('certificateDetail', JSON.stringify(response.data))
          this.$router.push('/detail')
        })
        .catch(error => {
          // 处理错误情况
          this.$toast.fail('查询失败，请检查输入信息是否正确')
          console.error('查询失败:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 验证证书编码格式
    validateCertificateNo(value) {
      if (!value) return false
      
      // 检查前两位是否为数字
      const firstTwoChars = value.substring(0, 2)
      if (!/^\d{2}$/.test(firstTwoChars)) {
        return false
      }
      
      // 检查所有字母是否为大写
      const letters = value.match(/[a-zA-Z]/g) || []
      for (const letter of letters) {
        if (letter !== letter.toUpperCase()) {
          return false
        }
      }
      
      return true
    },
    // 自动格式化证书编码（将字母转为大写）
    formatCertificateNo() {
      if (this.certificateNo) {
        this.certificateNo = this.certificateNo.toUpperCase()
      }
    }
  }
}
</script>

<style>
.certificate-query {
  height: 100vh;
  background-color: #f7f8fa;
}

.form-container {
  padding: 15px;
}

.van-cell {
  flex-direction: column;
  align-items: flex-start;
}

.van-cell__title {
  width: 100%;
  margin-bottom: 4px;
  color: #323233;
  font-size: 15px;
  font-weight: 500;
}

.van-cell__value {
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #969799;
}

.van-field__control {
  font-size: 14px;
  color: #969799;
  background-color: transparent;
}

.van-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.van-field__label {
  width: 100%;
  text-align: left;
  margin-bottom: 4px;
}
</style>