// 弹出框内容
var popupTexts = [
  "👏欢迎访问Noise导航",
  "📢站内收录已更新",
  "👉投稿请移步至投稿页面",
  "🥳",
  "😁",
  "😘",
  "😉"
  ];
  
  var popupIndex = 0;
  var popup = document.getElementById("popup");
  var isShowPopup = false;
  
  // 检查是否已经超过每日出现次数
  var dailyCount = localStorage.getItem("popupDailyCount");
  if (!dailyCount) {
  dailyCount = 0;
  }
  if (dailyCount >= 1) {
  popup.style.display = "none"; // 超过每日出现次数后隐藏弹出框
  } else {
  setTimeout(showPopup, 1000); // 页面加载时延迟1秒后弹入文字
  }
  
  // 显示弹出框
  function showPopup() {
  if (!isShowPopup) {
  isShowPopup = true;
  
  // 设置弹出框内容
  popup.innerHTML = '<span id="popup-text">' + popupTexts[popupIndex] + '</span><span class="close-btn">&times;</span>';
  
  // 弹入
  popup.style.right = "20px";
  popup.style.animation = "popupAnimation 0.5s";
  
  // 关闭按钮点击事件
  popup.querySelector(".close-btn").addEventListener("click", function() {
    popup.style.right = "-300px";
    popup.style.animation = "";
    popup.style.display = "none"; // 添加此行代码，点击关闭后彻底不再显示
    isShowPopup = false;
  });
  
  // 更新索引
  popupIndex++;
  
  // 判断是否超出内容数组长度
  if (popupIndex >= popupTexts.length) {
    popupIndex = 0; // 重新开始循环
  }
  
  // 延迟6秒后弹出框消失
  setTimeout(function() {
    popup.style.right = "-300px";
    popup.style.animation = "";
    setTimeout(showPopup, 500); // 0.5秒后继续弹出下一个文字
  }, 6000);
  
  // 增加每日出现次数
  dailyCount++;
  localStorage.setItem("popupDailyCount", dailyCount);
  }
  }
  
  // 每日重置每日出现次数
  function resetDailyCount() {
  localStorage.removeItem("popupDailyCount");
  }
  
  // 每日重置每日出现次数（在每日的特定时间调用）
  // resetDailyCount();