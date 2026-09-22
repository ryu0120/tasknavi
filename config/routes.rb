Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'
  get 'tasks/today', to:'tasks#today', as: :today_tasks
  resources :tasks
end
