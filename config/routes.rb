Rails.application.routes.draw do
  # member
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  # 解決devise註冊及忘記密碼出錯時重新整理沒路徑
  devise_scope :user do
  get '/users', to: 'devise/registrations#new'
  get '/users/password', to: 'devise/passwords#new'
  end

  get '/', to: 'pages#home'
  get '/canvas', to: 'pages#canvas'
  root to: 'teams#index'

  scope "dashboard" do
    resources :rooms
    resources :members, controller: :teams, only:[:index, :new, :create, :destroy]
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
