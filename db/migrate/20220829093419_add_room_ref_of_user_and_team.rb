class AddRoomRefOfUserAndTeam < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :rooms, :teams, null: false
    add_belongs_to :rooms, :users, null: false
  end
end
