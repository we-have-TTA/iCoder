class Api::V1::RoomsController < ApplicationController
  def run
    render json: {params: params}
    File.write("/Users/rexkao/Project/iCoder_dev/#{current_user.id}-main.rb", "begin\n#{params[:code]}\nrescue\nputs $!\nputs $@\nend\n")
    push_code = "cat /Users/rexkao/Project/iCoder_dev/#{current_user.id}-main.rb | ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} -p 5000 '/bin/cat > /root/main.rb'"
    run_code = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} -p 5000 'ruby /root/main.rb'"
    
    p("try build ...-- #{system push_code}")
    p session[:current_language]
    p File.delete("/Users/rexkao/Project/iCoder_dev/#{current_user.id}-main.rb")
    p("try build ...-- #{system run_code}")

    puts 'OK!!'
  end
end
