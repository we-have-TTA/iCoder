# frozen_string_literal: true

class ChatsController < ApplicationController
  def index
    @message = Message.new
  end
end
