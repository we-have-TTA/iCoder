class RemoveRoomsTeamIdAndUserId < ActiveRecord::Migration[6.1]
  def change
    remove_column :rooms, :team_id, :integer
    remove_column :rooms, :user_id, :integer
  end
end
