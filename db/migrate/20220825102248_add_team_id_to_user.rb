class AddTeamIdToUser < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :users, :team
  end
end
