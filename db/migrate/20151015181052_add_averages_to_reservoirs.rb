class AddAveragesToReservoirs < ActiveRecord::Migration
  def change
    add_column :reservoirs, :averages_by_month, :hstore, default: {}, null: false
  end
end
