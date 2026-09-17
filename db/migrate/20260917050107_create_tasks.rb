class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.string     :title, null:false
      t.integer    :item_type, null: false, default: 0 #0: task, 1: schedule
      t.integer    :status, null: false, default: 0 #0: todo, 1: done

      #タスク用（予定の時はnullになる）
      t.datetime :due_date, null: true
      t.integer  :priority, null: true #0: low, 1: medium, 2: high

      #予定用（タスクの時はnullになる）
      t.datetime :start_time, null: true
      t.datetime :end_time, null: true

      t.timestamps
    end
  end
end
