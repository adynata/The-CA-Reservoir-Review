# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)



oro_reservoir = Reservoir.new(
  id: nil,
  name: "Lake Oroville",
  station_id: "ORO",
  hydrologic_area: "Sacramento River",
  river_basin: "Feather River",
  location: "Oroville, CA",
  max_capacity: "3,537,577",
  county: "Butte",
  lat: "39.54000",
  lon: "-121.49300",
  created_at: nil,
  updated_at: nil,
  elevation: 900
)

oro_reservoir.save!
