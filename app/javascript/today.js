    function setupTaskEvents() {
    const todayList = document.getElementById('today-task-list');

    if (!todayList) return;

    const checkboxes = todayList.querySelectorAll('.task-checkbox');

    checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleTask(checkbox);
        });
      });
    }
    // 1. 進行度メーターの計算機能
    function updateProgress() {
      const todayList = document.getElementById('today-task-list');
      if (!todayList) return;

      const checkboxes = todayList.querySelectorAll('.task-checkbox');
      const total = checkboxes.length;
      let checkedCount = 0;

      checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
      });

      const remaining = total - checkedCount;
      const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

      document.getElementById('summary-remaining').textContent = `今日やるべきこと：あと ${remaining} 件`;
      document.getElementById('summary-progress-text').textContent = `本日の進行度 (${checkedCount}/${total} 完了)`;
      document.getElementById('progress-bar-fill').style.width = `${percent}%`;
    }

    // 2. チェックボックス切り替え時の打ち消し線処理
    function toggleTask(checkbox) {
      const taskTitle = checkbox.nextElementSibling.querySelector('.task-title');
      if (checkbox.checked) {
        taskTitle.style.textDecoration = 'line-through';
        taskTitle.style.color = '#94a3b8';
      } else {
        taskTitle.style.textDecoration = 'none';
        taskTitle.style.color = '#1e293b';
      }
      updateProgress();
    }

    

    // 画面読み込み時の初期化
    document.addEventListener('turbo:load', updateProgress);
    document.addEventListener('turbo:load', setupTaskEvents);

    document.addEventListener('DOMContentLoaded', updateProgress);
    document.addEventListener('DOMContentLoaded', setupTaskEvents);
  