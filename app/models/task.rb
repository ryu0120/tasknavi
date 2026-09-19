class Task < ApplicationRecord
  belongs_to :user

  enum item_type: { task: 0, schedule: 1 }
  enum priority: { low: 0, medium: 1, high: 2 }
  enum status: { todo: 0, done: 1 }

  # 共通で必須
  validates :title, presence: true
  validates :item_type, presence: true
  validates :status, presence: true

  # タスクの場合のみ締め切り・優先度を必須
  validates :due_date, presence: true, if: :task?
  validate  :due_date_cannot_be_in_the_past, if: :task?
  validates :priority, presence: true, if: :task?
  # 予定の場合のみ開始・終了時刻を必須
  validates :start_time, presence: true, if: :schedule?
  validates :end_time, presence: true, if: :schedule?
  validate :start_time_cannot_be_in_the_past, if: :schedule?
  validate :end_time_after_start_time, if: :schedule?

  def due_date_cannot_be_in_the_past
    return if due_date.blank?

    errors.add(:due_date) if due_date < Time.current
  end

  def start_time_cannot_be_in_the_past
    return if start_time.blank?

    errors.add(:start_time) if start_time < Time.current
  end

  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?

    errors.add(:end_time) if end_time <= start_time
  end
end
