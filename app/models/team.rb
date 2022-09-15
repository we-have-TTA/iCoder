# frozen_string_literal: true

class Team < ApplicationRecord
  has_many :users
  has_many :questions
  has_many :orders
  has_many :rooms
  has_many :homeworks
  has_one_attached :avatar

  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'

  validates :name, presence: true
  validates :plan, presence: true
end
