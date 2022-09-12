# frozen_string_literal: true

Rails.application.routes.draw do
  get '/chats', to: 'chats#index'
  resources :messages, only:[:new, :create]

  devise_scope :user do
    post '/users', to: 'users/registrations#create'
    get '/users/password', to: 'devise/passwords#new'
    get '/users', to: 'devise/registrations#new'
  end
  
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  get '/', to: 'pages#home'
  get '/canvas', to: 'pages#canvas'

  scope 'dashboard' do
    resources :rooms, except: %i[new show]
    resources :members, controller: :teams, only: %i[index new create destroy]
    post 'rooms/createruntime', action: 'create_runtime', controller: :rooms
    resources :questions do
      resources :comments, shallow: true, only: %i[create update destroy]
    end
  end

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

  namespace :api do
    namespace :v1 do
      resources :rooms, only: [] do
        member do
          post :run
          get :catch_questions
        end
      end

      scope 'questions/example', module: :questions do
        get ':id', action: :example, as: :questions_example
      end
      resources :questions, only: [:show]
    end
  end
end
