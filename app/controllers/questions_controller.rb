# frozen_string_literal: true
class QuestionsController < ApplicationController
  def index
    @questions = Question.all
    # render html: params
  end

  def new
    @question = Question.new
  end

  def create
    @question = current_user.questions.new(clean_params)
    if @question.save
      redirect_to "/dashboard/questions",notice: "question created"
    else
      render :new
    end
  end

  def show
    find_question
  end

  def edit
    find_question
  end

  def update
    find_question
    if @question.update(clean_params)
      redirect_to "/dashboard/questions",notice: "Edited!!"
    else
      render :edit
    end
  end

  def destroy
    find_question
    @question.destroy
    redirect_to "/dashboard/questions",notice: "DELETE!!"
  end

  
  def search
    render html: params
  end
  
  private

  def find_question
    @question =Question.find(params[:id])
    # @question = current_user.team 
  end
  
  def find_team
    @team = current_user.team 
  end

  def clean_params
    params.require(:question).permit(:title, :code).merge(team: current_user.team)
  end
end




