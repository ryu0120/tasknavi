// モーダルとフォームのイベントを設定

function setupModalEvents() {
  const openModalButton = document.getElementById('openModalButton');
  const closeModalButton = document.getElementById('closeModalButton');
  const itemTypeSelect = document.getElementById('itemTypeSelect');
  const form = document.getElementById('addTaskForm');

  if (openModalButton) {
    openModalButton.addEventListener('click', openModal);
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  if (itemTypeSelect) {
    itemTypeSelect.addEventListener('change', toggleFormFields);
  }

  if (form) {
    form.addEventListener('submit', validateForm);
  }
}

// Turboでページが読み込まれたときにモーダル・フォームのイベントを設定
document.addEventListener('turbo:load', setupModalEvents);

//  モーダルの開閉制御

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


// 背景モーダル部分クリックで閉じる

window.addEventListener('click', function(event) {
  const modal = document.getElementById('taskModal');

  if (event.target === modal) {
    closeModal();
  }
});

//  種別（タスク／予定）に応じた入力フィールドの動的切り替え

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

    if (dueDateInput) dueDateInput.required = true;
    if (dueDateInput) dueDateInput.disabled = false;
    if (startTimeInput) startTimeInput.required = false;
    if (startTimeInput) startTimeInput.disabled = true;
    if (endTimeInput) endTimeInput.required = false;
    if (endTimeInput) endTimeInput.disabled = true;
    if (priorityInput) priorityInput.required = true;
    if (priorityInput) priorityInput.disabled = false;
  } else {

    if (taskFields) taskFields.style.display = 'none';
    if (scheduleFields) scheduleFields.style.display = 'block';

    if (dueDateInput) dueDateInput.required = false;
    if (dueDateInput) dueDateInput.disabled = true;
    if (startTimeInput) startTimeInput.required = true;
    if (startTimeInput) startTimeInput.disabled = false;
    if (endTimeInput) endTimeInput.required = true;
    if (endTimeInput) endTimeInput.disabled = false;
    if (priorityInput) priorityInput.required = false;
    if (priorityInput) priorityInput.disabled = true;
  }
}
// フォーム送信時に入力内容をチェックし、問題があれば送信を止める

function validateForm(event) {
    const itemTypeSelect = document.getElementById('itemTypeSelect');
    const dueDateInput = document.getElementById('inputDueDate');
    const startTimeInput = document.getElementById('inputStartTime');
    const endTimeInput = document.getElementById('inputEndTime');
    const errorMessage = document.getElementById('jsTimeErrorMessage');
    errorMessage.textContent = '';

    if (itemTypeSelect.value === 'task') {
      const dueDate = new Date(dueDateInput.value);
      const now = new Date();

      if (dueDate < now) {
        event.preventDefault();
        errorMessage.textContent = '締め切り日時は現在より後にしてください';
        return;
      }
    }

    if (itemTypeSelect.value === 'schedule') {
      const startTime = new Date(startTimeInput.value);
      const now = new Date();
      const endTime = new Date(endTimeInput.value);

      if (startTime < now) {
        event.preventDefault();
        errorMessage.textContent = '開始日時は現在より後にしてください';
        return;
      }

      if (endTime <= startTime) {
        event.preventDefault();
        errorMessage.textContent = '終了日時は開始日時より後にしてください';
        return;
      }
    }
}


