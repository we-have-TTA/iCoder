# frozen_string_literal: true

class PagesController < ApplicationController
  layout "index"
  def home; end
  def canvas
    render layout: false
  
  end

end
