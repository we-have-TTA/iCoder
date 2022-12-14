# frozen_string_literal: true

class User < ApplicationRecord
  # relationships
  belongs_to :team, optional: true
  has_many :rooms, dependent: :destroy
  has_many :questions, dependent: :destroy
  has_many :homeworks, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :comments, dependent: :destroy

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
      username: data['username'] || data['email'].split('@').first,
      password: Devise.friendly_token[0, 20]
    )
    user
  end

  after_create :join_team

  private

  def join_team
    self.team = Team.create(name: username, creator: self) if team.nil?
    save
  end
end
