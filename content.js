(function() {
  'use strict';

  // ========== 1. 创建迷你悬浮窗容器（修复布局核心） ==========
  const floatWindow = document.createElement('div');
  floatWindow.id = 'asmr-float-window';
  floatWindow.style.cssText = `
    position: fixed;
    bottom: 60px;
    right: 20px;
    z-index: 99999999;
    display: flex;
    flex-direction: column; /* 纵向排列：功能按钮在上，浮窗在下 */
    align-items: flex-end; /* 右对齐，避免跑偏 */
    gap: 5px;
    pointer-events: auto;
    cursor: move;
  `;

  // ========== 2. 功能按钮（展开后在浮窗上方） ==========
  const audioBtn = document.createElement('button');
  audioBtn.innerText = '纯音频模式';
  audioBtn.style.cssText = `
    display: none; /* 默认隐藏 */
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    background: #0078d7;
    color: white;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    white-space: nowrap; /* 防止文字换行 */
  `;

  // ========== 3. 迷你主浮窗（耳机图标） ==========
  const miniBtn = document.createElement('div');
  miniBtn.innerText = '🎧';
  miniBtn.style.cssText = `
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #0078d7;
    color: white;
    text-align: center;
    line-height: 36px;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    user-select: none;
  `;

  // ========== 4. 核心功能 ==========
  // 4.1 展开/收起功能按钮（点击耳机浮窗）
  let isFuncShow = false;
  miniBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isFuncShow = !isFuncShow;
    audioBtn.style.display = isFuncShow ? 'block' : 'none';
  });

  // 4.2 切换纯音频/恢复画面
  let isAudioOnly = false;
  audioBtn.addEventListener('click', () => {
    const videos = document.querySelectorAll('video');
    if (videos.length === 0) {
      alert('当前页面未找到视频');
      return;
    }
    isAudioOnly = !isAudioOnly;
    videos.forEach(video => {
      video.style.display = isAudioOnly ? 'none' : '';
      video.style.visibility = isAudioOnly ? 'hidden' : '';
    });
    audioBtn.innerText = isAudioOnly ? '恢复画面' : '纯音频模式';
    // 点击后自动收起按钮
    isFuncShow = false;
    audioBtn.style.display = 'none';
  });

  // ========== 5. 可拖动功能（修复拖动不跑偏） ==========
  let isDragging = false;
  let startX, startY, offsetX, offsetY;

  floatWindow.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = floatWindow.getBoundingClientRect();
    offsetX = startX - rect.left;
    offsetY = startY - rect.top;
    floatWindow.style.opacity = '0.8';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    const maxX = window.innerWidth - floatWindow.offsetWidth;
    const maxY = window.innerHeight - floatWindow.offsetHeight;
    const finalX = Math.max(0, Math.min(newX, maxX));
    const finalY = Math.max(0, Math.min(newY, maxY));
    floatWindow.style.left = finalX + 'px';
    floatWindow.style.top = finalY + 'px';
    floatWindow.style.bottom = 'auto';
    floatWindow.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    floatWindow.style.opacity = '1';
  });

  // ========== 6. 组装（功能按钮在上，浮窗在下） ==========
  floatWindow.appendChild(audioBtn);
  floatWindow.appendChild(miniBtn);
  document.body.appendChild(floatWindow);

  // ========== 7. 容错 ==========
  setInterval(() => {
    if (!document.body.contains(floatWindow)) {
      document.body.appendChild(floatWindow);
    }
  }, 2000);

})();