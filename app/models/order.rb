# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :team
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'

  aasm column: 'state', no_direct_assignment: true do
    state :pending, initial: true
    state :paid, :refunded, :cancelled, :failed

    event :pay do # 付款成功
      transitions from: %i[pending failed], to: :paid

      after do
        user.update(role: 'vip')
      end
    end

    event :fail do # 付款失敗
      transitions from: :pending, to: :failed
    end

    event :cancel do # 訂單取消
      transitions from: %i[pending failed], to: :cancelled
    end

    event :refund do # 訂單退款
      transitions from: :paid, to: :refunded
    end
  end


end
