class TasksController < ApplicationController
  before_action :authenticate_user!
  def today
    @task = Task.new

    today_start = Time.zone.now.beginning_of_day
    today_end = Time.zone.now.end_of_day

    @today_tasks = current_user.tasks.where(
      item_type: :task,
      due_date: today_start..today_end
    )

    @today_schedules = current_user.tasks.where(
      item_type: :schedule,
      start_time: ..today_end,
      end_time: today_start..
    )

    @upcoming_tasks = current_user.tasks.where(
      item_type: :task,
      due_date: (today_end + 1.second)..(today_end + 3.days)
    )
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      redirect_to today_tasks_path
    else
      render :today, status: :unprocessable_entity
    end
  end

  def update
    @task = Task.find(params[:id])
    @task.update(update_task_params)
  end

  private

  def task_params
    params.require(:task).permit(:title, :item_type, :status, :due_date, :priority, :start_time,
                                 :end_time).merge(user_id: current_user.id)
  end

  def update_task_params
    params.require(:task).permit(:title, :item_type, :status, :due_date, :priority, :start_time,
                                 :end_time)
  end
end
