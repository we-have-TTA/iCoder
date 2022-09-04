class ChangeColumnDifficultyToBeStringInQuestions < ActiveRecord::Migration[6.1]
  def change
    change_column :questions, :difficulty, :string
  end
end
