<template>
  <div class="progress-indicator" :class="`stage-${stage}`">
    <!-- Circular progress for processing states -->
    <div v-if="isProcessing" class="circular-progress">
      <svg class="progress-ring" viewBox="0 0 120 120">
        <!-- Background circle -->
        <circle
          class="progress-ring-bg"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke-width="6"
        />
        <!-- Progress circle -->
        <circle
          class="progress-ring-fill"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke-width="6"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          stroke-linecap="round"
        />
      </svg>
      <div class="progress-content">
        <span class="progress-percentage">{{ Math.round(progress) }}%</span>
      </div>
    </div>
    
    <!-- Success state -->
    <div v-else-if="stage === 'complete'" class="status-icon success">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path
          d="M8 12L11 15L16 9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    
    <!-- Error state -->
    <div v-else-if="stage === 'error'" class="status-icon error">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path
          d="M8 8L16 16M16 8L8 16"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
    
    <!-- Message -->
    <div class="progress-message">
      <p class="message-primary">{{ message }}</p>
      <p v-if="subMessage" class="message-secondary">{{ subMessage }}</p>
    </div>
    
    <!-- Linear progress bar for detailed progress -->
    <div v-if="showLinear && isProcessing" class="linear-progress-wrapper">
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DecryptionProgress } from '../services/decryption';

interface Props {
  stage: DecryptionProgress['stage'];
  progress: number;
  message: string;
  subMessage?: string;
  showLinear?: boolean;
}

const props = defineProps<Props>();

const isProcessing = computed(() => {
  return ['reading', 'deriving', 'decrypting'].includes(props.stage);
});

// Circular progress calculations
const radius = 54;
const circumference = 2 * Math.PI * radius;

const strokeDashoffset = computed(() => {
  return circumference - (props.progress / 100) * circumference;
});
</script>

<style scoped>
.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
}

/* Circular Progress */
.circular-progress {
  position: relative;
  width: 140px;
  height: 140px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  stroke: var(--bg-card);
}

.progress-ring-fill {
  stroke: var(--accent);
  filter: drop-shadow(0 0 8px rgba(242, 240, 71, 0.4));
  transition: stroke-dashoffset 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-percentage {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
}

/* Status Icons */
.status-icon {
  width: 100px;
  height: 100px;
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.status-icon svg {
  width: 100%;
  height: 100%;
}

.status-icon.success {
  color: var(--success);
}

.status-icon.error {
  color: var(--error);
}

/* Messages */
.progress-message {
  text-align: center;
}

.message-primary {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.message-secondary {
  font-size: 14px;
  color: var(--text-muted);
}

/* Linear Progress */
.linear-progress-wrapper {
  width: 100%;
  max-width: 400px;
}

.progress-container {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #e5e33d);
  border-radius: 4px;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.stage-reading .progress-ring-fill {
  stroke: #3b82f6;
}

.stage-deriving .progress-ring-fill {
  stroke: #8b5cf6;
}

.stage-decrypting .progress-ring-fill {
  stroke: var(--accent);
}

.stage-complete .progress-ring-fill {
  stroke: var(--success);
}

.stage-error .progress-ring-fill {
  stroke: var(--error);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.circular-progress {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .progress-indicator {
    padding: 24px 16px;
    gap: 16px;
  }
  
  .circular-progress {
    width: 120px;
    height: 120px;
  }
  
  .progress-percentage {
    font-size: 24px;
  }
  
  .status-icon {
    width: 80px;
    height: 80px;
  }
  
  .message-primary {
    font-size: 16px;
  }
  
  .message-secondary {
    font-size: 13px;
  }
}
</style>
