chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "copied") {
        // 필요하면 여기서 처리 가능
        console.log("Background received:", msg.text);
    }
});