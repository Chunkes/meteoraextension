document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  
  // Загружаем сохраненное состояние
  chrome.storage.local.get(['enabled'], function(result) {
    toggleSwitch.checked = result.enabled !== false;
  });
  
  // Сохраняем состояние при изменении
  toggleSwitch.addEventListener('change', function() {
    const enabled = this.checked;
    
    // Сохраняем состояние
    chrome.storage.local.set({ enabled: enabled }, function() {
      // После сохранения обновляем активную вкладку
      chrome.tabs.reload();
    });
  });
}); 