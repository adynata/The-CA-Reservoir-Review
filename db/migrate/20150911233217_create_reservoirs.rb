class CreateReservoirs < ActiveRecord::Migration
  def change
    create_table :reservoirs do |t|
      t.string :name, null: false
      t.string :location, null: false
      t.integer :max_capacity, null: false
      t.float :lat, null: false
      t.float :lon, null: false
      t.timestamps null: false
    end
  end
end
