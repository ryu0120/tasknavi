Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'
  resources :tasks, only: [:create, :update]
  get 'tasks/today', to:'tasks#today', as: :today_tasks
end
