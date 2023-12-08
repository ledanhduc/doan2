var langBtn = document.getElementById('langBtn');

langBtn.addEventListener('click', function() {
  var lang = document.documentElement.lang;
  var isEnglish = lang === 'en';
  
  document.documentElement.lang = isEnglish ? 'vi' : 'en';
  
  var translations = {
    dashboard: isEnglish ? 'Dashboard' : 'Bảng điều khiển',
    user: isEnglish ? 'Users' : 'Người dùng',
    history: isEnglish ? 'History' : 'Lịch sử',
    analytics: isEnglish ? 'Analytics' : 'Phân tích',
    control: isEnglish ? 'Control' : 'Điều khiển',
    statistics: isEnglish ? 'Statistics' : 'Thống kê',
    download: isEnglish ? 'Download' : 'Tải xuống',
    settings: isEnglish ? 'Settings' : 'Cài đặt',
    add_devices: isEnglish ? 'Add Devices' : 'Thêm thiết bị',
    logout: isEnglish ? 'Logout' : 'Đăng xuất'
  };
  
  var sidebarItems = document.querySelectorAll('.sidebar a');
  
  sidebarItems.forEach(function(item) {
    var h3Element = item.querySelector('h3');
    if (h3Element) {
      var translationKey = h3Element.parentElement.id.replace('ref_', '');
      h3Element.textContent = translations[translationKey];
    }

    langBtn.textContent = isEnglish ? 'En' : 'Vi';
  });
});
