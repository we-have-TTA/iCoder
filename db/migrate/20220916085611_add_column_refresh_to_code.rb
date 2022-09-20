class AddColumnRefreshToCode < ActiveRecord::Migration[6.1]
  def change
    add_column :codes, :refresh, :boolean
  end
end
