class ChangeStatusToStringInRooms < ActiveRecord::Migration[6.1]
  def change
    change_column :rooms, :status, :string
  end
end
