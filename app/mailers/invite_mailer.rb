class InviteMailer < ApplicationMailer
  def say_hello_to(user)
    @user = user
    mail to:@user.email, subject:"你好!!"
  end
end
