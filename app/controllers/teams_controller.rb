# frozen_string_literal: true

class TeamsController < ApplicationController
  layout 'dashboard'

  def index
    @users = current_user.team.users
  end

  def new; end

  def create; end

  def invite
    render html: params
  end
end
