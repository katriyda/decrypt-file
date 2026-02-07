<template>
  <div class="password-input-wrapper" :class="{ 'is-error': error }">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-wrapper">
      <div class="input-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <input
        ref="inputRef"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-field password-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <button
        type="button"
        class="toggle-password-btn"
        :class="{ 'is-visible': showPassword }"
        :disabled="disabled"
        @click="togglePassword"
        tabindex="-1"
      >
        <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    
    <!-- Password strength indicator -->
    <div v-if="showStrength && modelValue" class="password-strength">
      <div class="strength-bar">
        <div
          class="strength-fill"
          :style="{ width: strengthPercentage + '%', backgroundColor: strengthColor }"
        />
      </div>
      <span class="strength-text" :style="{ color: strengthColor }">
        {{ strengthLabel }}
      </span>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-text">
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
    
    <!-- Hint text -->
    <div v-else-if="hint" class="hint-text">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  showStrength?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
  (e: 'focus'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);
const isFocused = ref(false);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleBlur() {
  isFocused.value = false;
  emit('blur');
}

function handleFocus() {
  isFocused.value = true;
  emit('focus');
}

function togglePassword() {
  showPassword.value = !showPassword.value;
  // Maintain focus on input
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0);
}

// Password strength calculation
const strength = computed(() => {
  const password = props.modelValue;
  if (!password) return 0;
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  return Math.min(5, Math.floor(score / 1.2));
});

const strengthPercentage = computed(() => {
  return (strength.value / 5) * 100;
});

const strengthLabel = computed(() => {
  const labels = ['极弱', '弱', '一般', '良好', '强', '极强'];
  return labels[strength.value];
});

const strengthColor = computed(() => {
  const colors = [
    '#ef4444', // 极弱 - red
    '#f97316', // 弱 - orange
    '#eab308', // 一般 - yellow
    '#84cc16', // 良好 - lime
    '#22c55e', // 强 - green
    '#10b981'  // 极强 - emerald
  ];
  return colors[strength.value];
});
</script>

<style scoped>
.password-input-wrapper {
  width: 100%;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.required-mark {
  color: var(--error);
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.input-icon svg {
  width: 100%;
  height: 100%;
}

.password-field {
  padding-left: 44px;
  padding-right: 48px;
}

.input-field {
  width: 100%;
  padding: 14px 18px;
  font-family: inherit;
  font-size: 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(242, 240, 71, 0.1);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-wrapper:focus-within .input-icon {
  color: var(--accent);
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toggle-password-btn:hover:not(:disabled) {
  background: var(--bg-card);
  color: var(--text-primary);
}

.toggle-password-btn.is-visible {
  color: var(--accent);
}

.toggle-password-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-password-btn svg {
  width: 20px;
  height: 20px;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
  transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  color: var(--error);
  animation: fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.error-text svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.hint-text {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.is-error .input-field {
  border-color: var(--error);
}

.is-error .input-field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .password-field {
    padding-left: 40px;
    padding-right: 44px;
  }
  
  .input-icon {
    left: 12px;
    width: 18px;
    height: 18px;
  }
  
  .toggle-password-btn {
    right: 8px;
    width: 28px;
    height: 28px;
  }
  
  .toggle-password-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
