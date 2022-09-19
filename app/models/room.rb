# frozen_string_literal: true

class Room < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'
  belongs_to :team
  has_one :question

  include AASM

  aasm column: :status do
    state :notstarted, initial: true
    state :started, :ended
  
    event :interview do
      transitions from: :notstarted, to: :started
    end
  
    event :endinterview do
      transitions from: [:started, :notstarted], to: :ended
    end

  end

end
