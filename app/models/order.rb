# frozen_string_literal: true

class Order < ApplicationRecord
  include AASM
  belongs_to :team
  belongs_to :creator, class_name: 'User', foreign_key: 'user_id'

  validates :price, presence: true

  before_create :create_serial

  aasm column: 'state', no_direct_assignment: true do
    state :pending, initial: true
    state :paid, :refunded, :cancelled, :failed

    event :pay do # 付款成功
      transitions from: %i[pending failed], to: :paid
      after do
        team.update(plan: 'vip')
      end
    end

    event :fail do # 付款失敗
      transitions from: %i[pending paid], to: :failed
    end

    event :cancel do # 訂單取消
      transitions from: %i[pending failed], to: :cancelled
    end

    event :refund do # 訂單退款
      transitions from: :paid, to: :refunded
    end

    event :back_to_normal do # for test
      transitions from: :paid, to: :pending

      after do
        team.update(plan: 'normal')
      end
    end
  end
end

private

def create_serial
  # "ORD20220815XXXXXX(0~9a-zA-Z)"
  now = Time.now

  self.serial = format('ORD%<year>i%<month>.2i%<day>.2i%<rnd>s',
                       year: now.year,
                       month: now.month,
                       day: now.day,
                       rnd: SecureRandom.alphanumeric(6).upcase)
end
