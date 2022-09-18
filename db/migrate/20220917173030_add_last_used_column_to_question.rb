class AddLastUsedColumnToQuestion < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :last_used, :datetime
  end
end
