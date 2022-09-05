class AddUuidToRoom < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :uuid, :string
  end
end
