# frozen_string_literal: true

Rails.application.routes.draw do
  get '/chats', to: 'chats#index'
  resources :messages, only:[:new, :create]

  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks',registrations: 'users/registrations'  }

  devise_scope :user do
    post '/users', to: 'users/registrations#create'
    get '/users/password', to: 'devise/passwords#new'
    get '/users', to: 'devise/registrations#new'
  end
  

  get '/', to: 'pages#home'
  get '/canvas', to: 'pages#canvas'

  scope 'dashboard' do
    resources :rooms, except: %i[new show]
    resources :members, controller: :teams, only: %i[index new create destroy]
    resource :teams, only:[:edit, :update]
    post 'rooms/createruntime', action: 'create_runtime', controller: :rooms
    get 'rooms/team_plan', action: 'team_plan', controller: :rooms
    get 'rooms/countdown', action: 'countdown', controller: :rooms
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

  patch '/api/v1/rooms/change_roomtitle',to: 'api/v1/rooms#change_roomtitle'
  get '/:uuid', to: 'rooms#show', as: 'room_uuid'
  get '/:uuid/invite', to: 'rooms#invite', as: 'invite'
  post '/:uuid/invite', to: 'rooms#send_invitation'
  patch '/:uuid/startroom', to: 'rooms#start_room', as:'start_room'
  patch '/:uuid/endroom', to: 'rooms#end_room', as:'end_room'

  namespace :api do
    namespace :v1 do
      namespace :users do
        post 'rooms', action: :find_rooms_by_user, controller: :rooms
      end
      resources :rooms, only: [] do
        member do
          post :run
          get :catch_questions
          get 'question/:question_id', action: :show
        end
      end

      scope 'questions/example', module: :questions do
        get ':id', action: :example, as: :questions_example
      end
      resources :questions, only: [:show]
    end
  end
end
