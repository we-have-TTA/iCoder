# frozen_string_literal: true

class Question < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'
  belongs_to :team

  has_many :comments, dependent: :destroy

  validates :title, presence: true
  validates :code, presence: true
end
