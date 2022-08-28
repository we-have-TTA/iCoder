class ChangeColumnName < ActiveRecord::Migration[6.1]
  def change
    rename_column :rooms, :type, :category
  end
end
