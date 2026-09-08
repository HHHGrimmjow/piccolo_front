<template>
  <div class="create-page">
    <div class="create-container">
      <div class="create-header">
        <h1>🎲 发起新投票</h1>
        <p>让大家帮你做选择吧！</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <!-- 标题 -->
        <el-form-item label="投票标题" prop="title">
          <el-input v-model="form.title" placeholder="你想要大家帮你选什么？" maxlength="200" show-word-limit />
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="补充说明（选填）">
          <el-input v-model="form.description" type="textarea" :rows="3"
                    placeholder="补充一些背景信息，让大家更好地帮你选择~" maxlength="1000" show-word-limit />
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item label="配图（选填）">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
          >
            <div v-if="form.imageUrl" class="preview-image">
              <img :src="form.imageUrl" />
              <span class="remove-btn" @click.stop="form.imageUrl = ''">✕</span>
            </div>
            <div v-else class="upload-placeholder">
              <el-icon :size="32"><Plus /></el-icon>
              <span>点击上传图片</span>
            </div>
          </el-upload>
        </el-form-item>

        <!-- 选项 -->
        <el-form-item label="投票选项" prop="options">
          <div class="options-editor">
            <div v-for="(option, index) in form.options" :key="index" class="option-row">
              <span class="option-label">{{ getOptionLabel(index) }}</span>
              <el-input v-model="option.optionText" :placeholder="'选项 ' + getOptionLabel(index)"
                        maxlength="200" />
              <el-button v-if="form.options.length > 2" type="danger" text circle
                         @click="removeOption(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button v-if="form.options.length < 10" type="primary" text
                       @click="addOption" class="add-option-btn">
              <el-icon><Plus /></el-icon> 添加选项
            </el-button>
          </div>
        </el-form-item>

        <!-- 截止时间 -->
        <el-form-item label="截止时间（选填）">
          <el-date-picker v-model="form.deadline" type="datetime"
                          placeholder="不设置则长期有效"
                          :disabled-date="(date) => date < new Date()" />
        </el-form-item>

        <!-- 提交 -->
        <el-form-item>
          <el-button type="primary" size="large" round class="submit-btn"
                     :loading="submitting" @click="handleSubmit">
            发布投票 🚀
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTopicStore } from '@/stores/topic'
import { uploadFile } from '@/api/user'
import { compressImage } from '@/utils/image'
import { ElMessage } from 'element-plus'

const router = useRouter()
const topicStore = useTopicStore()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  imageUrl: '',
  deadline: null,
  options: [
    { optionText: '' },
    { optionText: '' }
  ]
})

const validateOptions = (rule, value, callback) => {
  const valid = form.options.filter(o => o.optionText.trim().length > 0)
  if (valid.length < 2) {
    callback(new Error('至少需要2个有效选项'))
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, message: '请输入投票标题', trigger: 'blur' }],
  options: [{ validator: validateOptions, trigger: 'change' }]
}

function getOptionLabel(index) {
  return 'ABCDEFGHJK'[index] || '?'
}

function addOption() {
  if (form.options.length < 10) {
    form.options.push({ optionText: '' })
  }
}

function removeOption(index) {
  if (form.options.length > 2) {
    form.options.splice(index, 1)
  }
}

async function handleUpload({ file }) {
  try {
    let uploadFileObj = file
    if (file.size > 500 * 1024) {
      uploadFileObj = await compressImage(file, 1200, 0.85)
    }
    const res = await uploadFile(uploadFileObj)
    form.imageUrl = res.data
    ElMessage.success('图片上传成功~')
  } catch (e) {
    ElMessage.error('图片上传失败')
  }
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const validOptions = form.options.filter(o => o.optionText.trim().length > 0)
    const res = await topicStore.createNewTopic({
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      deadline: form.deadline,
      options: validOptions.map(o => ({ optionText: o.optionText }))
    })
    ElMessage.success('发布成功~ 快去分享吧！🎉')
    router.push(`/topic/${res.data}`)
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.create-page {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: var(--bg-soft);
  padding: 32px 24px;
}

.create-container {
  max-width: 640px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 36px;
}

.create-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0;
  }
}

.image-uploader {
  width: 100%;
}

.upload-placeholder {
  width: 100%;
  height: 160px;
  border: 2px dashed #ddd;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--pink);
    color: var(--pink);
  }
}

.preview-image {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;

  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
  }
}

.options-editor {
  width: 100%;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.option-label {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--pink-light);
  color: var(--pink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.add-option-btn {
  width: 100%;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b9d, #c44dff);
  border: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .create-page {
    padding: 20px 16px;
  }

  .create-container {
    padding: 24px 16px;
    border-radius: 20px;
  }

  .create-header h1 {
    font-size: 20px;
  }

  .option-row {
    gap: 6px;
  }

  .upload-placeholder {
    height: 120px;
  }
}
</style>
