# frozen_string_literal: true

class Room < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'
  belongs_to :team
  has_one :question
  has_many :codes
end
