class Task < ApplicationRecord
  belongs_to :user

  enum item_type: { task: 0, schedule: 1 }
  enum priority: { low: 0, medium: 1, high: 2 }
  enum status: { todo: 0, done: 1 }

  # 共通で必須
  validates :title, presence: true
  validates :item_type, presence: true
  validates :status, presence: true

  # タスクの場合のみ締め切りを必須
  validates :due_date, presence: true, if: :task?
  validates :priority, presence: true, if: :task?
  # 予定の場合のみ開始・終了時刻を必須
  validates :start_time, presence: true, if: :schedule?
  validates :end_time, presence: true, if: :schedule?
end
