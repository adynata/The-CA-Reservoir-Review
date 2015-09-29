class ReservoirsController < ApplicationController
  def index
    @reservoir_list = Reservoir.all
    render json: @reservoir_list
  end

  def show
    @reservoir = Reservoir.find(params[:id])
    render json: @reservoir
  end

  private

  def reservoir_params
    params.require(:reservoir).permit(:id)
  end

end
