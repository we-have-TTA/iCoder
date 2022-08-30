class TeamsController < ApplicationController

  def index
  end

  def new
  end

  def create
    render html: params
    # @team = Team.new(params[:team])
    # if @team.save
    #   flash[:success] = "Object successfully created"
    #   redirect_to @team
    # else
    #   flash[:error] = "Something went wrong"
    #   render 'new'
    # end
  end
  



end
