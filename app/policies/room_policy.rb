# frozen_string_literal: true

class RoomPolicy < ApplicationPolicy
  def create?
    if user.team.plan == 'vip'
      true
    else
      user.team.rooms.where(status: %i[notstarted started]).size < 2
    end
  end

  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end
end
