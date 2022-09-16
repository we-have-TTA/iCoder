class RoomPolicy < ApplicationPolicy
  def create?
    if user.team.plan == "vip"
      true
    else
      user.team.rooms.where(status: "Not Started").size < 2
    end
  end
  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end
end
