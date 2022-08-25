# frozen_string_literal: true
class Team < ApplicationRecord
  has_many :users

  validates :name, presence: true
  validates :plan, presence: true
end
