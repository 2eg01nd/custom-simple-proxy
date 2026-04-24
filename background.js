const applyProxy = () => {
  chrome.storage.local.get(['host', 'port', 'isEnabled'], (data) => {
    if (data.isEnabled && data.host && data.port) {
      const config = {
        mode: "fixed_servers",
        rules: {
          singleProxy: { scheme: "socks5", host: data.host, port: parseInt(data.port) },
          bypassList: ["localhost", "127.0.0.1"]
        }
      };
      chrome.proxy.settings.set({ value: config, scope: 'regular' });
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    } else {
      chrome.proxy.settings.clear({ scope: 'regular' });
      chrome.action.setBadgeText({ text: "" });
    }
  });
};

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(['isEnabled', 'host', 'port'], (data) => {
    if (!data.host || !data.port) {
      chrome.runtime.openOptionsPage();
      return;
    }
    const newState = !data.isEnabled;
    chrome.storage.local.set({ isEnabled: newState }, applyProxy);
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSettings",
    title: "Proxy settings",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "openSettings") chrome.runtime.openOptionsPage();
});

chrome.runtime.onStartup.addListener(applyProxy);
