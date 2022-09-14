# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user!

  layout 'dashboard'

  def index
    @users = current_user.team.users
  end

  def new; end

  def create; end

    def edit
    @team = current_user.team    
  end

  def update
    @team = current_user.team    
    if @team.update(team_params)
    redirect_to members_path
    else
    render :edit
    end
  end

  def invite
    render html: params
  end

  private
  def team_params
    params.require(:team).permit(:name, :avatar)
  end
end
