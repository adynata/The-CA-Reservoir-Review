class ReservoirsController < ApplicationController
  def index
    @reservoir_list = Reservoir.all
    render json: @reservoir_list
  end

  def show
    @reservoir = Reservoir.find(params[:id])
    render json: @reservoir
  end

  def all_daily
    @reservoir = Reservoir.find(params[:id])
    @all_levels = @reservoir.all_daily_levels
    render json: @all_levels
  end

  def coordinates
    coords = Reservoir.all_coordinates
    render json: coords
  end

  def annual
    # hard coded data here
  end

  def daily_by_year
    puts 'HELLO'
    reservoir = Reservoir.find(params[:id])
    levels = reservoir.daily_by_year(params[:year])
    render json: levels
  end

  def daily_by_range
    reservoir = Reservoir.find(params[:id])
    levels = reservoir.daily_by_range(params[:year1], params[:year2])
    render json: levels
  end

  # def self.reservoirs(*ids)
  #   reservoirs = []
  #   args.each do |arg|
  #     reservoirs << Reservoir.find([arg])
  #   end
  # end

  def self.by_river_basin(river_basin)
    Reservoir.where("river_basin = ?", river_basin)
  end

  private

  def reservoir_params
    params.require(:reservoir).permit(:id, :year1, :year2)
  end

end
