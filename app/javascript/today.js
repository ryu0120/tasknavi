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
      const summaryRemaining = document.getElementById('summary-remaining');
      const summaryProgressText = document.getElementById('summary-progress-text');
      const progressBarFill = document.getElementById('progress-bar-fill');

      // 本日のタスクリスト、またはサマリー要素が存在しない画面（indexページなど）では何もしない
      if (!todayList || !summaryRemaining || !summaryProgressText || !progressBarFill) return;

      const checkboxes = todayList.querySelectorAll('.task-checkbox');
      const total = checkboxes.length;
      let checkedCount = 0;

      checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
      });

      const remaining = total - checkedCount;
      const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

      summaryRemaining.textContent = `今日やるべきこと：あと ${remaining} 件`;
      summaryProgressText.textContent = `本日の進行度 (${checkedCount}/${total} 完了)`;
      progressBarFill.style.width = `${percent}%`;
    }

    // チェックボックスの状態に応じてタスクの見た目を変更
    async function toggleTask(checkbox) {
      const taskId = checkbox.dataset.taskId;
      const status = checkbox.checked ? 'done' : 'todo';
      const token = document.querySelector('meta[name="csrf-token"]').content;

      const response = await fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        },
        body: JSON.stringify({
          task: {
            status: status
          }
        })
      });

      if (response.ok) {
        const taskTitle = checkbox.nextElementSibling.querySelector('.task-title');

        if (checkbox.checked) {
          taskTitle.style.textDecoration = 'line-through';
          taskTitle.style.color = '#94a3b8';
        } else {
          taskTitle.style.textDecoration = 'none';
          taskTitle.style.color = '#1e293b';
        }

        updateProgress();
      } else {
        checkbox.checked = !checkbox.checked;
      }
    }

    // ページ読み込み時にチェック済みのタスクへ線引きを反映する
    function setupTaskStyles() {
      const checkboxes = document.querySelectorAll('.task-checkbox');

      checkboxes.forEach(checkbox => {
        const taskTitle = checkbox.nextElementSibling.querySelector('.task-title');

        if (checkbox.checked) {
          taskTitle.style.textDecoration = 'line-through';
          taskTitle.style.color = '#94a3b8';
        }
      });
    }

    

    // Turboでページが読み込まれたときに初期化処理を実行
    document.addEventListener('turbo:load', setupTaskEvents);
    document.addEventListener('turbo:load', updateProgress);
    document.addEventListener('turbo:load', setupTaskStyles);
    
   