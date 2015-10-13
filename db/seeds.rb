# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'nokogiri'
require 'open-uri'
require 'csv'


# This returns only the stations that have daily levels taken

@res_doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/reservoirs/RES
"))

@select_station_ids = []

@res_doc.css('tr').map do |row|
  station = row.xpath('./td').map(&:text)[1]
  if station != nil && (station.length == 3)
    @select_station_ids << station.strip
  end
end

puts "The count of all station ids is #{@select_station_ids.count}"

# next, we use all of the station ids to generate profiles for all of the major reservoirs listed

@select_station_ids.each do |station|
  # gets most of the information specific to each reservoir
  @reservoir_page = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/stationInfo?station_id=" + station))

  full_row_data = @reservoir_page.css('tr').xpath('./td').map(&:text)

  # the last essential data element is capacity, which is housed on a separate page

  reservoir_capacity_doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/profile?s="+ station +"&type=res"))

  reservoir_name = @reservoir_page.css('h2')[0].text.split.map(&:capitalize).join(' ')
  reservoir_capacity = reservoir_capacity_doc.css('tr')[1].xpath('./td').map(&:text)[3][0..-3].delete(',').to_i
  station_id = station
  longitude = full_row_data[15]
  city = full_row_data[11].split.map(&:capitalize).join(' ')
  county = full_row_data[7].split.map(&:capitalize).join(' ')
  elevation = full_row_data[3]
  river_basin = full_row_data[5].split.map(&:capitalize).join(' ')+"iver"
  hydrologic_area = full_row_data[9].split.map(&:capitalize).join(' ')
  latitude = full_row_data[13]
  operator = full_row_data[17]

  reservoir = Reservoir.new(
    name: reservoir_name,
    station_id: station_id,
    hydrologic_area: hydrologic_area,
    river_basin: river_basin,
    location: city,
    max_capacity: reservoir_capacity,
    county: county,
    lat: latitude,
    lon: longitude,
    elevation: elevation,
    operator: operator
  )
  reservoir.save!

  puts "The name of the reservoir is #{reservoir_name}"
  puts "The capacity is #{reservoir_capacity}"
  puts "the station id is #{station_id}"
  puts "The Longitude is #{longitude} & the latitude is #{latitude}"
  puts "The nearest city is #{city}, in #{county} county"
  puts "elevation: #{elevation}, river_basin: #{river_basin}"
  puts "hydrologic_area: #{hydrologic_area}"
  puts "operator: #{operator}"


end

# Finally, we use the station ids to lookup the daily records for levels of each reservoir
# NOTE: the date in the query string is currently hard coded because I am being lazy and don't want to think about string manipualtion today.

#This is for testing purposes only, please comment it out!
# @select_station_ids = ["DON", "ORO"]


number_of_days = "365"

@select_station_ids.each do |station|
  @doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/queryDaily?" + station + "&d=25-Sept-2015+11:19&span=" + number_of_days + "days"))

  levels_arr = []
  @doc.css('tr').each do |row|
    one_entry = []
    date = row.xpath('./td').map(&:text)[0]
    level = row.xpath('./td').map(&:text)[1]
    one_entry << date
    one_entry << level
    levels_arr << one_entry
  end

  # some of the pages returned have tables that are formatted differently, so slightly more is clipped from the data to ensure that what's returned is only levels.

  levels_arr = levels_arr[3..-1]

  # create a level in the db for each pair:

  levels_arr.each do |pair|
    date = pair[0]
    level = pair[1]
    Level.create(reservoir_id: Reservoir.find_by(station_id: station).id,
                date: DateTime.strptime(pair[0], '%m/%d/%Y'),
                level: pair[1])
  end


end
