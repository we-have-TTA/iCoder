# frozen_string_literal: true

class Room < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'
  belongs_to :team
  belongs_to :question, optional: true
  has_many :codes
  has_many :room_participators
  has_many :canvas_messages

  include AASM

  aasm column: :status do
    state :notstarted, initial: true
    state :started, :ended

    event :interview do
      transitions from: :notstarted, to: :started
    end

    event :endinterview do
      transitions from: %i[started notstarted], to: :ended
    end
  end
end
