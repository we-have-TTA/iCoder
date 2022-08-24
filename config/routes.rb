Rails.application.routes.draw do
  # member
  devise_for :users
  # 解決devise註冊及忘記密碼出錯時重新整理沒路徑
  devise_scope :user do
  get '/users', to: 'devise/registrations#new'
  get '/users/password', to: 'devise/passwords#new'
  end

  get 'pages/home'
  root to: 'pages#home'
  #金流路徑
  resources :plans,only:[:show]
  resources :orders,except:[:edit,:update,:destroy] do
    member do delete :cancel 
    end
  end
end
