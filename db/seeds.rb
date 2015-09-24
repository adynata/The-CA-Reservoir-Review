# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'



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


file = "db/ORO.csv"

data = CSV.read(file)[2 .. -1]

data.each do |row|

  date = Date.strptime row[0], '%m/%d/%Y'
  reservoir_id = Reservoir.find_by(station_id: "ORO").id

  level = Level.new(
    reservoir_id: reservoir_id,
    level: row[3],
    date: date)

  level.save
end

# data.each do |row|
#   if firstrow
#     date = Date.strptime row[0], '%m/%d/%Y'
#     storage = row[3]
#     p "storage is #{storage}, date is #{date}"
#     # p date.to_date
#     p date.class
#     firstrow = false
#   end
# end
