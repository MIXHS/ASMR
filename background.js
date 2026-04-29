// 存储按钮显示状态
let isBtnShow = false;

// 监听插件图标点击（Edge专用修复）
chrome.action.onClicked.addListener(async (tab) => {
  // 切换状态
  isBtnShow = !isBtnShow;
  
  // 向页面注入脚本，控制按钮显隐
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (show) => {
        // 查找按钮容器
        const btnBox = document.getElementById("asmr-control");
        if (btnBox) {
          // 显隐切换
          btnBox.style.display = show ? "block" : "none";
        } else {
          // 首次点击：创建按钮
          createAsmrBtn();
        }
      },
      args: [isBtnShow]
    });
  } catch (e) {
    console.log("适配Edge：页面无执行权限，已自动跳过");
  }
});

// 按钮创建函数（注入到页面）
function createAsmrBtn() {
  // 悬浮按钮容器
  const controlBox = document.createElement("div");
  controlBox.id = "asmr-control";
  controlBox.style.position = "fixed";
  controlBox.style.bottom = "40px";
  controlBox.style.right = "30px";
  controlBox.style.zIndex = "9999999";
  controlBox.style.display = "block";

  // 功能按钮
  const btn = document.createElement("button");
  btn.innerText = "纯音频模式";
  btn.style.padding = "10px 16px";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.background = "#6366f1";
  btn.style.color = "#fff";
  btn.style.fontSize = "13px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";

  // 纯音频模式切换
  let audioMode = false;
  btn.addEventListener("click", () => {
    const videos = document.querySelectorAll("video");
    if (videos.length === 0) {
      alert("当前页面无视频");
      return;
    }
    audioMode = !audioMode;
    videos.forEach(v => {
      v.style.display = audioMode ? "none" : "";
    });
    btn.innerText = audioMode ? "恢复画面" : "纯音频模式";
  });

  controlBox.appendChild(btn);
  document.body.appendChild(controlBox);
}