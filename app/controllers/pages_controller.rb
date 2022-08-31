# frozen_string_literal: true

class PagesController < ApplicationController
  layout 'index'
  def home
    redirect_to rooms_path if current_user
  end

  def canvas
    render layout: false
  end
end
