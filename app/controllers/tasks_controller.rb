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

    # カレンダー用データセットアップ
    set_calendar_data
  end

  def index
    # 1. 全タスク（締め切りが近い順）
    @tasks = current_user.tasks.where(item_type: :task).order(due_date: :asc)

    # 2. 全予定（開始日時が近い順）
    @schedules = current_user.tasks.where(item_type: :schedule).order(start_time: :asc)
  end

  def show
    @task = current_user.tasks.find(params[:id])
  end

  def edit
    @task = current_user.tasks.find(params[:id])
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      render turbo_stream: turbo_stream.append_all('body', "<script>window.location.href='#{today_tasks_path}'</script>")
    else
      # エラー時の再描画に必要な変数を準備
      today_start = Time.zone.now.beginning_of_day
      today_end = Time.zone.now.end_of_day
      @today_tasks = current_user.tasks.where(item_type: :task, due_date: today_start..today_end)
      @today_schedules = current_user.tasks.where(item_type: :schedule, start_time: ..today_end, end_time: today_start..)
      @upcoming_tasks = current_user.tasks.where(item_type: :task, due_date: (today_end + 1.second)..(today_end + 3.days))

      set_calendar_data
      render :today, status: :unprocessable_entity
    end
  end

  def update
    @task = current_user.tasks.find(params[:id])

    if @task.update(task_params)
      respond_to do |format|
        # 1. index.html.erb / today.html.erb のチェックボックス（fetch非同期通信）
        format.json { render json: { status: 'success', task: @task } }

        # 2. edit.html.erb（編集フォームからの通常送信）
        format.html { redirect_to task_path(@task), notice: '更新しました' }
      end
    else
      respond_to do |format|
        # 1. 非同期通信でエラー時（JS側の response.ok が false になりチェックが元に戻る）
        format.json { render json: @task.errors, status: :unprocessable_entity }

        # 2. 編集フォームでバリデーションエラー時（編集画面を再描画）
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy
    redirect_to tasks_path
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

  def set_calendar_data
    # 表示対象の年月（パラメータ指定がなければ今月）
    @target_date = params[:month] ? Date.parse(params[:month]).beginning_of_month : Date.today.beginning_of_month

    # カレンダーのマス目を埋める日付（日曜始まり〜土曜終わり）
    calendar_start = @target_date.beginning_of_month.beginning_of_week(:sunday)
    calendar_end = @target_date.end_of_month.end_of_week(:sunday)
    @calendar_days = (calendar_start..calendar_end).to_a

    # 1. タスク（締め切り日）が存在する日付
    task_dates = current_user.tasks
                             .where(item_type: :task, due_date: calendar_start.beginning_of_day..calendar_end.end_of_day)
                             .pluck(:due_date)
                             .compact
                             .map(&:to_date)

    # 2. 予定（開始日時）が存在する日付
    schedule_dates = current_user.tasks
                                 .where(item_type: :schedule, start_time: calendar_start.beginning_of_day..calendar_end.end_of_day)
                                 .pluck(:start_time)
                                 .compact
                                 .map(&:to_date)

    # タスクまたは予定がある日付の集合（重複排除）
    @event_dates = (task_dates + schedule_dates).uniq
  end
end
