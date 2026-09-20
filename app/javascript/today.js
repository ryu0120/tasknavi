    // チェックボックスのイベントを設定
    function setupTaskEvents() {
    const checkboxes = document.querySelectorAll('.task-checkbox');

    checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleTask(checkbox);
        });
      });
    }
    // 進行度メーターを計算して画面に反映する
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

    // チェックボックスの状態に応じてタスクの見た目を変更
    function toggleTask(checkbox) {
      const taskId = checkbox.dataset.taskId;
      const status = checkbox.checked ? 'done' : 'todo';
      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify({
        status: status
        })
      });
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

    

    // Turboでページが読み込まれたときに初期化処理を実行
    document.addEventListener('turbo:load', updateProgress);
    document.addEventListener('turbo:load', setupTaskEvents);

   