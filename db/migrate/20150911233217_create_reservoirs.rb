class CreateReservoirs < ActiveRecord::Migration
  def change
    create_table :reservoirs do |t|
      t.string :name, null: false
      t.string :hydrologic_area, null: false
      t.string :river_basin
      t.string :station_id, null: false
      t.string :location, null: false
      t.integer :max_capacity, null: false
      t.string :county, null: false
      t.string :lat, null: false
      t.string :lon, null: false
      t.timestamps null: false
      t.integer :elevation, null: false
    end
  end
end
