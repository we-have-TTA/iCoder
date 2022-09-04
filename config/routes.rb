# frozen_string_literal: true

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

  scope 'dashboard' do
    resources :rooms, except: %i[new show]
    scope "member" do
      get :invite, controller: :teams, action: "invite"
    end
    resources :members, controller: :teams, only: %i[index new create destroy]
    post 'rooms/createruntime', action: 'create_runtime', controller: :rooms
    resources :questions
  end
  # 金流路徑
  resource :plans, only: [:show]
  resources :orders, except: %i[edit update destroy] do
    member do
      get :pay
      post :pay, action: 'submit_payment'
      delete :cancel
    end
  end

  get '/:uuid', to: 'rooms#show', as: 'room_uuid'
  get '/:uuid/invite', to: 'rooms#invite', as: 'invite'
  post '/:uuid/invite', to: 'rooms#send_invitation'
end
