<template>
  <div class="decryption-tool">
    <!-- Header -->
    <div class="tool-header">
      <h2 class="tool-title">文件解密工具</h2>
      <p class="tool-subtitle">
        兼容 OpenSSL <code>enc -aes-256-cbc -pbkdf2 -iter 100000</code> 命令
      </p>
    </div>
    
    <!-- Main content area -->
    <div class="tool-content">
      <!-- Input Stage -->
      <div v-if="currentStage === 'input'" class="stage-input">
        <!-- Password Input -->
        <div class="input-section">
          <PasswordInput
            v-model="password"
            label="解密密码"
            placeholder="请输入解密密码"
            :error="passwordError"
            hint="输入用于加密文件的密码"
            :disabled="isProcessing"
            required
          />
        </div>
        
        <!-- File Upload -->
        <div class="input-section">
          <label class="section-label">加密文件</label>
          <FileUpload
            v-model="selectedFile"
            :error="fileError"
            @change="handleFileChange"
            @error="handleFileError"
          />
        </div>
        
        <!-- Decrypt Button -->
        <button
          class="btn btn-primary decrypt-btn"
          :disabled="!canDecrypt || isProcessing"
          @click="startDecryption"
        >
          <svg v-if="isProcessing" class="btn-icon spin" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 4.92893L16.2574 7.75M7.74264 16.2574L4.92893 19.0711M19.0784 19.0711L16.2574 16.2574M7.74264 7.75L4.92893 4.92893"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 16L12 12M12 12L16 16M12 12V21M20 16.2C21.7462 14.9105 22.9099 12.9022 22.9099 10.6363C22.9099 6.48528 19.4247 3.09091 15.1819 3.09091C13.9183 3.09091 12.7274 3.38961 11.6765 3.91932C10.9274 1.75509 8.75527 0.181824 6.18185 0.181824C2.7675 0.181824 0 2.94932 0 6.36364C0 8.62955 1.16363 10.6378 2.90977 11.9273"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ isProcessing ? '解密中...' : '开始解密' }}
        </button>
      </div>
      
      <!-- Processing Stage -->
      <div v-else-if="isProcessingStage" class="stage-processing">
        <ProgressIndicator
          :stage="progress.stage"
          :progress="progress.progress"
          :message="progress.message"
          :sub-message="subProgressMessage"
          show-linear
        />
        
        <!-- Cancel button -->
        <button
          v-if="canCancel"
          class="btn btn-secondary cancel-btn"
          @click="cancelDecryption"
        >
          取消解密
        </button>
      </div>
      
      <!-- Complete Stage -->
      <div v-else-if="currentStage === 'complete'" class="stage-complete">
        <ProgressIndicator
          stage="complete"
          :progress="100"
          message="解密成功！"
          :sub-message="`文件: ${result?.filename}`"
        />
        
        <div class="action-buttons">
          <button class="btn btn-primary download-btn" @click="downloadFile">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15V3M12 15L7 10M12 15L17 10M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            下载解密文件
          </button>
          
          <button class="btn btn-secondary" @click="reset">
            解密其他文件
          </button>
        </div>
      </div>
      
      <!-- Error Stage -->
      <div v-else-if="currentStage === 'error'" class="stage-error">
        <ProgressIndicator
          stage="error"
          :progress="0"
          message="解密失败"
          :sub-message="errorMessage"
        />
        
        <div class="action-buttons">
          <button class="btn btn-primary" @click="retry">
            重试
          </button>
          <button class="btn btn-secondary" @click="reset">
            重新开始
          </button>
        </div>
      </div>
    </div>
    
    <!-- Security notice -->
    <div class="security-notice">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>所有解密操作在本地完成，文件和密码不会上传到服务器</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FileUpload from './FileUpload.vue';
import PasswordInput from './PasswordInput.vue';
import ProgressIndicator from './ProgressIndicator.vue';
import { 
  decryptFile, 
  downloadDecryptedFile,
  formatFileSize,
  type DecryptionProgress,
  type DecryptionResult 
} from '../services/decryption';

// State
const password = ref('');
const passwordError = ref('');
const selectedFile = ref<File | null>(null);
const fileError = ref('');
const isProcessing = ref(false);
const currentStage = ref<'input' | 'processing' | 'complete' | 'error'>('input');
const progress = ref<DecryptionProgress>({
  stage: 'reading',
  progress: 0,
  message: ''
});
const result = ref<DecryptionResult | null>(null);
const errorMessage = ref('');

// Computed
const canDecrypt = computed(() => {
  return password.value.length > 0 && selectedFile.value !== null;
});

const isProcessingStage = computed(() => {
  return currentStage.value === 'processing' && isProcessing.value;
});

const canCancel = computed(() => {
  return progress.value.stage !== 'complete' && progress.value.stage !== 'error';
});

const subProgressMessage = computed(() => {
  if (selectedFile.value) {
    return `${selectedFile.value.name} (${formatFileSize(selectedFile.value.size)})`;
  }
  return '';
});

// Methods
function handleFileChange(file: File | null) {
  selectedFile.value = file;
  fileError.value = '';
}

function handleFileError(message: string) {
  fileError.value = message;
}

function validateInputs(): boolean {
  let isValid = true;
  
  // Validate password
  if (!password.value) {
    passwordError.value = '请输入解密密码';
    isValid = false;
  } else {
    passwordError.value = '';
  }
  
  // Validate file
  if (!selectedFile.value) {
    fileError.value = '请选择加密文件';
    isValid = false;
  } else {
    fileError.value = '';
  }
  
  return isValid;
}

async function startDecryption() {
  if (!validateInputs() || !selectedFile.value) {
    return;
  }
  
  isProcessing.value = true;
  currentStage.value = 'processing';
  
  try {
    const decryptionResult = await decryptFile(
      selectedFile.value,
      password.value,
      (p) => {
        progress.value = p;
      }
    );
    
    if (decryptionResult.success) {
      result.value = decryptionResult;
      currentStage.value = 'complete';
    } else {
      errorMessage.value = decryptionResult.error || '解密失败';
      currentStage.value = 'error';
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '未知错误';
    currentStage.value = 'error';
  } finally {
    isProcessing.value = false;
  }
}

function cancelDecryption() {
  // In a real implementation, we'd need to make the decryption cancellable
  // For now, just reset
  isProcessing.value = false;
  currentStage.value = 'input';
}

function downloadFile() {
  if (result.value?.data && result.value?.filename) {
    downloadDecryptedFile(result.value.data, result.value.filename);
  }
}

function reset() {
  password.value = '';
  passwordError.value = '';
  selectedFile.value = null;
  fileError.value = '';
  isProcessing.value = false;
  currentStage.value = 'input';
  progress.value = {
    stage: 'reading',
    progress: 0,
    message: ''
  };
  result.value = null;
  errorMessage.value = '';
}

function retry() {
  currentStage.value = 'input';
  errorMessage.value = '';
}
</script>

<style scoped>
.decryption-tool {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-bottom: 32px;
}

.tool-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.tool-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.tool-subtitle code {
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: var(--accent);
}

.tool-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 32px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.stage-input {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section {
  width: 100%;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.decrypt-btn {
  width: 100%;
  margin-top: 8px;
  padding: 16px;
  font-size: 18px;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-icon.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stage-processing,
.stage-complete,
.stage-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 24px;
}

.cancel-btn {
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}

.download-btn {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(242, 240, 71, 0.3); }
  50% { box-shadow: 0 0 40px rgba(242, 240, 71, 0.6); }
}

.security-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
  padding: 16px;
  background: rgba(242, 240, 71, 0.05);
  border: 1px solid rgba(242, 240, 71, 0.2);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 13px;
}

.security-notice svg {
  width: 18px;
  height: 18px;
  color: var(--accent);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .decryption-tool {
    max-width: 100%;
  }
  
  .tool-header {
    margin-bottom: 24px;
  }
  
  .tool-title {
    font-size: 24px;
  }
  
  .tool-subtitle {
    font-size: 12px;
  }
  
  .tool-content {
    padding: 24px 20px;
    border-radius: 20px;
    min-height: 350px;
  }
  
  .stage-input {
    gap: 20px;
  }
  
  .decrypt-btn {
    padding: 14px;
    font-size: 16px;
  }
  
  .security-notice {
    padding: 12px;
    font-size: 12px;
    text-align: center;
  }
  
  .security-notice svg {
    width: 16px;
    height: 16px;
  }
}
</style>
