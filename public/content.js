document.addEventListener('copy', (event) => {
  let text = window.getSelection().toString();

  // clipboardData에서 가져오기 (키보드 복사도 대응)
  if (event.clipboardData && event.clipboardData.getData('text')) {
    text = event.clipboardData.getData('text');
  }

  if (!text) return;

  // background에 메시지 전달
  chrome.runtime.sendMessage({ type: 'copied', text });

  // storage에 리스트로 저장
  chrome.storage.local.get({ copiedList: [] }, (data) => {
    const newList = [text, ...data.copiedList].slice(0, 50);
    const uniqueList = [...new Set(newList)];
    chrome.storage.local.set({ copiedList: uniqueList });
  });
});
