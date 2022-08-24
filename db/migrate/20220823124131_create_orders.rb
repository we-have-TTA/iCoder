class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders do |t|
      t.string :serial
      t.integer :price
      t.string :state
      t.integer :user_id
      t.text :note

      t.timestamps
    end
  end
end
