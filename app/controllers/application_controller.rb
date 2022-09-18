# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def after_sign_in_path_for(_resource)
    rooms_path
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[username team_id])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[username team_id])
  end
end
