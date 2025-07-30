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
        />
        <van-field
          v-model="certificateNo"
          name="证书编码"
          label="证书编码"
          placeholder="请输入证书编码"
          :rules="[{ required: true, message: '请输入证书编码' }]"
        />
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
    }
  }
}
</script>

<style scoped>
.certificate-query {
  height: 100vh;
  background-color: #f7f8fa;
}

.form-container {
  padding: 20px;
}
</style>