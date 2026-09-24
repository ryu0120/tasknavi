// モーダルを開く基本イベントを設定
function setupModalEvents() {
  const openModalButton = document.getElementById('openModalButton');

  if (openModalButton) {
    openModalButton.addEventListener('click', openModal);
  }
}

// Turboでページが読み込まれたときに基本イベントを設定
document.addEventListener('turbo:load', setupModalEvents);

// 1. モーダル内のクリックイベント（キャンセルボタン・背景クリック対応）
document.addEventListener('click', function(event) {
  // キャンセルボタン（id="closeModalButton"）が押された場合
  if (event.target && event.target.id === 'closeModalButton') {
    closeModal();
  }

  // 背景モーダル部分クリックで閉じる処理
  const modal = document.getElementById('taskModal');
  if (event.target === modal) {
    closeModal();
  }
});

// 2. 種別切り替え（itemTypeSelect）の変更イベント対応
document.addEventListener('change', function(event) {
  if (event.target && event.target.id === 'itemTypeSelect') {
    toggleFormFields();
  }
});

// 3. フォーム送信（submit）のバリデーションイベント集約
document.addEventListener('submit', function(event) {
  if (event.target && event.target.id === 'addTaskForm') {
    validateForm(event);
  }
});

// 4. Turbo Frameでモーダル内が更新された直後に切り替え表示を再計算
document.addEventListener('turbo:frame-load', function(event) {
  if (event.target.id === 'modal_form') {
    toggleFormFields();
  }
});

// モーダルの開閉制御

function openModal() {
  const modal = document.getElementById('taskModal');

  if (modal) {
    modal.style.display = 'flex';
    toggleFormFields();
  }
}

function closeModal() {
  const modal = document.getElementById('taskModal');

  if (modal) {
    modal.style.display = 'none';
  }
}

// 種別（タスク／予定）に応じた入力フィールドの動的切り替え

function toggleFormFields() {
  const itemTypeSelect = document.getElementById('itemTypeSelect');

  if (!itemTypeSelect) return;

  const itemType = itemTypeSelect.value;

  const taskFields = document.getElementById('taskFields');
  const scheduleFields = document.getElementById('scheduleFields');
  const dueDateInput = document.getElementById('inputDueDate');
  const startTimeInput = document.getElementById('inputStartTime');
  const endTimeInput = document.getElementById('inputEndTime');
  const priorityInput = document.getElementById('inputPriority');

  if (itemType === 'task') {
    if (taskFields) taskFields.style.display = 'block';
    if (scheduleFields) scheduleFields.style.display = 'none';

    if (dueDateInput) { dueDateInput.required = true; dueDateInput.disabled = false; }
    if (startTimeInput) { startTimeInput.required = false; startTimeInput.disabled = true; }
    if (endTimeInput) { endTimeInput.required = false; endTimeInput.disabled = true; }
    if (priorityInput) { priorityInput.required = true; priorityInput.disabled = false; }
  } else {
    if (taskFields) taskFields.style.display = 'none';
    if (scheduleFields) scheduleFields.style.display = 'block';

    if (dueDateInput) { dueDateInput.required = false; dueDateInput.disabled = true; }
    if (startTimeInput) { startTimeInput.required = true; startTimeInput.disabled = false; }
    if (endTimeInput) { endTimeInput.required = true; endTimeInput.disabled = false; }
    if (priorityInput) { priorityInput.required = false; priorityInput.disabled = true; }
  }
}

// フォーム送信時に入力内容をチェックし、問題があれば送信を止める

function validateForm(event) {
  const itemTypeSelect = document.getElementById('itemTypeSelect');
  if (!itemTypeSelect) return;

  const dueDateInput = document.getElementById('inputDueDate');
  const startTimeInput = document.getElementById('inputStartTime');
  const endTimeInput = document.getElementById('inputEndTime');
  const errorMessage = document.getElementById('jsTimeErrorMessage');

  if (errorMessage) errorMessage.textContent = '';

  if (itemTypeSelect.value === 'task') {
    if (!dueDateInput || !dueDateInput.value) return;

    const dueDate = new Date(dueDateInput.value);
    const now = new Date();

    if (dueDate < now) {
      event.preventDefault();
      if (errorMessage) errorMessage.textContent = '締め切り日時は現在より後にしてください';
      return;
    }
  }

  if (itemTypeSelect.value === 'schedule') {
    if (!startTimeInput || !startTimeInput.value || !endTimeInput || !endTimeInput.value) return;

    const startTime = new Date(startTimeInput.value);
    const now = new Date();
    const endTime = new Date(endTimeInput.value);

    if (startTime < now) {
      event.preventDefault();
      if (errorMessage) errorMessage.textContent = '開始日時は現在より後にしてください';
      return;
    }

    if (endTime <= startTime) {
      event.preventDefault();
      if (errorMessage) errorMessage.textContent = '終了日時は開始日時より後にしてください';
      return;
    }
  }
}