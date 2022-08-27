# frozen_string_literal: true

class Order < ApplicationRecord
  include AASM
  belongs_to :user

  validates :price, :state, presence: true

  before_create :create_serial

  aasm column: 'state', no_direct_assignment: true do
    state :pending, initial: true
    state :paid, :refunded, :cancelled, :failed

    event :pay do
      transitions from: %i[pending failed], to: :paid

      after do
        user.update(role: 'vip')
      end
    end

    event :fail do
      transitions from: :pending, to: :failed
    end

    event :cancel do
      transitions from: %i[pending failed], to: :cancelled
    end

    event :refund do
      transitions from: :paid, to: :refunded
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
end
