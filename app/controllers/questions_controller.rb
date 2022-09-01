# frozen_string_literal: true
class QuestionsController < ApplicationController
  def index
    @questions = Question.all
  end

  def new
    @question = Question.new
  end

  def create
    # find_team
    @question = current_user.questions.new(clean_params)
    if @question.save
      redirect_to "/questions",notice: "question created"
    else
      render :new
    end
  end

  def show; end

  def edit; end

  def update; end

  def destory; end
  private
  def clean_params
    params.require(:question).permit(:title, :code)
  end
end




