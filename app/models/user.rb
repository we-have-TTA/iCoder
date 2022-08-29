# frozen_string_literal: true

class User < ApplicationRecord
  # relationships
  has_one :team
  has_many :rooms
  has_many :questions
  has_many :homeworks
  has_many :orders
  

  # validatations
  validates :username, presence: true

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: %i[github google_oauth2]

  def display_name
    # 如果有name就顯示，不然才顯示email
    username || email
  end

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
end
