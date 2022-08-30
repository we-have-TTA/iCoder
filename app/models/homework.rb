# frozen_string_literal: true

class Homework < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'
  belongs_to :team
end
