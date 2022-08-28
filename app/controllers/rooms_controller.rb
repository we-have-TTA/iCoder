class RoomsController < ApplicationController
    def index
        @rooms = Room.all
    end

    def show
        @room = Room.find_by(id: params[:id]) 
    end

    def new
        @room = Room.new
    end

    def create
        @room = current_user.rooms.new(rooms_params)
        if @room.save
            redirect_to rooms_path
        else
            render :new
        end
    end

<<<<<<< HEAD
<<<<<<< HEAD

    def destroy
        @room = Rook.find_by(id: params[:id])
=======
    def destroy
        @room = Room.find_by(id: params[:id])
>>>>>>> feature/Room
=======
    def destroy
        @room = Room.find_by(id: params[:id])
>>>>>>> 6aae5bb (feat:update room controller)
        @room.destroy
        redirect_to rooms_path
    end


    private
    def rooms_params
<<<<<<< HEAD
<<<<<<< HEAD
        params.require(:room).permit(:title, :language)
=======
        params.require(:room).permit(:title, :language, :category, :status)
>>>>>>> feature/Room
=======
        params.require(:room).permit(:title, :language, :category, :status)
>>>>>>> 6aae5bb (feat:update room controller)
    end 
    
end
