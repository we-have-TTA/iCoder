# frozen_string_literal: true

class RoomParticipator < ApplicationRecord
  belongs_to :room
end
