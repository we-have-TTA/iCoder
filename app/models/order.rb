class Order < ApplicationRecord
  belongs_to :team
  belongs_to :creator, class_name: "User", foreign_key: "user_id"
end
