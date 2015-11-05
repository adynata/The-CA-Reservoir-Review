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
require 'date'


# # This returns only the stations that have daily levels taken
#
# @res_doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/reservoirs/RES"))
#
# @select_station_ids = []
#
# @res_doc.css('tr').map do |row|
#   station = row.xpath('./td').map(&:text)[1]
#   if station != nil && (station.length == 3)
#     @select_station_ids << station.strip
#   end
# end
#
# @select_station_ids.delete("INP")
# @select_station_ids.delete("DNN")
#
# puts "The count of all station ids is #{@select_station_ids.count}"
#
# # next, we use all of the station ids to generate profiles for all of the major reservoirs listed
# # TODO: find averages for the followign stations so we can reinclude them in the set: DNN, and INP
#
# @select_station_ids.each do |station|
#   # gets most of the information specific to each reservoir
#   @reservoir_page = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/stationInfo?station_id=" + station))
#
#   full_row_data = @reservoir_page.css('tr').xpath('./td').map(&:text)
#
#   # the last essential data element is capacity, which is housed on a separate page
#
#   reservoir_capacity_doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/profile?s="+ station +"&type=res"))
#
#   monthly_avg = {}
#   (3..14).each do |num|
#     average = reservoir_capacity_doc.css('tr')[num].xpath('./td').map(&:text)
#     monthly_avg[average[0]] = average[1][0..-5].to_i
#   end
#   # p station
#   p monthly_avg
#
#   reservoir_name = @reservoir_page.css('h2')[0].text.split.map(&:capitalize).join(' ')
#   reservoir_capacity = reservoir_capacity_doc.css('tr')[1].xpath('./td').map(&:text)[3][0..-3].delete(',').to_i
#   station_id = station
#   longitude = full_row_data[15]
#   city = full_row_data[11].split.map(&:capitalize).join(' ')
#   county = full_row_data[7].split.map(&:capitalize).join(' ')
#   elevation = full_row_data[3]
#   river_basin = full_row_data[5].split.map(&:capitalize).join(' ')+"iver"
#   hydrologic_area = full_row_data[9].split.map(&:capitalize).join(' ')
#   latitude = full_row_data[13]
#   operator = full_row_data[17]
#
#   reservoir = Reservoir.new(
#     name: reservoir_name,
#     station_id: station_id,
#     hydrologic_area: hydrologic_area,
#     river_basin: river_basin,
#     location: city,
#     max_capacity: reservoir_capacity,
#     averages_by_month: monthly_avg,
#     county: county,
#     lat: latitude,
#     lon: longitude,
#     elevation: elevation,
#     operator: operator
#   )
#   reservoir.save!
#
#
#   puts "The name of the reservoir is #{reservoir_name}"
#   puts "The capacity is #{reservoir_capacity}"
#   puts "the station id is #{station_id}"
#   puts "The Longitude is #{longitude} & the latitude is #{latitude}"
#   puts "The nearest city is #{city}, in #{county} county"
#   puts "elevation: #{elevation}, river_basin: #{river_basin}"
#   puts "hydrologic_area: #{hydrologic_area}"
#   puts "operator: #{operator}"
#
#
# end
#
# # Finally, we use the station ids to lookup the daily records for levels of each reservoir
# # NOTE: the date in the query string is currently hard coded because I am being lazy and don't want to think about string manipualtion today.
#
# #This is for testing purposes only, please comment it out!
# # @select_station_ids = ["DON", "ORO"]
#
# # start = Date.today
# # start_date = Date.parse(1/1/1990)
# #
#
# number_of_days = "10000"
#
# @station_ids_limited_data = ["BRD", "DON", "CHV"]
#
# # these need to be started two index places over or you'll store elevation
# @station_ids_broader_data = ["ORO", "CCH","MIL", "ANT", "BUC", "WRS", "SCC", "LEW",  "DNP", "FOL", "PRR", "CMN", "HTH", "NHG", "CLE", "KES", "DAV", "INV", "PAR", "EXC", "PNF", "ICH", "BUL", "TUL", "FRD", "BLB",  "ENG", "SHA", "SNL", "WHI", "NML", "ORO", "UNV", "LON", "COY", "PYM", "HID", "CAS", "ISB", "TRM", "STP", "NAT"]
# # start = Date.today
# # start_date = Date.parse(1/1/1990)
# @stations_need_parsing = []
# #HTH - no data? check
#
#
# @station_ids_limited_data.each do |station|
#   @doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/queryDaily?" + station + "&d=29-Oct-2015+11:19&span=" + number_of_days + "days"))
#
#   levels_arr = []
#   @doc.css('tr').each do |row|
#     one_entry = []
#     date = row.xpath('./td').map(&:text)[0]
#     level = row.xpath('./td').map(&:text)[1]
#     one_entry << date
#     one_entry << level.to_i
#     levels_arr << one_entry
#   end
#
#   # some of the pages returned have tables that are formatted differently, so slightly more is clipped from the data to ensure that what's returned is only levels.
#
#   levels_arr = levels_arr[3..-1]
#
#   last_level = "default"
#
#   counter = 0
#
#   levels_arr.each do |pair|
#     date = pair[0]
#     level = pair[1].to_i
#     if level > 0  && level != nil
#       last_level = level
#       Level.create(reservoir_id: Reservoir.find_by(station_id: station).id,
#                   date: DateTime.strptime(pair[0], '%m/%d/%Y'),
#                   level: level)
#     else
#         Level.create(reservoir_id: Reservoir.find_by(station_id: station).id,
#                     date: DateTime.strptime(pair[0], '%m/%d/%Y'),
#                     level: last_level)
#     end
#     counter += 1
#     if counter % 100 == 0
#       p counter
#     end
#   end
# end
#
# @station_ids_broader_data.each do |station|
#   @doc = Nokogiri::HTML(open("http://cdec.water.ca.gov/cgi-progs/queryDaily?" + station + "&d=13-Oct-2015+11:19&span=" + number_of_days + "days"))
#
#   levels_arr = []
#   @doc.css('tr').each do |row|
#     one_entry = []
#     date = row.xpath('./td').map(&:text)[0]
#     level = row.xpath('./td').map(&:text)[3]
#     one_entry << date
#     one_entry << level.to_i
#     levels_arr << one_entry
#   end
#
#   # some of the pages returned have tables that are formatted differently, so slightly more is clipped from the data to ensure that what's returned is only levels.
#
#   levels_arr = levels_arr[3..-1]
#
#   last_level = "default"
#
#   counter = 0
#
#   levels_arr.each do |pair|
#     date = pair[0]
#     level = pair[1].to_i
#     # p level
#     if level > 0  && level != nil
#       last_level = level
#       Level.create(reservoir_id: Reservoir.find_by(station_id: station).id,
#                   date: DateTime.strptime(pair[0], '%m/%d/%Y'),
#                   level: level)
#     else
#         Level.create(reservoir_id: Reservoir.find_by(station_id: station).id,
#                     date: DateTime.strptime(pair[0], '%m/%d/%Y'),
#                     level: last_level,
#                     month: DateTime.strptime(pair[0], '%m'),
#                     year: DateTime.strptime(pair[0], '%Y'))
#     end
#     counter += 1
#     if counter % 100 == 0
#       p counter
#     end
#   end
#
# end

# end

## sets month and year col for levels
# Level.find_each do |level|
#   level.month = level.date.strftime('%-m').to_i
#   level.year = level.date.strftime('%Y').to_i
#   level.save
# end
# Level.update_all

# reservoir = Reservoir.include(:levels)
#
# years = []
# reservoir.each do |res|
#   years = res.levels.select(:year).distinct
#   years.each do |year|
#     (1..12).each do |month|
#       average = res.levels.where("year = ?", year).where("month = ?", month).average("level").to_i
#     end
#   end
# end
