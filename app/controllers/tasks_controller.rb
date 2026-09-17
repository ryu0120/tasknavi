class TasksController < ApplicationController
  before_action :authenticate_user!
  def index
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      redirect_to tasks_path
    else
      render :index, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :item_type, :status, :due_date, :priority, :start_time,
                                 :end_time).merge(user_id: current_user.id)
  end
end
