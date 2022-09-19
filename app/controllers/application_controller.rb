# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Backend
<<<<<<< HEAD
=======
  include Pundit::Authorization

  rescue_from Pundit::NotAuthorizedError, with: :no_permission

  private

  def no_permission
    redirect_to '/', notice: '無此操作權限'
  end
>>>>>>> origin/main
end
