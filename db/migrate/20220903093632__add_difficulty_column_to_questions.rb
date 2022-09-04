class AddDifficultyColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :difficulty, :text
  end
end
