class TeamMailer < ApplicationMailer
  def sent_invitation_to(user)
    @user = user
    mail to:@user.email, subject:"你好!!"
  end
end
