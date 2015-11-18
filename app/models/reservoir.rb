# == Schema Information
#
# Table name: reservoirs
#
#  id                :integer          not null, primary key
#  name              :string           not null
#  hydrologic_area   :string           not null
#  river_basin       :string
#  station_id        :string           not null
#  location          :string           not null
#  max_capacity      :integer          not null
#  county            :string           not null
#  lat               :string           not null
#  lon               :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  elevation         :integer          not null
#  operator          :string
#  averages_by_month :hstore           default({}), not null
#

class Reservoir < ActiveRecord::Base
  has_many :levels
  has_many :monthly_averages

  MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]


  def all_daily_levels
    daily_levels = []
    levels.each do |level|
      level_daily = {}
      level_daily[level.date.to_s] = level.level
      daily_levels << level_daily
    end
    return daily_levels
  end

  def self.all_coordinates
    @reservoirs = Reservoir.all
    station_json = {}
    station_json["type"] = "FeatureCollection"
    station_json["features"] = []

    @reservoirs.each do |res|
      res_obj = {}
      res_obj["type"] = "Feature"
      res_obj["properties"] = {}
      res_obj["properties"]["name"] = res.name
      res_obj["properties"]["id"] = res.id
      res_obj["properties"]["county"] = res.county
      res_obj["geometry"] = {}
      res_obj["geometry"]["type"] = "Point"
      res_obj["geometry"]["coordinates"] = []
      res_obj["geometry"]["coordinates"] << res.lat.to_f
      res_obj["geometry"]["coordinates"] << res.lon.to_f
      station_json["features"] << res_obj
    end
    return station_json
  end

  def daily_by_year(year)
    by_year1 = levels.where('extract(year from date) = ?', year)
    by_year = {}
    by_year["id"] = self.id
    by_year["reservoir"] = self.name
    by_year["year"] = year
    by_year["levels"] = []
    by_year1.each do |level|
      pair = []
      pair << level.date
      pair << level.level
      by_year["levels"] << pair
    end
    return by_year
  end

  def monthly_levels(year)
    levels_set = Reservoir.includes(:levels).find_by(id: self.id).levels.group(:month).where("year = ?", year).average("level")
    levels_set.each.map {|k, v|  levels_set[k] = v.to_f}
    levels_set
  end

  def monthly_by_year_averaged(year)
    monthly_av_year = monthly_levels(year)
    monthly_av = monthly_av_obj
    (0..11).each do |i|
      spec_pair = {}
      average_specific_month = monthly_av_year[i + 1]
      spec_pair["x"] = MONTHS[i]
      spec_pair["y"] = (average_specific_month.to_f/max_capacity.to_f)
      monthly_av["values"] << spec_pair
    end
    return monthly_av
  end

  def self.collection_of_averages(arr, year)
    # arr.map {|station| find_by_id(station).monthly_by_year(year)}
    collection_of_avgs = where(id: arr).includes(:levels).group(:month, :name, :reservoir_id).where("year = ?", year).average("level").sort
    # one for every el in arr
    monthly_av = {}
    collection_of_avgs.each do |v|
      station = v[0][2]
      month_num = v[0][0] - 1
      station_name = v[0][1]
      value = v[1].to_f
      if monthly_av[station]
        pair = {}
        pair["x"] = MONTHS[month_num]
        pair["y"] = value
        monthly_av[station]["values"] << pair
      else
        monthly_av[station] = {}
        monthly_av[station]["id"] = station
        monthly_av[station]["key"] = station_name
        monthly_av[station]["values"] = []
        pair = {}
        pair["x"] = MONTHS[month_num]
        pair["y"] = value
        monthly_av[station]["values"] << pair
      end
    end
    return monthly_av.values
  end

  def monthly_by_year(year)
    monthly_av_year = monthly_levels(year)
    monthly_av = monthly_av_obj
    (0..11).each do |i|
      spec_pair = {}
      average_specific_month = monthly_av_year[i + 1]
      spec_pair["x"] = MONTHS[i]
      spec_pair["y"] = (average_specific_month.to_f)
      monthly_av["values"] << spec_pair
    end
    return monthly_av
  end

  def monthly_av_obj
    monthly_av = {}
    monthly_av["id"] = self.id
    monthly_av["key"] = self.name
    monthly_av["nonStackable"] = true
    monthly_av["values"] = []
    monthly_av
  end


  def monthly_percent_by_year(year)
    monthly_av_year = monthly_levels(year)
    monthly_av_overall = {}
    averages_by_month.each { |k, v| monthly_av_overall[DateTime.strptime(k, '%B').month] = v }
    monthly_by_av_v_capacity = make_stacked_chart_obj_spec(monthly_av_year, year)
    overall_monthly_by_av_v_capacity = make_stacked_chart_obj_gen(monthly_av_overall)

    return [monthly_by_av_v_capacity, overall_monthly_by_av_v_capacity]
  end

  def make_stacked_chart_obj_spec(levels, year)
    monthly_by_av_v_capacity = {}
    monthly_percent_spec = []
    (0..11).each do |i|
      spec_pair = {}
      average_specific_month = levels[i + 1]
      spec_pair["x"] = MONTHS[i]
      spec_pair["y"] = (average_specific_month.to_f/max_capacity.to_f)
      monthly_percent_spec << spec_pair
    end
    monthly_by_av_v_capacity["key"] = name + " % of capacity, " + year.to_s
    monthly_by_av_v_capacity["nonStackable"] = true
    monthly_by_av_v_capacity["values"] = monthly_percent_spec
    monthly_by_av_v_capacity
  end

  def make_stacked_chart_obj_gen(levels)
    overall_monthly = {}
    monthly_percent_overall = []
    (0..11).each do |i|
      overall_pair = {}
      average_overall_month = levels[i + 1]
      overall_pair["label"] = "average for " + MONTHS[i]
      overall_pair["x"] = MONTHS[i]
      overall_pair["y"] = (average_overall_month.to_f/max_capacity.to_f)
      monthly_percent_overall << overall_pair
    end
    overall_monthly["key"] = name + " average % of capacity"
    overall_monthly["nonStackable"] = true
    overall_monthly["values"] = monthly_percent_overall
    overall_monthly
  end


  def daily_by_range(year1, year2)
    if year1 == year2
      return daily_by_year(year1)
    elsif year1 < year2
      range = []
      (year1..year2).each do |year|
        range << daily_by_year(year)
      end
      return range
    else
      range = {}
      (year2..year1).each do |year|
        range[year] = daily_by_year(year)
      end
      return range
    end
  end

  def average_by_year(year)
    average = levels.where('extract(year from date) = ?', year).average(:level)
    av_b_yr = {}
    av_b_yr["reservoir"] = self.name
    av_b_yr["average for " + year] = average.to_f
    return av_b_yr
  end

  def average_by_range(year1, year2)
    if year1 == year2
      return average_by_year(year1)
    elsif year1 < year2
      range = {}
      (year1..year2).each do |year|
        range[year] = average_by_year(year)
      end
      return range
    else
      range = {}
      (year2..year1).each do |year|
        range[year] = average_by_year(year)
      end
      return range
    end
  end

  def average_for_year(year)
    levels.where("year = ?", year).average("level").to_i
  end

  # reformats store of averages by month to an array
  def averages_to_arr
    months = averages_by_month.keys
    arrayed = []
    (1..12).each do |i|
      pair = []
      pair << i
      pair << averages_by_month[months[i - 1]].to_f
      arrayed << pair
    end
    return arrayed
  end

  # preminiary db pull for all station averages for a given year
  def self.query_year(year)
    Reservoir.includes(:levels).group(:name).where("year = ?", year).average("level")
  end

  # compiled averages formatted for the nvd3 donut chart
  def self.all_averages(year)
    json_for_donut_chart = []
    query_year(year).each do |k, v|
      station_obj ={}
      station_obj["label"] = k
      station_obj["value"] = v.to_i
      json_for_donut_chart << station_obj
    end
    json_for_donut_chart
  end

  # representeative measure for all station averages weighted against all station capacities
  def self.statewide_average_of_capacity(year)
    summed_capacities = Reservoir.sum("max_capacity")
    summed_averages = query_year(year).values.inject(&:+)
    yearly_average = summed_averages/summed_capacities
    return yearly_average.to_f
  end

end
