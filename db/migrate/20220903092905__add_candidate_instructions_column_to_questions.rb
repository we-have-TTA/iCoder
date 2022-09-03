class AddCandidateInstructionsColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :candidate_instructions, :text
  end
end
