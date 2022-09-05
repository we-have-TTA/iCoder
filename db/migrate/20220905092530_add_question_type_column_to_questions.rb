class AddQuestionTypeColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :question_type, :text
  end
end
