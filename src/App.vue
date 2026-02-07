<template>
  <div class="app">
    <!-- Background effects -->
    <div class="background-effects">
      <div class="gradient-mesh"></div>
      <div class="grid-pattern"></div>
    </div>
    
    <!-- Header -->
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#f2f047"/>
              <path
                d="M12 20H16V28H12V20ZM18 14H22V28H18V14ZM24 18H28V28H24V18Z"
                fill="#1e1e1e"
              />
            </svg>
            <span>SecureDecrypt</span>
          </div>
          <nav class="header-nav">
            <a href="#features" class="nav-link">功能</a>
            <a href="#tool" class="nav-link">解密工具</a>
            <a href="#specs" class="nav-link">技术规格</a>
          </nav>
        </div>
      </div>
    </header>
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="title-line">解密您的</span>
              <span class="title-line highlight">加密文件</span>
            </h1>
            <p class="hero-description">
              使用我们安全的本地解密工具，在几秒钟内解锁您的文件。
              完全兼容 OpenSSL AES-256-CBC 加密格式。
            </p>
            <div class="hero-actions">
              <a href="#tool" class="btn btn-primary">
                开始解密
                <svg viewBox="0 0 24 24" fill="none" class="btn-arrow">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="floating-card animate-float">
              <div class="card-icon">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect width="64" height="64" rx="16" fill="#f2f047" fill-opacity="0.1"/>
                  <path
                    d="M20 32H28V44H20V32ZM30 24H38V44H30V24ZM40 28H48V44H40V28Z"
                    fill="#f2f047"
                  />
                </svg>
              </div>
              <div class="card-text">
                <span class="card-label">AES-256-CBC</span>
                <span class="card-value">安全解密</span>
              </div>
            </div>
            
            <div class="floating-card card-2 animate-float" style="animation-delay: -2s;">
              <div class="card-icon">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect width="64" height="64" rx="16" fill="#f2f047" fill-opacity="0.1"/>
                  <path
                    d="M32 16L36 24H44L38 30L40 38L32 34L24 38L26 30L20 24H28L32 16Z"
                    fill="#f2f047"
                  />
                </svg>
              </div>
              <div class="card-text">
                <span class="card-label">PBKDF2</span>
                <span class="card-value">100,000 次迭代</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">解密流程</h2>
          <p class="section-subtitle">简单三步，安全解密您的文件</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-number">0{{ index + 1 }}</div>
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
        
        <!-- Connection line (SVG) -->
        <svg class="connection-line" viewBox="0 0 800 100" preserveAspectRatio="none">
          <path
            d="M50 50 Q 200 20, 400 50 T 750 50"
            fill="none"
            stroke="url(#lineGradient)"
            stroke-width="2"
            stroke-dasharray="8 4"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f2f047" stop-opacity="0.3"/>
              <stop offset="50%" stop-color="#f2f047"/>
              <stop offset="100%" stop-color="#f2f047" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
    
    <!-- Tool Section -->
    <section id="tool" class="tool-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">解密工具</h2>
          <p class="section-subtitle">在浏览器中安全解密您的文件</p>
        </div>
        
        <DecryptionTool />
      </div>
    </section>
    
    <!-- Specs Section -->
    <section id="specs" class="specs-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">技术规格</h2>
          <p class="section-subtitle">企业级安全标准</p>
        </div>
        
        <div class="specs-grid">
          <div class="spec-card" v-for="(spec, index) in specs" :key="index">
            <div class="spec-icon" v-html="spec.icon"></div>
            <h3 class="spec-title">{{ spec.title }}</h3>
            <p class="spec-description">{{ spec.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#f2f047"/>
              <path
                d="M12 20H16V28H12V20ZM18 14H22V28H18V14ZM24 18H28V28H24V18Z"
                fill="#1e1e1e"
              />
            </svg>
            <span>SecureDecrypt</span>
          </div>
          <p class="footer-text">
            安全的客户端文件解密工具 · 兼容 OpenSSL
          </p>
          <p class="footer-copyright">
            © 2026 SecureDecrypt. 所有操作在本地完成。
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import DecryptionTool from './components/DecryptionTool.vue';

const features = [
  {
    title: '上传文件',
    description: '支持拖拽或点击上传加密文件，兼容 .enc 等多种格式',
    icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 32V16M24 16L18 22M24 16L30 22M8 26V34C8 35.1046 8.89543 36 10 36H38C39.1046 36 40 35.1046 40 34V26" stroke="#f2f047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="12" width="32" height="24" rx="4" stroke="#f2f047" stroke-width="2.5"/></svg>`
  },
  {
    title: '输入密码',
    description: '输入加密时使用的密码，支持密码可见性切换',
    icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="10" y="22" width="28" height="16" rx="4" stroke="#f2f047" stroke-width="2.5"/><path d="M18 22V16C18 12.6863 20.6863 10 24 10C27.3137 10 30 12.6863 30 16V22" stroke="#f2f047" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="30" r="3" fill="#f2f047"/></svg>`
  },
  {
    title: '下载结果',
    description: '解密完成后立即下载原始文件，所有操作本地完成',
    icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 8V28M24 28L16 20M24 28L32 20" stroke="#f2f047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 32V36C8 37.1046 8.89543 38 10 38H38C39.1046 38 40 37.1046 40 36V32" stroke="#f2f047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  }
];

const specs = [
  {
    title: '客户端解密',
    description: '所有解密操作在浏览器中完成，文件和密码永远不会离开您的设备',
    icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="16" width="32" height="24" rx="4" stroke="#f2f047" stroke-width="2"/><path d="M16 16V12C16 8.68629 18.6863 6 22 6H26C29.3137 6 32 8.68629 32 12V16" stroke="#f2f047" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="28" r="4" stroke="#f2f047" stroke-width="2"/></svg>`
  },
  {
    title: 'PBKDF2 密钥派生',
    description: '使用 PBKDF2 算法，100,000 次迭代，SHA-256 哈希，确保密码安全',
    icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 8V12M24 36V40M8 24H12M36 24H40M12.6863 12.6863L15.5147 15.5147M32.4853 32.4853L35.3137 35.3137M12.6863 35.3137L15.5147 32.4853M32.4853 15.5147L35.3137 12.6863" stroke="#f2f047" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="8" stroke="#f2f047" stroke-width="2"/></svg>`
  },
  {
    title: 'AES-256-CBC',
    description: '采用 AES-256 位加密标准，CBC 模式，业界公认的安全加密算法',
    icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="6" stroke="#f2f047" stroke-width="2"/><path d="M16 24H32M24 16V32" stroke="#f2f047" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="4" stroke="#f2f047" stroke-width="2"/></svg>`
  },
  {
    title: 'OpenSSL 兼容',
    description: '完全兼容 openssl enc -aes-256-cbc -pbkdf2 -iter 100000 命令格式',
    icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M12 16H36M12 24H36M12 32H28" stroke="#f2f047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 32L36 36L44 28" stroke="#f2f047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  }
];
</script>

<style>
@import './style.css';

.app {
  min-height: 100vh;
  position: relative;
}

/* Background Effects */
.background-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-mesh {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(242, 240, 71, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(242, 240, 71, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(37, 37, 37, 0.5) 0%, transparent 70%);
  animation: mesh-move 20s ease-in-out infinite;
}

@keyframes mesh-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(2%, 2%) scale(1.05);
  }
  66% {
    transform: translate(-2%, 1%) scale(0.95);
  }
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Header */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.logo svg {
  width: 36px;
  height: 36px;
}

.header-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link:hover::after {
  width: 100%;
}

/* Hero Section */
.hero-section {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 72px;
  padding-bottom: 80px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text {
  max-width: 540px;
}

.hero-title {
  margin-bottom: 24px;
}

.title-line {
  display: block;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.title-line.highlight {
  color: var(--accent);
}

.hero-description {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.floating-card:first-child {
  top: 20%;
  left: 10%;
}

.floating-card.card-2 {
  bottom: 20%;
  right: 10%;
}

.card-icon svg {
  width: 48px;
  height: 48px;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Features Section */
.features-section {
  position: relative;
  z-index: 1;
  padding: 100px 0;
  background: linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.5), transparent);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-muted);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  position: relative;
  z-index: 2;
}

.feature-card {
  position: relative;
  padding: 40px 32px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(242, 240, 71, 0.3);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.feature-number {
  position: absolute;
  top: 20px;
  left: 24px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  opacity: 0.5;
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.feature-description {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

.connection-line {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  width: 80%;
  height: 100px;
  transform: translateY(-50%);
  z-index: 1;
  opacity: 0.5;
}

/* Tool Section */
.tool-section {
  position: relative;
  z-index: 1;
  padding: 100px 0;
}

/* Specs Section */
.specs-section {
  position: relative;
  z-index: 1;
  padding: 100px 0;
  background: linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.5), transparent);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.spec-card {
  padding: 32px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.spec-card:hover {
  border-color: rgba(242, 240, 71, 0.3);
  transform: translateY(-4px);
}

.spec-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
}

.spec-icon svg {
  width: 100%;
  height: 100%;
}

.spec-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.spec-description {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Footer */
.app-footer {
  position: relative;
  z-index: 1;
  padding: 60px 0;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.footer-brand svg {
  width: 32px;
  height: 32px;
}

.footer-text {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-copyright {
  font-size: 13px;
  color: var(--text-muted);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-text {
    max-width: 100%;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-visual {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .connection-line {
    display: none;
  }
  
  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
  
  .hero-section {
    padding-top: 100px;
    padding-bottom: 60px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .features-section,
  .tool-section,
  .specs-section {
    padding: 60px 0;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  
  .feature-card {
    padding: 32px 24px;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .spec-card {
    padding: 24px;
  }
}
</style>
