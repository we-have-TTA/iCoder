# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :question
  belongs_to :user
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :comments, foreign_key: :parent_id, dependent: :destroy
  # has_rich_text :content
  validates :content, presence: true
end
