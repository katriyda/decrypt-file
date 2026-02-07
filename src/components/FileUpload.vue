<template>
  <div
    class="file-upload"
    :class="{
      'is-dragover': isDragOver,
      'has-file': selectedFile,
      'is-error': error
    }"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click="handleClick"
  >
    <input
      ref="fileInput"
      type="file"
      class="file-input"
      accept=".enc,.tar.xz.enc,.gz.enc,.zip.enc,*/*"
      @change="handleFileChange"
    />
    
    <div class="upload-content">
      <!-- Icon -->
      <div class="upload-icon" :class="{ 'animate-bounce': isDragOver }">
        <svg v-if="!selectedFile" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 10V9C7 6.23858 9.23858 4 12 4C14.0503 4 15.8124 5.2341 16.584 7M12 12V20M12 12L9 15M12 12L15 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 12L11 14L15 10M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <!-- Text content -->
      <div class="upload-text">
        <p v-if="!selectedFile" class="primary-text">
          <span class="highlight">点击上传</span> 或拖拽文件到此处
        </p>
        <p v-else class="primary-text file-name">
          {{ selectedFile.name }}
        </p>
        <p class="secondary-text">
          <template v-if="!selectedFile">
            支持 .enc, .tar.xz.enc 等加密文件
          </template>
          <template v-else>
            {{ formatFileSize(selectedFile.size) }}
          </template>
        </p>
      </div>
      
      <!-- Remove button (when file selected) -->
      <button
        v-if="selectedFile"
        type="button"
        class="remove-file-btn"
        @click.stop="removeFile"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 18L18 6M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    
    <!-- Drag overlay -->
    <div v-if="isDragOver" class="drag-overlay">
      <div class="overlay-content">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4V20M12 20L5 13M12 20L19 13"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>释放以上传文件</span>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 9V13M12 17H12.01M10.615 4.25295C11.1547 3.16865 12.8453 3.16865 13.385 4.25295L20.835 19.5029C21.3184 20.4752 20.6021 21.6 19.45 21.6H4.55002C3.39788 21.6 2.68156 20.4752 3.16502 19.5029L10.615 4.25295Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatFileSize } from '../services/decryption';

interface Props {
  modelValue?: File | null;
  error?: string;
}

interface Emits {
  (e: 'update:modelValue', file: File | null): void;
  (e: 'change', file: File | null): void;
  (e: 'error', message: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const dragCounter = ref(0);

const selectedFile = computed({
  get: () => props.modelValue || null,
  set: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
});

function handleClick() {
  if (!selectedFile.value) {
    fileInput.value?.click();
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    validateAndSetFile(file);
  }
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault();
  dragCounter.value++;
  
  if (dragCounter.value === 1) {
    isDragOver.value = true;
  }
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault();
  dragCounter.value--;
  
  if (dragCounter.value === 0) {
    isDragOver.value = false;
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;
  dragCounter.value = 0;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    validateAndSetFile(files[0]);
  }
}

function validateAndSetFile(file: File) {
  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    emit('error', '文件大小超过500MB限制');
    return;
  }
  
  selectedFile.value = file;
}

function removeFile() {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
</script>

<style scoped>
.file-upload {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed var(--border);
  border-radius: 20px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.file-upload:hover {
  border-color: rgba(242, 240, 71, 0.5);
  background: rgba(42, 42, 42, 0.8);
}

.file-upload.is-dragover {
  border-color: var(--accent);
  background: rgba(242, 240, 71, 0.05);
  transform: scale(1.02);
}

.file-upload.has-file {
  border-style: solid;
  border-color: var(--accent);
  background: rgba(242, 240, 71, 0.05);
}

.file-upload.is-error {
  border-color: var(--error);
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 16px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: var(--accent);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.has-file .upload-icon {
  width: 48px;
  height: 48px;
  color: var(--success);
}

.upload-text {
  text-align: center;
}

.primary-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.primary-text .highlight {
  color: var(--accent);
}

.file-name {
  font-weight: 600;
  word-break: break-all;
  max-width: 100%;
}

.secondary-text {
  font-size: 14px;
  color: var(--text-muted);
}

.remove-file-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.remove-file-btn:hover {
  background: var(--error);
  border-color: var(--error);
  color: white;
}

.remove-file-btn svg {
  width: 16px;
  height: 16px;
}

.drag-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10;
  animation: fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--accent);
}

.overlay-content svg {
  width: 48px;
  height: 48px;
  animation: bounce 0.6s infinite alternate;
}

.overlay-content span {
  font-size: 16px;
  font-weight: 600;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  border-radius: 8px;
  color: var(--error);
  font-size: 14px;
  white-space: nowrap;
}

.error-message svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .file-upload {
    min-height: 160px;
  }
  
  .upload-content {
    padding: 24px 16px;
  }
  
  .upload-icon {
    width: 48px;
    height: 48px;
  }
  
  .primary-text {
    font-size: 16px;
  }
  
  .secondary-text {
    font-size: 12px;
  }
}
</style>
