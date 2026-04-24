const hostInput = document.getElementById('host');
const portInput = document.getElementById('port');
const statusDiv = document.getElementById('status');

chrome.storage.local.get(['host', 'port'], (data) => {
  if (data.host) hostInput.value = data.host;
  if (data.port) portInput.value = data.port;
});

document.getElementById('save').addEventListener('click', () => {
  const host = hostInput.value.trim();
  const port = hostInput.value ? parseInt(portInput.value) : null;

  if (host && port) {
    chrome.storage.local.set({ host, port }, () => {
      statusDiv.innerText = "Saved";
      statusDiv.style.color = "green";
      chrome.runtime.sendMessage({ action: "apply" });
      setTimeout(() => { window.close(); }, 1000);
    });
  }
});
