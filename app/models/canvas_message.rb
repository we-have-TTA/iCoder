# frozen_string_literal: true

class CanvasMessage < ApplicationRecord
  belongs_to :room, optional: true
end
