# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
<<<<<<< HEAD
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: %i[github google_oauth2]

  def display_name
    # 如果有name就顯示，不然才顯示email
    username || email
  end
  validates :username, presence: true

  # 第三方登入
  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.where(email: data['email']).first
    # Uncomment the section below if you want users to be created if they don't exist
    user ||= User.create(
      email: data['email'],
      password: Devise.friendly_token[0, 20]
    )
    user
  end
=======
         :recoverable, :rememberable, :validatable
>>>>>>> feature/Room

  has_many :rooms
      
end
