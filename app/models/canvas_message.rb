class CanvasMessage < ApplicationRecord
  belongs_to :room, optional: true
end
