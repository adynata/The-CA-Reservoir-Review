class AddOperatorColumnToReservoir < ActiveRecord::Migration
  def change
    add_column :reservoirs, :operator, :string
  end
end
