# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :user_id
end
